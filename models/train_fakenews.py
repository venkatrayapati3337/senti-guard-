"""
Train Fake News Detection Model
Trains a Naive Bayes classifier on fake/real news data using TF-IDF features.
"""

import os
import sys
import pandas as pd
import numpy as np
import re
import joblib
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.metrics import f1_score, classification_report

# Download required NLTK data
nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)
nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)

def preprocess_text(text):
    """Clean and preprocess text for NLP pipeline."""
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    tokens = text.split()
    stop_words = set(stopwords.words('english'))
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(word) for word in tokens if word not in stop_words]
    return ' '.join(tokens)

def main():
    print("=" * 60)
    print("  FAKE NEWS DETECTION MODEL TRAINING")
    print("=" * 60)
    
    # Load dataset
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'fakenews.csv')
    print(f"\n[1/5] Loading dataset from {data_path}...")
    df = pd.read_csv(data_path)
    print(f"  → Loaded {len(df)} articles ({df['label'].value_counts().to_dict()})")
    
    # Preprocess
    print("\n[2/5] Preprocessing text...")
    df['clean_text'] = df['text'].apply(preprocess_text)
    print(f"  → Preprocessed {len(df)} articles")
    
    # TF-IDF Vectorization
    print("\n[3/5] Generating TF-IDF features...")
    tfidf = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
    X = tfidf.fit_transform(df['clean_text'])
    y = df['label']
    print(f"  → Feature matrix shape: {X.shape}")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    print(f"  → Train: {X_train.shape[0]}, Test: {X_test.shape[0]}")
    
    # Train models
    print("\n[4/5] Training models...")
    models = {
        'Naive Bayes': MultinomialNB(),
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
        'SVM (Linear)': LinearSVC(max_iter=2000, random_state=42),
    }
    
    best_model_name = None
    best_f1 = 0
    best_model = None
    
    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        f1 = f1_score(y_test, y_pred, average='weighted')
        print(f"  → {name}: F1 = {f1:.4f}")
        
        if f1 >= best_f1:
            best_f1 = f1
            best_model_name = name
            best_model = model
    
    print(f"\n  ★ Best model: {best_model_name} (F1 = {best_f1:.4f})")
    
    # Detailed report
    y_pred_best = best_model.predict(X_test)
    print(f"\n  Classification Report ({best_model_name}):")
    print(classification_report(y_test, y_pred_best, target_names=['FAKE', 'REAL']))
    
    # Save model and vectorizer
    print("[5/5] Saving model and vectorizer...")
    models_dir = os.path.dirname(__file__)
    
    joblib.dump(best_model, os.path.join(models_dir, 'fakenews_model.pkl'))
    joblib.dump(tfidf, os.path.join(models_dir, 'tfidf_fakenews.pkl'))
    
    print(f"  → Saved fakenews_model.pkl ({best_model_name})")
    print(f"  → Saved tfidf_fakenews.pkl")
    print(f"\n{'=' * 60}")
    print(f"  TRAINING COMPLETE!")
    print(f"{'=' * 60}")

if __name__ == '__main__':
    main()
