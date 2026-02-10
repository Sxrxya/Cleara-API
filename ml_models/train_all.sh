#!/bin/bash

# Cleara ML Models - Quick Training Script
# This script trains all models with synthetic data

echo "🚀 Starting Cleara ML Model Training"
echo "===================================="

# Create directories
mkdir -p models/deduplication
mkdir -p models/email_correction
mkdir -p models/schema_detection
mkdir -p data
mkdir -p logs

# Install requirements
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Train Deduplication Model
echo ""
echo "🔄 Training Deduplication Model..."
python training/train_deduplication.py \
  --base-model sentence-transformers/all-MiniLM-L6-v2 \
  --output models/deduplication \
  --epochs 10 \
  --batch-size 32 \
  --synthetic \
  --num-synthetic 10000 \
  2>&1 | tee logs/deduplication_training.log

# Train Email Correction Model
echo ""
echo "📧 Training Email Correction Model..."
python training/train_email_correction.py \
  --base-model distilbert-base-uncased \
  --output models/email_correction \
  --epochs 5 \
  --batch-size 16 \
  --num-samples 10000 \
  2>&1 | tee logs/email_correction_training.log

# Optimize Models
echo ""
echo "⚡ Optimizing models for inference..."
python inference/optimized_inference.py \
  --model models/deduplication \
  --benchmark \
  2>&1 | tee logs/optimization.log

echo ""
echo "✅ Training Complete!"
echo "===================================="
echo "Models saved to:"
echo "  - models/deduplication/"
echo "  - models/email_correction/"
echo ""
echo "Logs saved to logs/"
echo ""
echo "Next steps:"
echo "  1. Test models: python test_models.py"
echo "  2. Copy models to backend: cp -r models ../backend/app/ml_models/"
echo "  3. Restart backend API"
