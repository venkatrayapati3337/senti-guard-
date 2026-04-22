// ── SentiGuard AI — Enhanced Frontend ────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavbar();
    initStatCounters();
    initScrollAnimations();
    initSentimentPage();
    initFakeNewsPage();
});

// ── Particle Background ──────────────────────────────────
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 2 + 0.5, opacity: Math.random() * 0.4 + 0.1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139, 108, 255, ${p.opacity})`;
            ctx.fill();
        });
        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(139, 108, 255, ${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// ── Navbar ───────────────────────────────────────────────
function initNavbar() {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    const navbar = document.getElementById('navbar');
    if (toggle && links) toggle.addEventListener('click', () => links.classList.toggle('open'));
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
        });
    }
}

// ── Scroll Animations ────────────────────────────────────
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.stat-card, .feature-card, .pipeline-step').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = `all 0.6s cubic-bezier(0.4,0,0.2,1) ${i * 0.08}s`;
        observer.observe(el);
    });
}

// ── Stat Counter Animation ───────────────────────────────
function initStatCounters() {
    const stats = document.querySelectorAll('.stat-number');
    if (!stats.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { animateCounter(entry.target); observer.unobserve(entry.target); }
        });
    }, { threshold: 0.5 });
    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        el.textContent = Math.round(eased * target).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// ── Sentiment Analysis Page ──────────────────────────────
function initSentimentPage() {
    const input = document.getElementById('sentiment-text-input');
    const btn = document.getElementById('btn-analyze-sentiment');
    const clearBtn = document.getElementById('btn-clear-sentiment');
    const charCount = document.getElementById('sentiment-char-count');
    const closeBtn = document.getElementById('btn-close-sentiment-result');
    if (!input || !btn) return;

    input.addEventListener('input', () => {
        charCount.textContent = input.value.length + ' characters';
        btn.disabled = input.value.trim().length === 0;
    });
    btn.addEventListener('click', () => analyzeSentiment(input.value));
    clearBtn.addEventListener('click', () => {
        input.value = ''; charCount.textContent = '0 characters'; btn.disabled = true;
        document.getElementById('sentiment-result-panel').classList.add('hidden');
    });
    if (closeBtn) closeBtn.addEventListener('click', () => document.getElementById('sentiment-result-panel').classList.add('hidden'));

    document.querySelectorAll('#sentiment-input-panel .sample-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            input.value = chip.dataset.text;
            charCount.textContent = input.value.length + ' characters';
            btn.disabled = false;
            input.style.borderColor = 'var(--accent)';
            setTimeout(() => input.style.borderColor = '', 600);
        });
    });
}

async function analyzeSentiment(text) {
    const btn = document.getElementById('btn-analyze-sentiment');
    btn.classList.add('loading'); btn.disabled = true;
    try {
        const res = await fetch('/api/analyze-sentiment', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text })
        });
        const data = await res.json();
        if (data.error) { alert(data.error); return; }
        displaySentimentResult(data);
    } catch (err) { alert('Error: ' + err.message); }
    finally { btn.classList.remove('loading'); btn.disabled = false; }
}

function displaySentimentResult(data) {
    const panel = document.getElementById('sentiment-result-panel');
    panel.classList.remove('hidden');
    const isPositive = data.sentiment === 'positive';

    document.getElementById('sentiment-icon').textContent = isPositive ? '😊' : '😞';
    const label = document.getElementById('sentiment-label');
    label.textContent = data.sentiment;
    label.className = 'sentiment-label ' + data.sentiment;

    const fill = document.getElementById('sentiment-gauge-fill');
    fill.className = 'gauge-fill ' + data.sentiment;
    fill.style.width = '0%';
    setTimeout(() => { fill.style.width = data.confidence + '%'; }, 150);
    animateValue(document.getElementById('sentiment-gauge-value'), 0, data.confidence, 1200, '%');

    const bars = document.getElementById('sentiment-prob-bars');
    bars.innerHTML = '';
    for (const [cls, prob] of Object.entries(data.probabilities)) {
        const row = document.createElement('div');
        row.className = 'prob-bar-row';
        row.innerHTML = `<span class="prob-label">${cls}</span><div class="prob-track"><div class="prob-fill ${cls}" style="width:0%"></div></div><span class="prob-value">${prob.toFixed(1)}%</span>`;
        bars.appendChild(row);
        setTimeout(() => row.querySelector('.prob-fill').style.width = prob + '%', 250);
    }
    document.getElementById('sentiment-processed-text').textContent = data.processed_text;
    panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ── Fake News Detection Page ─────────────────────────────
function initFakeNewsPage() {
    const input = document.getElementById('fakenews-text-input');
    const btn = document.getElementById('btn-analyze-fakenews');
    const clearBtn = document.getElementById('btn-clear-fakenews');
    const charCount = document.getElementById('fakenews-char-count');
    const closeBtn = document.getElementById('btn-close-fakenews-result');
    if (!input || !btn) return;

    input.addEventListener('input', () => {
        charCount.textContent = input.value.length + ' characters';
        btn.disabled = input.value.trim().length === 0;
    });
    btn.addEventListener('click', () => detectFakeNews(input.value));
    clearBtn.addEventListener('click', () => {
        input.value = ''; charCount.textContent = '0 characters'; btn.disabled = true;
        document.getElementById('fakenews-result-panel').classList.add('hidden');
    });
    if (closeBtn) closeBtn.addEventListener('click', () => document.getElementById('fakenews-result-panel').classList.add('hidden'));

    document.querySelectorAll('#fakenews-input-panel .sample-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            input.value = chip.dataset.text;
            charCount.textContent = input.value.length + ' characters';
            btn.disabled = false;
            input.style.borderColor = 'var(--amber)';
            setTimeout(() => input.style.borderColor = '', 600);
        });
    });
}

async function detectFakeNews(text) {
    const btn = document.getElementById('btn-analyze-fakenews');
    btn.classList.add('loading'); btn.disabled = true;
    try {
        const res = await fetch('/api/detect-fakenews', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text })
        });
        const data = await res.json();
        if (data.error) { alert(data.error); return; }
        displayFakeNewsResult(data);
    } catch (err) { alert('Error: ' + err.message); }
    finally { btn.classList.remove('loading'); btn.disabled = false; }
}

function displayFakeNewsResult(data) {
    const panel = document.getElementById('fakenews-result-panel');
    panel.classList.remove('hidden');
    const isReal = data.prediction === 'REAL';
    const cssClass = isReal ? 'real' : 'fake';

    document.getElementById('fakenews-icon').textContent = isReal ? '✅' : '🚫';
    const label = document.getElementById('fakenews-label');
    label.textContent = data.prediction;
    label.className = 'sentiment-label ' + cssClass;

    const fill = document.getElementById('fakenews-gauge-fill');
    fill.className = 'gauge-fill ' + cssClass;
    fill.style.width = '0%';
    setTimeout(() => { fill.style.width = Math.max(data.confidence, 5) + '%'; }, 150);
    animateValue(document.getElementById('fakenews-gauge-value'), 0, data.confidence, 1200, '%');

    const bars = document.getElementById('fakenews-prob-bars');
    bars.innerHTML = '';
    const probEntries = isReal
        ? { 'REAL': data.confidence, 'FAKE': 100 - data.confidence }
        : { 'FAKE': data.confidence, 'REAL': 100 - data.confidence };
    for (const [cls, prob] of Object.entries(probEntries)) {
        const barClass = cls === 'REAL' ? 'real' : 'fake';
        const row = document.createElement('div');
        row.className = 'prob-bar-row';
        row.innerHTML = `<span class="prob-label">${cls}</span><div class="prob-track"><div class="prob-fill ${barClass}" style="width:0%"></div></div><span class="prob-value">${prob.toFixed(1)}%</span>`;
        bars.appendChild(row);
        setTimeout(() => row.querySelector('.prob-fill').style.width = prob + '%', 250);
    }
    document.getElementById('fakenews-processed-text').textContent = data.processed_text;
    panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ── Animated Number Counter ──────────────────────────────
function animateValue(el, from, to, duration, suffix = '') {
    const start = performance.now();
    function update(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (from + eased * (to - from)).toFixed(1) + suffix;
        if (p < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}
