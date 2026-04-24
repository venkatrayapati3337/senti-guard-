"""Evaluate all models and output metrics as JSON for the accuracy chart."""
import os, sys, json, re
import pandas as pd
import numpy as np
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import f1_score, accuracy_score, precision_score, recall_score

nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)

def preprocess_text(text):
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    tokens = text.split()
    stop_words = set(stopwords.words('english'))
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(word) for word in tokens if word not in stop_words]
    return ' '.join(tokens)

BASE = os.path.dirname(__file__)
results = {"sentiment": [], "fakenews": []}

# ── Sentiment Models ─────────────────────────────────
print("Evaluating sentiment models...")
df = pd.read_csv(os.path.join(BASE, '..', 'data', 'reviews.csv'))
df['clean'] = df['text'].apply(preprocess_text)
tfidf = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
X = tfidf.fit_transform(df['clean'])
y = df['sentiment']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

for name, model in [
    ('Logistic Regression', LogisticRegression(max_iter=1000, random_state=42)),
    ('Naive Bayes', MultinomialNB()),
    ('SVM (Linear)', LinearSVC(max_iter=2000, random_state=42)),
    ('Decision Tree', DecisionTreeClassifier(random_state=42)),
    ('Random Forest', RandomForestClassifier(n_estimators=100, random_state=42)),
]:
    model.fit(X_train, y_train)
    pred = model.predict(X_test)
    results["sentiment"].append({
        "name": name,
        "accuracy": round(accuracy_score(y_test, pred) * 100, 2),
        "f1": round(f1_score(y_test, pred, average='weighted') * 100, 2),
        "precision": round(precision_score(y_test, pred, average='weighted') * 100, 2),
        "recall": round(recall_score(y_test, pred, average='weighted') * 100, 2),
    })
    print(f"  {name}: acc={results['sentiment'][-1]['accuracy']}%")

# ── Fake News Models ─────────────────────────────────
print("Evaluating fake news models...")
df2 = pd.read_csv(os.path.join(BASE, '..', 'data', 'fakenews.csv'))
df2['clean'] = df2['text'].apply(preprocess_text)
tfidf2 = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
X2 = tfidf2.fit_transform(df2['clean'])
y2 = df2['label']
X2_train, X2_test, y2_train, y2_test = train_test_split(X2, y2, test_size=0.2, random_state=42, stratify=y2)

for name, model in [
    ('Naive Bayes', MultinomialNB()),
    ('Logistic Regression', LogisticRegression(max_iter=1000, random_state=42)),
    ('SVM (Linear)', LinearSVC(max_iter=2000, random_state=42)),
]:
    model.fit(X2_train, y2_train)
    pred = model.predict(X2_test)
    results["fakenews"].append({
        "name": name,
        "accuracy": round(accuracy_score(y2_test, pred) * 100, 2),
        "f1": round(f1_score(y2_test, pred, average='weighted') * 100, 2),
        "precision": round(precision_score(y2_test, pred, average='weighted') * 100, 2),
        "recall": round(recall_score(y2_test, pred, average='weighted') * 100, 2),
    })
    print(f"  {name}: acc={results['fakenews'][-1]['accuracy']}%")

print("\n===JSON_START===")
print(json.dumps(results, indent=2))
print("===JSON_END===")
