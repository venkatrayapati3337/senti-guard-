"""Build static HTML files from Flask/Jinja2 templates for Netlify deployment."""
import os, re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES = os.path.join(BASE_DIR, 'templates')
PUBLIC = os.path.join(BASE_DIR, 'public')
os.makedirs(os.path.join(PUBLIC, 'css'), exist_ok=True)
os.makedirs(os.path.join(PUBLIC, 'js'), exist_ok=True)

# Read base template
with open(os.path.join(TEMPLATES, 'base.html'), 'r', encoding='utf-8') as f:
    base = f.read()

# Fix url_for references
base = base.replace("{{ url_for('static', filename='css/style.css') }}", "/css/style.css")
base = base.replace("{{ url_for('static', filename='js/app.js') }}", "/js/app.js")

# Fix nav links for static
base = base.replace('href="/"', 'href="/"')
base = base.replace('href="/sentiment"', 'href="/sentiment.html"')
base = base.replace('href="/fakenews"', 'href="/fakenews.html"')
base = base.replace('href="/pipeline"', 'href="/pipeline.html"')

# Remove Jinja blocks/tags from base
base = re.sub(r'\{%\s*block\s+scripts\s*%\}\{%\s*endblock\s*%\}', '', base)

pages = {
    'index.html': ('index.html', '/'),
    'sentiment.html': ('sentiment.html', '/sentiment.html'),
    'fakenews.html': ('fakenews.html', '/fakenews.html'),
    'pipeline.html': ('pipeline.html', '/pipeline.html'),
}

for out_name, (template_name, path) in pages.items():
    with open(os.path.join(TEMPLATES, template_name), 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract title block
    title_match = re.search(r'\{%\s*block\s+title\s*%\}(.*?)\{%\s*endblock\s*%\}', content)
    title = title_match.group(1) if title_match else 'SentiGuard AI'
    
    # Extract meta_desc block
    meta_match = re.search(r'\{%\s*block\s+meta_desc\s*%\}(.*?)\{%\s*endblock\s*%\}', content)
    meta_desc = meta_match.group(1) if meta_match else ''
    
    # Extract content block
    content_match = re.search(r'\{%\s*block\s+content\s*%\}(.*?)\{%\s*endblock\s*%\}', content, re.DOTALL)
    body_content = content_match.group(1) if content_match else ''
    
    # Build page from base
    page = base
    page = re.sub(r'\{%\s*block\s+title\s*%\}.*?\{%\s*endblock\s*%\}', title, page)
    page = re.sub(r'\{%\s*block\s+meta_desc\s*%\}.*?\{%\s*endblock\s*%\}', meta_desc, page)
    # Use string replace to avoid regex backslash issues in content
    placeholder = '{% block content %}{% endblock %}'
    page = page.replace(placeholder, body_content)
    
    # Remove extends
    page = re.sub(r'\{%\s*extends\s+.*?%\}', '', page)
    
    # Fix nav active state
    page = re.sub(r'\{%\s*if\s+request\.path\s*==\s*.*?%\}active\{%\s*endif\s*%\}', '', page)
    # Set active nav for this page
    if path == '/':
        page = page.replace('id="nav-home">Home', 'id="nav-home" class="nav-link active">Home').replace('class="nav-link " id="nav-home" class="nav-link active"', 'class="nav-link active" id="nav-home"')
    
    # Fix remaining Jinja
    page = re.sub(r'\{%.*?%\}', '', page)
    page = re.sub(r'\{\{.*?\}\}', '', page)
    
    # Fix footer links
    page = page.replace('href="/sentiment"', 'href="/sentiment.html"')
    page = page.replace('href="/fakenews"', 'href="/fakenews.html"')
    page = page.replace('href="/pipeline"', 'href="/pipeline.html"')
    
    with open(os.path.join(PUBLIC, out_name), 'w', encoding='utf-8') as f:
        f.write(page)
    print(f"  Built: {out_name}")

# Copy CSS
import shutil
shutil.copy2(os.path.join(BASE_DIR, 'static', 'css', 'style.css'), os.path.join(PUBLIC, 'css', 'style.css'))
print("  Copied: css/style.css")

print("\nDone! Static site built in /public/")
