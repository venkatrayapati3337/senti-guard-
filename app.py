"""
Sentiment Analysis & Fake News Detection — Flask Web Application
Serves a premium web UI and provides ML-powered analysis endpoints.
"""

import os
import re
import joblib
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from flask import Flask, render_template, request, jsonify
import numpy as np

# Download required NLTK data
nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)
nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)

app = Flask(__name__)

# ── Load Models ──────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')

sentiment_model = None
sentiment_tfidf = None
fakenews_model = None
fakenews_tfidf = None

def load_models():
    """Load pre-trained models and vectorizers."""
    global sentiment_model, sentiment_tfidf, fakenews_model, fakenews_tfidf
    
    try:
        sentiment_model = joblib.load(os.path.join(MODELS_DIR, 'sentiment_model.pkl'))
        sentiment_tfidf = joblib.load(os.path.join(MODELS_DIR, 'tfidf_sentiment.pkl'))
        print("  [OK] Sentiment model loaded")
    except FileNotFoundError:
        print("  [!!] Sentiment model not found -- run models/train_sentiment.py first")
    
    try:
        fakenews_model = joblib.load(os.path.join(MODELS_DIR, 'fakenews_model.pkl'))
        fakenews_tfidf = joblib.load(os.path.join(MODELS_DIR, 'tfidf_fakenews.pkl'))
        print("  [OK] Fake news model loaded")
    except FileNotFoundError:
        print("  [!!] Fake news model not found -- run models/train_fakenews.py first")


# ── Text Preprocessing ──────────────────────────────────────
def preprocess_text(text):
    """Clean and preprocess text through the NLP pipeline."""
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    tokens = text.split()
    stop_words = set(stopwords.words('english'))
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(word) for word in tokens if word not in stop_words]
    return ' '.join(tokens)


# ── Routes ───────────────────────────────────────────────────
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/sentiment')
def sentiment_page():
    return render_template('sentiment.html')

@app.route('/fakenews')
def fakenews_page():
    return render_template('fakenews.html')

@app.route('/pipeline')
def pipeline_page():
    return render_template('pipeline.html')


# ── API Endpoints ────────────────────────────────────────────
@app.route('/api/analyze-sentiment', methods=['POST'])
def analyze_sentiment():
    """Analyze sentiment of given text."""
    if sentiment_model is None or sentiment_tfidf is None:
        return jsonify({'error': 'Sentiment model not loaded. Train the model first.'}), 503
    
    data = request.get_json()
    text = data.get('text', '').strip()
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    # Preprocess and predict
    clean = preprocess_text(text)
    features = sentiment_tfidf.transform([clean])
    prediction = sentiment_model.predict(features)[0]
    
    # Get confidence score
    if hasattr(sentiment_model, 'predict_proba'):
        probabilities = sentiment_model.predict_proba(features)[0]
        confidence = float(max(probabilities)) * 100
        class_probs = {
            cls: float(prob) * 100 
            for cls, prob in zip(sentiment_model.classes_, probabilities)
        }
    elif hasattr(sentiment_model, 'decision_function'):
        decision = sentiment_model.decision_function(features)[0]
        confidence = min(abs(float(decision)) * 20, 99.0)
        class_probs = {'positive': confidence if prediction == 'positive' else 100 - confidence,
                       'negative': confidence if prediction == 'negative' else 100 - confidence}
    else:
        confidence = 85.0
        class_probs = {'positive': 85.0 if prediction == 'positive' else 15.0,
                       'negative': 85.0 if prediction == 'negative' else 15.0}
    
    return jsonify({
        'sentiment': prediction,
        'confidence': round(confidence, 2),
        'probabilities': class_probs,
        'processed_text': clean
    })


@app.route('/api/detect-fakenews', methods=['POST'])
def detect_fakenews():
    """Detect if given text is fake or real news."""
    if fakenews_model is None or fakenews_tfidf is None:
        return jsonify({'error': 'Fake news model not loaded. Train the model first.'}), 503
    
    data = request.get_json()
    text = data.get('text', '').strip()
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    # Preprocess and predict
    clean = preprocess_text(text)
    features = fakenews_tfidf.transform([clean])
    prediction = fakenews_model.predict(features)[0]
    
    # Get confidence score
    if hasattr(fakenews_model, 'predict_proba'):
        probabilities = fakenews_model.predict_proba(features)[0]
        confidence = float(max(probabilities)) * 100
        class_probs = {
            cls: float(prob) * 100 
            for cls, prob in zip(fakenews_model.classes_, probabilities)
        }
    elif hasattr(fakenews_model, 'decision_function'):
        decision = fakenews_model.decision_function(features)[0]
        confidence = min(abs(float(decision)) * 20, 99.0)
        class_probs = {'REAL': confidence if prediction == 'REAL' else 100 - confidence,
                       'FAKE': confidence if prediction == 'FAKE' else 100 - confidence}
    else:
        confidence = 85.0
        class_probs = {'REAL': 85.0 if prediction == 'REAL' else 15.0,
                       'FAKE': 85.0 if prediction == 'FAKE' else 15.0}
    
    return jsonify({
        'prediction': prediction,
        'confidence': round(confidence, 2),
        'probabilities': class_probs,
        'processed_text': clean
    })


# ── Load models on import (needed for gunicorn workers) ──────
print("\n" + "=" * 60)
print("  SENTIMENT ANALYSIS & FAKE NEWS DETECTION")
print("=" * 60)
print("\n  Loading models...")
load_models()
print("  Models ready.\n")


# ── Run (local development only) ────────────────────────────
if __name__ == '__main__':
    print(f"  Starting server on http://127.0.0.1:5000")
    print("=" * 60 + "\n")
    app.run(debug=True, host='127.0.0.1', port=5000)

