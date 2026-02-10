"""
Training script for deduplication model
Fine-tunes sentence-transformers for duplicate detection
"""

import argparse
import logging
from pathlib import Path
import pandas as pd
import torch
from sentence_transformers import SentenceTransformer, InputExample, losses
from sentence_transformers.evaluation import EmbeddingSimilarityEvaluator
from torch.utils.data import DataLoader
from typing import List, Tuple
import numpy as np

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DeduplicationTrainer:
    """Trainer for deduplication model using sentence transformers"""
    
    def __init__(
        self,
        base_model: str = "sentence-transformers/all-MiniLM-L6-v2",
        output_dir: str = "models/deduplication",
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
        
        # Load base model
        logger.info(f"Loading base model: {base_model}")
        self.model = SentenceTransformer(base_model, device=self.device)
        
    def load_training_data(self, data_path: str) -> List[InputExample]:
        """
        Load training data from CSV
        Expected columns: text1, text2, label (1 for duplicate, 0 for not)
        """
        logger.info(f"Loading training data from {data_path}")
        df = pd.read_csv(data_path)
        
        examples = []
        for _, row in df.iterrows():
            example = InputExample(
                texts=[row['text1'], row['text2']],
                label=float(row['label'])
            )
            examples.append(example)
        
        logger.info(f"Loaded {len(examples)} training examples")
        return examples
    
    def create_synthetic_data(self, num_samples: int = 10000) -> List[InputExample]:
        """
        Create synthetic training data for deduplication
        Generates pairs with typos, case variations, etc.
        """
        logger.info(f"Generating {num_samples} synthetic examples")
        
        # Sample names and companies
        names = [
            "John Doe", "Jane Smith", "Robert Johnson", "Mary Williams",
            "Michael Brown", "Sarah Davis", "David Miller", "Emily Wilson",
            "James Anderson", "Lisa Taylor", "Christopher Martinez", "Jennifer Garcia"
        ]
        
        companies = [
            "Acme Corp", "TechStart Inc", "Global Solutions", "DataFlow Systems",
            "CloudBase Technologies", "InnovateLab", "NextGen Software"
        ]
        
        examples = []
        
        for _ in range(num_samples // 2):
            # Positive examples (duplicates with variations)
            original = np.random.choice(names)
            
            # Create variations
            variations = [
                original.lower(),  # lowercase
                original.upper(),  # uppercase
                original.replace(" ", ""),  # no space
                original.replace("o", "0"),  # typo
                original + " ",  # trailing space
                " " + original,  # leading space
            ]
            
            variant = np.random.choice(variations)
            examples.append(InputExample(texts=[original, variant], label=1.0))
        
        for _ in range(num_samples // 2):
            # Negative examples (different entities)
            name1 = np.random.choice(names)
            name2 = np.random.choice([n for n in names if n != name1])
            examples.append(InputExample(texts=[name1, name2], label=0.0))
        
        logger.info(f"Generated {len(examples)} synthetic examples")
        return examples
    
    def train(
        self,
        train_examples: List[InputExample],
        eval_examples: List[InputExample] = None,
        epochs: int = 10,
        batch_size: int = 32,
        warmup_steps: int = 100,
        evaluation_steps: int = 500
    ):
        """Train the model"""
        logger.info("Starting training...")
        
        # Create DataLoader
        train_dataloader = DataLoader(
            train_examples,
            shuffle=True,
            batch_size=batch_size
        )
        
        # Define loss function
        train_loss = losses.CosineSimilarityLoss(self.model)
        
        # Create evaluator if eval data provided
        evaluator = None
        if eval_examples:
            sentences1 = [ex.texts[0] for ex in eval_examples]
            sentences2 = [ex.texts[1] for ex in eval_examples]
            scores = [ex.label for ex in eval_examples]
            
            evaluator = EmbeddingSimilarityEvaluator(
                sentences1,
                sentences2,
                scores,
                name="eval"
            )
        
        # Train
        self.model.fit(
            train_objectives=[(train_dataloader, train_loss)],
            epochs=epochs,
            warmup_steps=warmup_steps,
            evaluator=evaluator,
            evaluation_steps=evaluation_steps,
            output_path=str(self.output_dir),
            save_best_model=True,
            show_progress_bar=True
        )
        
        logger.info(f"Training complete. Model saved to {self.output_dir}")
    
    def evaluate(self, test_examples: List[InputExample]) -> dict:
        """Evaluate model performance"""
        logger.info("Evaluating model...")
        
        sentences1 = [ex.texts[0] for ex in test_examples]
        sentences2 = [ex.texts[1] for ex in test_examples]
        true_labels = [ex.label for ex in test_examples]
        
        # Get embeddings
        embeddings1 = self.model.encode(sentences1, convert_to_tensor=True)
        embeddings2 = self.model.encode(sentences2, convert_to_tensor=True)
        
        # Calculate cosine similarity
        cosine_scores = torch.nn.functional.cosine_similarity(
            embeddings1,
            embeddings2
        ).cpu().numpy()
        
        # Calculate metrics at different thresholds
        thresholds = [0.7, 0.75, 0.8, 0.85, 0.9]
        results = {}
        
        for threshold in thresholds:
            predictions = (cosine_scores >= threshold).astype(int)
            
            # Calculate accuracy, precision, recall
            correct = sum(p == t for p, t in zip(predictions, true_labels))
            accuracy = correct / len(true_labels)
            
            tp = sum(p == 1 and t == 1 for p, t in zip(predictions, true_labels))
            fp = sum(p == 1 and t == 0 for p, t in zip(predictions, true_labels))
            fn = sum(p == 0 and t == 1 for p, t in zip(predictions, true_labels))
            
            precision = tp / (tp + fp) if (tp + fp) > 0 else 0
            recall = tp / (tp + fn) if (tp + fn) > 0 else 0
            f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
            
            results[threshold] = {
                'accuracy': accuracy,
                'precision': precision,
                'recall': recall,
                'f1': f1
            }
            
            logger.info(f"Threshold {threshold}: Acc={accuracy:.3f}, P={precision:.3f}, R={recall:.3f}, F1={f1:.3f}")
        
        return results
    
    def export_onnx(self, output_path: str = None):
        """Export model to ONNX format for faster inference"""
        if output_path is None:
            output_path = self.output_dir / "model.onnx"
        
        logger.info(f"Exporting to ONNX: {output_path}")
        
        # This is a placeholder - actual ONNX export requires more setup
        # For sentence transformers, we'd need to export the underlying transformer
        logger.warning("ONNX export not fully implemented yet")
        
        return output_path


def main():
    parser = argparse.ArgumentParser(description="Train deduplication model")
    parser.add_argument("--base-model", default="sentence-transformers/all-MiniLM-L6-v2")
    parser.add_argument("--data", help="Path to training data CSV")
    parser.add_argument("--output", default="models/deduplication")
    parser.add_argument("--epochs", type=int, default=10)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--synthetic", action="store_true", help="Use synthetic data")
    parser.add_argument("--num-synthetic", type=int, default=10000)
    
    args = parser.parse_args()
    
    # Initialize trainer
    trainer = DeduplicationTrainer(
        base_model=args.base_model,
        output_dir=args.output
    )
    
    # Load or generate training data
    if args.synthetic or not args.data:
        logger.info("Using synthetic training data")
        train_examples = trainer.create_synthetic_data(args.num_synthetic)
        
        # Split into train/eval
        split_idx = int(len(train_examples) * 0.8)
        eval_examples = train_examples[split_idx:]
        train_examples = train_examples[:split_idx]
    else:
        train_examples = trainer.load_training_data(args.data)
        eval_examples = None
    
    # Train
    trainer.train(
        train_examples=train_examples,
        eval_examples=eval_examples,
        epochs=args.epochs,
        batch_size=args.batch_size
    )
    
    # Evaluate
    if eval_examples:
        results = trainer.evaluate(eval_examples)
        logger.info(f"Evaluation results: {results}")
    
    logger.info("Training complete!")


if __name__ == "__main__":
    main()
