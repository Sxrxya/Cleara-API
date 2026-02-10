"""
Utility functions for ML model training
"""

import logging
import random
import numpy as np
import torch
from typing import List, Tuple
import matplotlib.pyplot as plt
import seaborn as sns

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def set_seed(seed: int = 42):
    """Set random seed for reproducibility"""
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)
    logger.info(f"Random seed set to {seed}")


def count_parameters(model) -> int:
    """Count trainable parameters in model"""
    return sum(p.numel() for p in model.parameters() if p.requires_grad)


def get_device() -> torch.device:
    """Get available device (CUDA, MPS, or CPU)"""
    if torch.cuda.is_available():
        device = torch.device("cuda")
        logger.info(f"Using CUDA: {torch.cuda.get_device_name(0)}")
    elif torch.backends.mps.is_available():
        device = torch.device("mps")
        logger.info("Using Apple MPS")
    else:
        device = torch.device("cpu")
        logger.info("Using CPU")
    return device


def plot_training_history(
    train_losses: List[float],
    val_losses: List[float],
    train_accs: List[float],
    val_accs: List[float],
    save_path: str = None
):
    """Plot training history"""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
    
    # Loss plot
    ax1.plot(train_losses, label='Train Loss')
    ax1.plot(val_losses, label='Val Loss')
    ax1.set_xlabel('Epoch')
    ax1.set_ylabel('Loss')
    ax1.set_title('Training and Validation Loss')
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    
    # Accuracy plot
    ax2.plot(train_accs, label='Train Acc')
    ax2.plot(val_accs, label='Val Acc')
    ax2.set_xlabel('Epoch')
    ax2.set_ylabel('Accuracy')
    ax2.set_title('Training and Validation Accuracy')
    ax2.legend()
    ax2.grid(True, alpha=0.3)
    
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        logger.info(f"Training history saved to {save_path}")
    
    plt.show()


def plot_confusion_matrix(
    y_true: List[int],
    y_pred: List[int],
    labels: List[str] = None,
    save_path: str = None
):
    """Plot confusion matrix"""
    from sklearn.metrics import confusion_matrix
    
    cm = confusion_matrix(y_true, y_pred)
    
    plt.figure(figsize=(8, 6))
    sns.heatmap(
        cm,
        annot=True,
        fmt='d',
        cmap='Blues',
        xticklabels=labels,
        yticklabels=labels
    )
    plt.title('Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        logger.info(f"Confusion matrix saved to {save_path}")
    
    plt.show()


def calculate_metrics(y_true: List[int], y_pred: List[int]) -> dict:
    """Calculate classification metrics"""
    from sklearn.metrics import (
        accuracy_score,
        precision_score,
        recall_score,
        f1_score
    )
    
    metrics = {
        'accuracy': accuracy_score(y_true, y_pred),
        'precision': precision_score(y_true, y_pred, average='weighted'),
        'recall': recall_score(y_true, y_pred, average='weighted'),
        'f1': f1_score(y_true, y_pred, average='weighted')
    }
    
    return metrics


def create_typo_variations(text: str, num_variations: int = 5) -> List[str]:
    """Create typo variations of text"""
    variations = []
    
    # Common typo types
    typo_types = [
        lambda s: s.lower(),  # lowercase
        lambda s: s.upper(),  # uppercase
        lambda s: s.replace(' ', ''),  # remove spaces
        lambda s: s.replace('o', '0'),  # o -> 0
        lambda s: s.replace('i', '1'),  # i -> 1
        lambda s: s.replace('l', '1'),  # l -> 1
        lambda s: s + ' ',  # trailing space
        lambda s: ' ' + s,  # leading space
    ]
    
    for _ in range(num_variations):
        typo_func = random.choice(typo_types)
        variation = typo_func(text)
        if variation != text:
            variations.append(variation)
    
    return list(set(variations))[:num_variations]


def generate_email_typos(email: str) -> List[str]:
    """Generate common email typos"""
    typos = []
    
    if '@' in email:
        username, domain = email.split('@')
        
        # Domain typos
        domain_typos = {
            'gmail.com': ['gmial.com', 'gmai.com', 'gmali.com'],
            'yahoo.com': ['yahooo.com', 'yaho.com'],
            'hotmail.com': ['hotmial.com', 'hotmali.com'],
            'outlook.com': ['outlok.com', 'outloo.com'],
        }
        
        if domain in domain_typos:
            for typo_domain in domain_typos[domain]:
                typos.append(f"{username}@{typo_domain}")
    
    return typos


def batch_iterator(data: List, batch_size: int):
    """Create batches from data"""
    for i in range(0, len(data), batch_size):
        yield data[i:i + batch_size]


class EarlyStopping:
    """Early stopping to prevent overfitting"""
    
    def __init__(self, patience: int = 5, min_delta: float = 0.0):
        self.patience = patience
        self.min_delta = min_delta
        self.counter = 0
        self.best_score = None
        self.early_stop = False
    
    def __call__(self, val_loss: float) -> bool:
        score = -val_loss
        
        if self.best_score is None:
            self.best_score = score
        elif score < self.best_score + self.min_delta:
            self.counter += 1
            logger.info(f"EarlyStopping counter: {self.counter}/{self.patience}")
            if self.counter >= self.patience:
                self.early_stop = True
        else:
            self.best_score = score
            self.counter = 0
        
        return self.early_stop


class ModelCheckpoint:
    """Save best model during training"""
    
    def __init__(self, filepath: str, monitor: str = 'val_loss', mode: str = 'min'):
        self.filepath = filepath
        self.monitor = monitor
        self.mode = mode
        self.best_score = None
    
    def __call__(self, current_score: float, model, tokenizer=None) -> bool:
        """Returns True if model was saved"""
        if self.best_score is None:
            self.best_score = current_score
            self._save_model(model, tokenizer)
            return True
        
        is_better = (
            (self.mode == 'min' and current_score < self.best_score) or
            (self.mode == 'max' and current_score > self.best_score)
        )
        
        if is_better:
            logger.info(f"Metric improved from {self.best_score:.4f} to {current_score:.4f}")
            self.best_score = current_score
            self._save_model(model, tokenizer)
            return True
        
        return False
    
    def _save_model(self, model, tokenizer=None):
        """Save model and tokenizer"""
        logger.info(f"Saving model to {self.filepath}")
        
        # Save model
        if hasattr(model, 'save_pretrained'):
            model.save_pretrained(self.filepath)
        else:
            torch.save(model.state_dict(), f"{self.filepath}/model.pt")
        
        # Save tokenizer if provided
        if tokenizer and hasattr(tokenizer, 'save_pretrained'):
            tokenizer.save_pretrained(self.filepath)


def log_model_info(model):
    """Log model information"""
    num_params = count_parameters(model)
    logger.info(f"Model: {model.__class__.__name__}")
    logger.info(f"Trainable parameters: {num_params:,}")
    logger.info(f"Model size: ~{num_params * 4 / 1024 / 1024:.2f} MB")
