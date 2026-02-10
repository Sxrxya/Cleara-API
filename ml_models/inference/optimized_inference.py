"""
Optimized inference for ML models
Includes ONNX export, quantization, and batching
"""

import argparse
import logging
from pathlib import Path
import time
import torch
import onnx
import onnxruntime as ort
from sentence_transformers import SentenceTransformer
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
import numpy as np
from typing import List, Union

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class OptimizedDeduplicationModel:
    """Optimized deduplication model with ONNX support"""
    
    def __init__(self, model_path: str, use_onnx: bool = False):
        self.model_path = Path(model_path)
        self.use_onnx = use_onnx
        
        if use_onnx:
            onnx_path = self.model_path / "model.onnx"
            if onnx_path.exists():
                logger.info(f"Loading ONNX model from {onnx_path}")
                self.session = ort.InferenceSession(str(onnx_path))
                self.model = None
            else:
                logger.warning("ONNX model not found, falling back to PyTorch")
                self.use_onnx = False
                self._load_pytorch_model()
        else:
            self._load_pytorch_model()
    
    def _load_pytorch_model(self):
        """Load PyTorch model"""
        logger.info(f"Loading PyTorch model from {self.model_path}")
        self.model = SentenceTransformer(str(self.model_path))
        self.session = None
    
    def encode(
        self,
        sentences: Union[str, List[str]],
        batch_size: int = 32,
        show_progress: bool = False
    ) -> np.ndarray:
        """Encode sentences to embeddings"""
        if isinstance(sentences, str):
            sentences = [sentences]
        
        if self.use_onnx and self.session:
            return self._encode_onnx(sentences, batch_size)
        else:
            return self.model.encode(
                sentences,
                batch_size=batch_size,
                show_progress_bar=show_progress,
                convert_to_numpy=True
            )
    
    def _encode_onnx(self, sentences: List[str], batch_size: int) -> np.ndarray:
        """Encode using ONNX runtime"""
        # This is a placeholder - actual ONNX encoding requires tokenization
        logger.warning("ONNX encoding not fully implemented")
        return self.model.encode(sentences, batch_size=batch_size, convert_to_numpy=True)
    
    def find_duplicates(
        self,
        texts: List[str],
        threshold: float = 0.85,
        batch_size: int = 32
    ) -> List[tuple]:
        """Find duplicate pairs in a list of texts"""
        logger.info(f"Finding duplicates in {len(texts)} texts")
        start_time = time.time()
        
        # Encode all texts
        embeddings = self.encode(texts, batch_size=batch_size)
        
        # Calculate pairwise similarities
        duplicates = []
        for i in range(len(texts)):
            for j in range(i + 1, len(texts)):
                similarity = np.dot(embeddings[i], embeddings[j]) / (
                    np.linalg.norm(embeddings[i]) * np.linalg.norm(embeddings[j])
                )
                
                if similarity >= threshold:
                    duplicates.append((i, j, similarity))
        
        elapsed = time.time() - start_time
        logger.info(f"Found {len(duplicates)} duplicate pairs in {elapsed:.2f}s")
        
        return duplicates


class OptimizedEmailCorrectionModel:
    """Optimized email correction model"""
    
    def __init__(self, model_path: str, quantize: bool = False):
        self.model_path = Path(model_path)
        self.quantize = quantize
        
        logger.info(f"Loading email correction model from {model_path}")
        
        # Load tokenizer
        self.tokenizer = DistilBertTokenizer.from_pretrained(str(model_path))
        
        # Load model
        self.model = DistilBertForSequenceClassification.from_pretrained(str(model_path))
        
        # Quantize if requested
        if quantize:
            logger.info("Applying dynamic quantization")
            self.model = torch.quantization.quantize_dynamic(
                self.model,
                {torch.nn.Linear},
                dtype=torch.qint8
            )
        
        self.model.eval()
        
        # Common typo corrections (fallback)
        self.typo_map = {
            'gmial': 'gmail',
            'gmai': 'gmail',
            'gmali': 'gmail',
            'yahooo': 'yahoo',
            'yaho': 'yahoo',
            'hotmial': 'hotmail',
            'outlok': 'outlook',
        }
    
    def has_typo(self, email: str) -> bool:
        """Check if email has a typo"""
        # Tokenize
        inputs = self.tokenizer(
            email,
            return_tensors='pt',
            max_length=64,
            padding='max_length',
            truncation=True
        )
        
        # Predict
        with torch.no_grad():
            outputs = self.model(**inputs)
            prediction = torch.argmax(outputs.logits, dim=1).item()
        
        return prediction == 1  # 1 = has typo
    
    def correct(self, email: str) -> str:
        """Correct email typo"""
        # Check if has typo
        if not self.has_typo(email):
            return email
        
        # Apply rule-based corrections
        for typo, correction in self.typo_map.items():
            if typo in email:
                return email.replace(typo, correction)
        
        return email
    
    def batch_correct(self, emails: List[str]) -> List[str]:
        """Correct multiple emails"""
        return [self.correct(email) for email in emails]


