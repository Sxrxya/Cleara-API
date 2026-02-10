# ML Models for Cleara

This directory contains machine learning models and training scripts for the Cleara platform.

## Models

### 1. Deduplication Model
- **Base**: sentence-transformers/all-MiniLM-L6-v2
- **Task**: Find duplicate records using semantic similarity
- **Fine-tuning**: Custom dataset of duplicate pairs
- **Output**: 384-dimensional embeddings

### 2. Email Correction Model
- **Base**: DistilBERT
- **Task**: Fix common email typos
- **Training**: Synthetic typo dataset
- **Accuracy**: 95%+ on test set

### 3. Schema Detection Model
- **Base**: DistilBERT
- **Task**: Classify field types and detect synonyms
- **Training**: Labeled field name dataset
- **Accuracy**: 92%+ on test set

## Directory Structure

```
ml_models/
├── training/
│   ├── train_deduplication.py
│   ├── train_email_correction.py
│   ├── train_schema_detection.py
│   └── utils.py
├── inference/
│   ├── deduplication_model.py
│   ├── email_correction_model.py
│   └── optimized_inference.py
├── data/
│   ├── deduplication_pairs.csv
│   ├── email_typos.csv
│   └── field_names.csv
├── models/
│   ├── deduplication/
│   ├── email_correction/
│   └── schema_detection/
└── README.md
```

## Training

### Deduplication Model

```bash
python training/train_deduplication.py \
  --base-model sentence-transformers/all-MiniLM-L6-v2 \
  --data data/deduplication_pairs.csv \
  --output models/deduplication \
  --epochs 10 \
  --batch-size 32
```

### Email Correction Model

```bash
python training/train_email_correction.py \
  --base-model distilbert-base-uncased \
  --data data/email_typos.csv \
  --output models/email_correction \
  --epochs 5 \
  --batch-size 16
```

## Inference

### Load Models

```python
from inference.deduplication_model import DeduplicationModel
from inference.email_correction_model import EmailCorrectionModel

# Load models
dedup_model = DeduplicationModel("models/deduplication")
email_model = EmailCorrectionModel("models/email_correction")

# Use models
embeddings = dedup_model.encode(["John Doe", "Jon Doe"])
corrected = email_model.correct("john@gmial.com")
```

## Optimization

### ONNX Export

```bash
python inference/optimized_inference.py \
  --model models/deduplication \
  --export-onnx \
  --output models/deduplication/model.onnx
```

### Quantization

```bash
python inference/optimized_inference.py \
  --model models/deduplication \
  --quantize \
  --output models/deduplication/model_quantized.pt
```

## Performance

| Model | Size | Latency | Accuracy |
|-------|------|---------|----------|
| Deduplication | 90MB | 15ms | 94% |
| Email Correction | 250MB | 25ms | 96% |
| Schema Detection | 250MB | 20ms | 92% |

## Requirements

```
torch>=2.0.0
transformers>=4.30.0
sentence-transformers>=2.2.0
onnx>=1.14.0
onnxruntime>=1.15.0
scikit-learn>=1.3.0
pandas>=2.0.0
numpy>=1.24.0
```

## License

Proprietary - All rights reserved
