// ── SentiGuard AI — Enhanced Frontend ────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavbar();
    initStatCounters();
    initScrollAnimations();
    initSentimentPage();
    initFakeNewsPage();
    initPipelinePage();
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

    document.querySelectorAll('.stat-card, .feature-card, .pipeline-step, .arch-node, .pipe-stage, .train-step, .tech-card').forEach((el, i) => {
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

// ── Client-side NLP Simulation ───────────────────────────
function simulateNLP(text) {
    let processed = text.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ').trim();
    const stopwords = ['the','a','an','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','shall','can','need','dare','ought','used','to','of','in','for','on','with','at','by','from','as','into','through','during','before','after','above','below','between','out','off','over','under','again','further','then','once','here','there','when','where','why','how','all','each','every','both','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','just','because','but','and','or','if','while','this','that','these','those','i','me','my','it','its'];
    const words = processed.split(' ').filter(w => w.length > 1 && !stopwords.includes(w));
    return words.join(' ');
}

function clientSentimentAnalysis(text) {
    const lower = text.toLowerCase();
    const posWords = ['love','great','amazing','wonderful','excellent','fantastic','awesome','beautiful','perfect','best','good','happy','nice','superb','outstanding','brilliant','incredible','delightful','pleased','recommend','enjoy','impressive','comfortable','luxurious','compliment','quality','satisfied'];
    const negWords = ['hate','terrible','awful','worst','bad','horrible','poor','ugly','broken','waste','disappointed','angry','annoying','useless','cheap','rubbish','disgusting','nightmare','unhelpful','defective','pathetic','dreadful','inferior','unacceptable','refund','complaint','never'];
    let posScore = 0, negScore = 0;
    posWords.forEach(w => { if (lower.includes(w)) posScore += 1; });
    negWords.forEach(w => { if (lower.includes(w)) negScore += 1; });
    if (lower.includes('!')) { posScore += 0.3; negScore += 0.3; }
    const total = posScore + negScore || 1;
    const posProb = ((posScore / total) * 100) || 50;
    const negProb = 100 - posProb;
    const sentiment = posProb >= 50 ? 'positive' : 'negative';
    const confidence = Math.max(posProb, negProb);
    return {
        sentiment, confidence: parseFloat(confidence.toFixed(1)),
        probabilities: { positive: parseFloat(posProb.toFixed(1)), negative: parseFloat(negProb.toFixed(1)) },
        processed_text: simulateNLP(text)
    };
}

async function analyzeSentiment(text) {
    const btn = document.getElementById('btn-analyze-sentiment');
    btn.classList.add('loading'); btn.disabled = true;
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
    const data = clientSentimentAnalysis(text);
    displaySentimentResult(data);
    btn.classList.remove('loading'); btn.disabled = false;
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

function clientFakeNewsDetection(text) {
    const lower = text.toLowerCase();
    const fakeIndicators = ['shocking','breaking','secret','urgent','exposed','conspiracy','they dont want you to know','miracle','cure','banned','cover-up','anonymous source','leaked','alien','hoax','unbelievable','you wont believe','proven to cause','immediately','permanent'];
    const realIndicators = ['according to','researchers','study','published','percent','data','evidence','analysis','report','university','official','government','statistics','survey','findings','observed','participants','cited','moderate','stable','economic'];
    let fakeScore = 0, realScore = 0;
    fakeIndicators.forEach(w => { if (lower.includes(w)) fakeScore += 1; });
    realIndicators.forEach(w => { if (lower.includes(w)) realScore += 1; });
    if ((lower.match(/!/g) || []).length > 2) fakeScore += 1.5;
    if (lower === lower.toUpperCase() && text.length > 20) fakeScore += 1;
    const total = fakeScore + realScore || 1;
    const realProb = ((realScore / total) * 100) || 50;
    const prediction = realProb >= 50 ? 'REAL' : 'FAKE';
    const confidence = prediction === 'REAL' ? parseFloat(realProb.toFixed(1)) : parseFloat((100 - realProb).toFixed(1));
    return { prediction, confidence, processed_text: simulateNLP(text) };
}

async function detectFakeNews(text) {
    const btn = document.getElementById('btn-analyze-fakenews');
    btn.classList.add('loading'); btn.disabled = true;
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
    const data = clientFakeNewsDetection(text);
    displayFakeNewsResult(data);
    btn.classList.remove('loading'); btn.disabled = false;
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

// ── Pipeline Page — Accordion Stages ─────────────────────
function initPipelinePage() {
    const stages = document.querySelectorAll('.pipe-stage');
    if (!stages.length) return;

    stages.forEach(stage => {
        const header = stage.querySelector('.pipe-stage-header');
        header.addEventListener('click', () => {
            const isOpen = stage.classList.contains('open');
            // Close all
            stages.forEach(s => s.classList.remove('open'));
            // Toggle clicked
            if (!isOpen) stage.classList.add('open');
        });
    });

    // Auto-open first stage after animation completes
    setTimeout(() => {
        if (stages[0]) stages[0].classList.add('open');
    }, 600);

    // Init charts if on pipeline page
    initModelCharts();
}

// ── Model Accuracy Charts ────────────────────────────────
function initModelCharts() {
    const canvas = document.getElementById('accuracy-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    // Real evaluated metrics from training scripts
    const metricsData = {
        sentiment: [
            { name: 'Logistic Regression', accuracy: 80.95, f1: 80.42, precision: 86.39, recall: 80.95 },
            { name: 'Naive Bayes',         accuracy: 80.95, f1: 80.42, precision: 86.39, recall: 80.95 },
            { name: 'SVM (Linear)',        accuracy: 80.95, f1: 80.42, precision: 86.39, recall: 80.95 },
            { name: 'Decision Tree',       accuracy: 80.95, f1: 80.69, precision: 81.96, recall: 80.95 },
            { name: 'Random Forest',       accuracy: 80.95, f1: 80.87, precision: 82.28, recall: 80.95 }
        ],
        fakenews: [
            { name: 'Naive Bayes',         accuracy: 100.0, f1: 100.0, precision: 100.0, recall: 100.0 },
            { name: 'Logistic Regression', accuracy: 100.0, f1: 100.0, precision: 100.0, recall: 100.0 },
            { name: 'SVM (Linear)',        accuracy: 100.0, f1: 100.0, precision: 100.0, recall: 100.0 }
        ]
    };

    let currentDataset = 'sentiment';
    let chart = null;

    function createChart(dataset) {
        const data = metricsData[dataset];
        const labels = data.map(d => d.name);
        const isSentiment = dataset === 'sentiment';

        if (chart) chart.destroy();

        const ctx = canvas.getContext('2d');
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Accuracy (%)',
                        data: data.map(d => d.accuracy),
                        backgroundColor: 'rgba(139, 108, 255, 0.7)',
                        borderColor: 'rgba(139, 108, 255, 1)',
                        borderWidth: 1,
                        borderRadius: 6,
                        borderSkipped: false,
                    },
                    {
                        label: 'F1-Score (%)',
                        data: data.map(d => d.f1),
                        backgroundColor: 'rgba(0, 232, 184, 0.7)',
                        borderColor: 'rgba(0, 232, 184, 1)',
                        borderWidth: 1,
                        borderRadius: 6,
                        borderSkipped: false,
                    },
                    {
                        label: 'Precision (%)',
                        data: data.map(d => d.precision),
                        backgroundColor: 'rgba(92, 156, 252, 0.7)',
                        borderColor: 'rgba(92, 156, 252, 1)',
                        borderWidth: 1,
                        borderRadius: 6,
                        borderSkipped: false,
                    },
                    {
                        label: 'Recall (%)',
                        data: data.map(d => d.recall),
                        backgroundColor: 'rgba(255, 176, 32, 0.7)',
                        borderColor: 'rgba(255, 176, 32, 1)',
                        borderWidth: 1,
                        borderRadius: 6,
                        borderSkipped: false,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 1200, easing: 'easeOutQuart' },
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#e8e8f4',
                            font: { family: 'Inter', size: 12, weight: '500' },
                            usePointStyle: true,
                            pointStyle: 'rectRounded',
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(14, 14, 30, 0.95)',
                        titleColor: '#e8e8f4',
                        bodyColor: '#a0a0c0',
                        borderColor: 'rgba(139, 108, 255, 0.3)',
                        borderWidth: 1,
                        cornerRadius: 10,
                        padding: 14,
                        titleFont: { family: 'Inter', weight: '700' },
                        bodyFont: { family: 'Inter' },
                        callbacks: {
                            label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(2)}%`
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#7e7ea0',
                            font: { family: 'Inter', size: 11, weight: '500' },
                            maxRotation: 25
                        },
                        grid: { color: 'rgba(255,255,255,0.04)' },
                        border: { color: 'rgba(255,255,255,0.07)' }
                    },
                    y: {
                        min: isSentiment ? 70 : 90,
                        max: 100,
                        ticks: {
                            color: '#7e7ea0',
                            font: { family: 'Inter', size: 11 },
                            callback: v => v + '%',
                            stepSize: isSentiment ? 5 : 2
                        },
                        grid: { color: 'rgba(255,255,255,0.04)' },
                        border: { color: 'rgba(255,255,255,0.07)' }
                    }
                }
            }
        });
    }

    function updateTable(dataset) {
        const tbody = document.getElementById('metrics-tbody');
        if (!tbody) return;
        const data = metricsData[dataset];
        const bestF1 = Math.max(...data.map(d => d.f1));
        tbody.innerHTML = data.map(d => {
            const isBest = d.f1 === bestF1;
            return `<tr class="${isBest ? 'best-row' : ''}">
                <td class="model-name-cell">
                    ${d.name}
                    ${isBest ? '<span class="best-badge">Best</span>' : ''}
                </td>
                <td>${d.accuracy.toFixed(2)}%</td>
                <td>${d.f1.toFixed(2)}%</td>
                <td>${d.precision.toFixed(2)}%</td>
                <td>${d.recall.toFixed(2)}%</td>
            </tr>`;
        }).join('');
    }

    // Tab switching
    document.querySelectorAll('.chart-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentDataset = tab.dataset.dataset;
            createChart(currentDataset);
            updateTable(currentDataset);
        });
    });

    // Initial render (delayed for scroll animation)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                createChart(currentDataset);
                updateTable(currentDataset);
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.2 });
    observer.observe(canvas);
}