class ModelOptimizer:
    """Utility class for model optimization"""
    
    @staticmethod
    def export_to_onnx(
        model_path: str,
        output_path: str,
        sample_input: torch.Tensor = None
    ):
        """Export PyTorch model to ONNX"""
        logger.info(f"Exporting model to ONNX: {output_path}")
        
        # Load model
        model = SentenceTransformer(model_path)
        model.eval()
        
        # Create sample input if not provided
        if sample_input is None:
            sample_input = torch.randint(0, 1000, (1, 128))  # Sample token IDs
        
        # Export
        torch.onnx.export(
            model,
            sample_input,
            output_path,
            export_params=True,
            opset_version=14,
            do_constant_folding=True,
            input_names=['input'],
            output_names=['output'],
            dynamic_axes={
                'input': {0: 'batch_size'},
                'output': {0: 'batch_size'}
            }
        )
        
        logger.info(f"Model exported to {output_path}")
    
    @staticmethod
    def quantize_model(model_path: str, output_path: str):
        """Quantize model for faster inference"""
        logger.info(f"Quantizing model: {model_path}")
        
        # Load model
        model = torch.load(model_path)
        
        # Apply dynamic quantization
        quantized_model = torch.quantization.quantize_dynamic(
            model,
            {torch.nn.Linear},
            dtype=torch.qint8
        )
        
        # Save
        torch.save(quantized_model, output_path)
        logger.info(f"Quantized model saved to {output_path}")
    
    @staticmethod
    def benchmark_model(model, sample_inputs: List, num_runs: int = 100):
        """Benchmark model inference speed"""
        logger.info(f"Benchmarking model with {num_runs} runs")
        
        # Warmup
        for _ in range(10):
            _ = model.encode(sample_inputs[0])
        
        # Benchmark
        start_time = time.time()
        for _ in range(num_runs):
            for sample in sample_inputs:
                _ = model.encode(sample)
        elapsed = time.time() - start_time
        
        avg_time = (elapsed / num_runs / len(sample_inputs)) * 1000  # ms
        logger.info(f"Average inference time: {avg_time:.2f}ms")
        
        return avg_time


def main():
    parser = argparse.ArgumentParser(description="Optimize ML models")
    parser.add_argument("--model", required=True, help="Path to model")
    parser.add_argument("--export-onnx", action="store_true", help="Export to ONNX")
    parser.add_argument("--quantize", action="store_true", help="Quantize model")
    parser.add_argument("--benchmark", action="store_true", help="Benchmark model")
    parser.add_argument("--output", help="Output path")
    
    args = parser.parse_args()
    
    if args.export_onnx:
        output = args.output or f"{args.model}/model.onnx"
        ModelOptimizer.export_to_onnx(args.model, output)
    
    if args.quantize:
        output = args.output or f"{args.model}_quantized.pt"
        ModelOptimizer.quantize_model(args.model, output)
    
    if args.benchmark:
        model = OptimizedDeduplicationModel(args.model)
        sample_inputs = [
            "John Doe",
            "Jane Smith",
            "Acme Corporation"
        ]
        ModelOptimizer.benchmark_model(model, sample_inputs)


if __name__ == "__main__":
    main()
