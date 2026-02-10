"""
Training script for email correction model
Fine-tunes DistilBERT for email typo correction
"""

import argparse
import logging
from pathlib import Path
import pandas as pd
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import (
    DistilBertTokenizer,
    DistilBertForSequenceClassification,
    AdamW,
    get_linear_schedule_with_warmup
)
from sklearn.model_selection import train_test_split
from tqdm import tqdm
import numpy as np

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class EmailTypoDataset(Dataset):
    """Dataset for email typo correction"""
    
    def __init__(self, emails, labels, tokenizer, max_length=64):
        self.emails = emails
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length
    
    def __len__(self):
        return len(self.emails)
    
    def __getitem__(self, idx):
        email = self.emails[idx]
        label = self.labels[idx]
        
        encoding = self.tokenizer(
            email,
            add_special_tokens=True,
            max_length=self.max_length,
            padding='max_length',
            truncation=True,
            return_tensors='pt'
        )
        
        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'label': torch.tensor(label, dtype=torch.long)
        }


class EmailCorrectionTrainer:
    """Trainer for email correction model"""
    
    def __init__(
        self,
        base_model: str = "distilbert-base-uncased",
        output_dir: str = "models/email_correction",
        device: str = None
    ):
        self.base_model = base_model
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Set device
        if device is None:
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
        else:
            self.device = device
        
        logger.info(f"Using device: {self.device}")
        
        # Common email typos mapping
        self.typo_corrections = {
            'gmial': 'gmail',
            'gmai': 'gmail',
            'gmali': 'gmail',
            'yahooo': 'yahoo',
            'yaho': 'yahoo',
            'hotmial': 'hotmail',
            'hotmali': 'hotmail',
            'outlok': 'outlook',
            'outloo': 'outlook',
        }
        
        # Load tokenizer
        logger.info(f"Loading tokenizer: {base_model}")
        self.tokenizer = DistilBertTokenizer.from_pretrained(base_model)
        
        # Model will be initialized during training
        self.model = None
    
    def create_synthetic_data(self, num_samples: int = 10000):
        """Generate synthetic email typo data"""
        logger.info(f"Generating {num_samples} synthetic email examples")
        
        # Common email domains
        correct_domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']
        typo_domains = {
            'gmail.com': ['gmial.com', 'gmai.com', 'gmali.com', 'gmil.com'],
            'yahoo.com': ['yahooo.com', 'yaho.com', 'yhoo.com'],
            'hotmail.com': ['hotmial.com', 'hotmali.com', 'hotmai.com'],
            'outlook.com': ['outlok.com', 'outloo.com', 'outluk.com'],
        }
        
        # Common usernames
        usernames = [
            'john.doe', 'jane.smith', 'user123', 'contact', 'info',
            'support', 'admin', 'hello', 'test', 'demo'
        ]
        
        emails = []
        labels = []  # 0 = correct, 1 = has typo
        
        # Generate correct emails
        for _ in range(num_samples // 2):
            username = np.random.choice(usernames)
            domain = np.random.choice(correct_domains)
            email = f"{username}@{domain}"
            emails.append(email)
            labels.append(0)  # Correct
        
        # Generate emails with typos
        for _ in range(num_samples // 2):
            username = np.random.choice(usernames)
            correct_domain = np.random.choice(correct_domains)
            typo_domain = np.random.choice(typo_domains[correct_domain])
            email = f"{username}@{typo_domain}"
            emails.append(email)
            labels.append(1)  # Has typo
        
        logger.info(f"Generated {len(emails)} email examples")
        return emails, labels
    
    def train(
        self,
        emails,
        labels,
        epochs: int = 5,
        batch_size: int = 16,
        learning_rate: float = 2e-5,
        val_split: float = 0.2
    ):
        """Train the model"""
        logger.info("Starting training...")
        
        # Split data
        train_emails, val_emails, train_labels, val_labels = train_test_split(
            emails, labels, test_size=val_split, random_state=42
        )
        
        # Create datasets
        train_dataset = EmailTypoDataset(train_emails, train_labels, self.tokenizer)
        val_dataset = EmailTypoDataset(val_emails, val_labels, self.tokenizer)
        
        # Create dataloaders
        train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
        val_loader = DataLoader(val_dataset, batch_size=batch_size)
        
        # Initialize model
        logger.info(f"Loading model: {self.base_model}")
        self.model = DistilBertForSequenceClassification.from_pretrained(
            self.base_model,
            num_labels=2  # Binary classification: correct vs typo
        )
        self.model.to(self.device)
        
        # Optimizer and scheduler
        optimizer = AdamW(self.model.parameters(), lr=learning_rate)
        total_steps = len(train_loader) * epochs
        scheduler = get_linear_schedule_with_warmup(
            optimizer,
            num_warmup_steps=total_steps // 10,
            num_training_steps=total_steps
        )
        
        # Training loop
        best_val_acc = 0
        for epoch in range(epochs):
            logger.info(f"Epoch {epoch + 1}/{epochs}")
            
            # Train
            self.model.train()
            train_loss = 0
            train_correct = 0
            train_total = 0
            
            for batch in tqdm(train_loader, desc="Training"):
                optimizer.zero_grad()
                
                input_ids = batch['input_ids'].to(self.device)
                attention_mask = batch['attention_mask'].to(self.device)
                labels = batch['label'].to(self.device)
                
                outputs = self.model(
                    input_ids=input_ids,
                    attention_mask=attention_mask,
                    labels=labels
                )
                
                loss = outputs.loss
                loss.backward()
                optimizer.step()
                scheduler.step()
                
                train_loss += loss.item()
                
                # Calculate accuracy
                predictions = torch.argmax(outputs.logits, dim=1)
                train_correct += (predictions == labels).sum().item()
                train_total += labels.size(0)
            
            train_acc = train_correct / train_total
            avg_train_loss = train_loss / len(train_loader)
            
            # Validate
            val_acc, val_loss = self.evaluate(val_loader)
            
            logger.info(f"Train Loss: {avg_train_loss:.4f}, Train Acc: {train_acc:.4f}")
            logger.info(f"Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.4f}")
            
            # Save best model
            if val_acc > best_val_acc:
                best_val_acc = val_acc
                self.save_model()
                logger.info(f"Saved best model with val_acc: {val_acc:.4f}")
        
        logger.info(f"Training complete. Best val_acc: {best_val_acc:.4f}")
    
    def evaluate(self, dataloader):
        """Evaluate model"""
        self.model.eval()
        total_loss = 0
        correct = 0
        total = 0
        
        with torch.no_grad():
            for batch in dataloader:
                input_ids = batch['input_ids'].to(self.device)
                attention_mask = batch['attention_mask'].to(self.device)
                labels = batch['label'].to(self.device)
                
                outputs = self.model(
                    input_ids=input_ids,
                    attention_mask=attention_mask,
                    labels=labels
                )
                
                total_loss += outputs.loss.item()
                
                predictions = torch.argmax(outputs.logits, dim=1)
                correct += (predictions == labels).sum().item()
                total += labels.size(0)
        
        accuracy = correct / total
        avg_loss = total_loss / len(dataloader)
        
        return accuracy, avg_loss
    
    def save_model(self):
        """Save model and tokenizer"""
        logger.info(f"Saving model to {self.output_dir}")
        self.model.save_pretrained(self.output_dir)
        self.tokenizer.save_pretrained(self.output_dir)
    
    def correct_email(self, email: str) -> str:
        """Correct email typos using rule-based approach"""
        # Simple rule-based correction for common typos
        for typo, correction in self.typo_corrections.items():
            if typo in email:
                return email.replace(typo, correction)
        return email


def main():
    parser = argparse.ArgumentParser(description="Train email correction model")
    parser.add_argument("--base-model", default="distilbert-base-uncased")
    parser.add_argument("--output", default="models/email_correction")
    parser.add_argument("--epochs", type=int, default=5)
    parser.add_argument("--batch-size", type=int, default=16)
    parser.add_argument("--num-samples", type=int, default=10000)
    
    args = parser.parse_args()
    
    # Initialize trainer
    trainer = EmailCorrectionTrainer(
        base_model=args.base_model,
        output_dir=args.output
    )
    
    # Generate synthetic data
    emails, labels = trainer.create_synthetic_data(args.num_samples)
    
    # Train
    trainer.train(
        emails=emails,
        labels=labels,
        epochs=args.epochs,
        batch_size=args.batch_size
    )
    
    logger.info("Training complete!")


if __name__ == "__main__":
    main()
