"""Gunicorn configuration for production deployment."""

import os

# Bind to the port Render provides, or default to 5000
bind = f"0.0.0.0:{os.environ.get('PORT', '5000')}"

# Workers — Render free tier has 512MB RAM, keep it light
workers = 2
worker_class = "sync"
timeout = 120

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"
