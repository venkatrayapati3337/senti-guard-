# SentiGuard: Sentiment Analysis & Fake News Detection

## Overview

SentiGuard is a web-based application that combines sentiment analysis and fake news detection capabilities. Built with Flask and machine learning models, it provides users with tools to analyze text for emotional tone and detect potentially misleading news content. The application features an intuitive web interface for real-time analysis and batch processing.

## Features

### Sentiment Analysis
- **Real-time Analysis**: Input text and get instant sentiment classification (Positive/Negative/Neutral)
- **Batch Processing**: Upload CSV files containing reviews or text data for bulk analysis
- **Model Integration**: Uses pre-trained machine learning models for accurate sentiment detection

### Fake News Detection
- **News Verification**: Analyze news articles to determine authenticity
- **Confidence Scores**: Get probability scores indicating the likelihood of fake news
- **Dataset Integration**: Trained on comprehensive fake news datasets

### Web Interface
- **Responsive Design**: Clean, modern UI built with HTML, CSS, and JavaScript
- **Interactive Forms**: Easy-to-use forms for text input and file uploads
- **Results Visualization**: Clear display of analysis results with confidence metrics

### Deployment Ready
- **Multiple Platforms**: Configured for deployment on Heroku, Render, Netlify, and local servers
- **Production Settings**: Includes Gunicorn configuration for production deployment
- **Static Asset Management**: Automated build process for static files

## Technology Stack

- **Backend**: Python Flask web framework
- **Machine Learning**: scikit-learn, joblib for model serialization
- **Natural Language Processing**: NLTK for text preprocessing
- **Data Processing**: NumPy, Pandas for data manipulation
- **Frontend**: HTML5, CSS3, JavaScript
- **Deployment**: Gunicorn, Heroku, Render, Netlify

## Project Structure

```
senti-guard-/
├── app.py                    # Main Flask application
├── build_static.py          # Static file build script
├── gunicorn_config.py       # Production server configuration
├── requirements.txt         # Python dependencies
├── netlify.toml            # Netlify deployment config
├── Procfile                # Heroku deployment config
├── render.yaml             # Render deployment config
├── data/
│   ├── fakenews.csv        # Fake news dataset
│   └── reviews.csv         # Sentiment analysis dataset
├── models/
│   ├── evaluate_models.py  # Model evaluation scripts
│   ├── train_fakenews.py   # Fake news model training
│   └── train_sentiment.py  # Sentiment model training
├── public/                  # Static files for deployment
│   ├── *.html
│   ├── css/
│   └── js/
├── static/                  # Development static files
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
└── templates/               # Jinja2 templates
    ├── base.html
    ├── index.html
    ├── sentiment.html
    ├── fakenews.html
    └── pipeline.html
```

## Installation

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Local Setup

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd senti-guard-
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Download NLTK data** (if not already downloaded):
   ```python
   import nltk
   nltk.download('punkt')
   nltk.download('stopwords')
   ```

4. **Run the application**:
   ```bash
   python app.py
   ```

5. **Access the application**:
   Open your browser and navigate to `http://localhost:5000`

## Usage

### Web Interface
1. **Home Page**: Overview of available features
2. **Sentiment Analysis**: Input text or upload CSV for sentiment analysis
3. **Fake News Detection**: Input news text for authenticity checking
4. **Pipeline**: Combined analysis workflow

### API Endpoints
- `GET /`: Home page
- `GET /sentiment`: Sentiment analysis page
- `POST /analyze_sentiment`: Analyze sentiment of input text
- `GET /fakenews`: Fake news detection page
- `POST /detect_fakenews`: Detect fake news in input text
- `GET /pipeline`: Combined analysis pipeline

### Model Training
To retrain models with new data:

1. **Sentiment Model**:
   ```bash
   python models/train_sentiment.py
   ```

2. **Fake News Model**:
   ```bash
   python models/train_fakenews.py
   ```

3. **Evaluate Models**:
   ```bash
   python models/evaluate_models.py
   ```

## Deployment

### Local Development
```bash
python app.py
```

### Production (Gunicorn)
```bash
gunicorn --config gunicorn_config.py app:app
```

### Heroku
1. Create Heroku app
2. Set buildpacks for Python
3. Deploy using git push or Heroku CLI

### Render
1. Connect GitHub repository
2. Use `render.yaml` configuration
3. Deploy web service

### Netlify
1. Build static files using `build_static.py`
2. Deploy `public/` directory to Netlify

## Model Details

### Sentiment Analysis Model
- **Algorithm**: [Specify algorithm, e.g., Logistic Regression, SVM]
- **Features**: TF-IDF vectorization of text
- **Accuracy**: [Include performance metrics if available]
- **Training Data**: Reviews dataset with sentiment labels

### Fake News Detection Model
- **Algorithm**: [Specify algorithm]
- **Features**: Text preprocessing with NLTK, feature extraction
- **Accuracy**: [Include performance metrics]
- **Training Data**: Fake news dataset with authenticity labels

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- NLTK library for natural language processing
- scikit-learn for machine learning algorithms
- Flask framework for web development
- Open-source datasets for model training

## Support

For questions or issues, please open an issue on the GitHub repository or contact the maintainers.</content>
<parameter name="filePath">c:\Users\ravur\senti-guard-\README.md