// --- Floating Bubble Logic ---
const bubble = document.createElement('div');
bubble.className = 'job-ai-bubble';
bubble.innerHTML = `
  <svg class="job-ai-icon" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
`;
document.body.appendChild(bubble);

// --- Draggable & Long Press Logic ---
let isDragging = false;
let dragStartTime = 0;
let longPressTimer = null;
let startX, startY, initialLeft, initialTop;

const LONG_PRESS_DURATION = 800; // ms to trigger game

bubble.addEventListener('mousedown', handleDragStart);
bubble.addEventListener('touchstart', handleDragStart, { passive: false });

function handleDragStart(e) {
    if (e.type === 'mousedown') e.preventDefault(); // Prevent text selection

    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

    isDragging = false;
    dragStartTime = Date.now();
    startX = clientX;
    startY = clientY;

    const rect = bubble.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;

    // Start Long Press Timer
    longPressTimer = setTimeout(() => {
        if (!isDragging) {
            triggerGameBlast();
        }
    }, LONG_PRESS_DURATION);

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
}

function handleDragMove(e) {
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

    const dx = clientX - startX;
    const dy = clientY - startY;

    // If moved more than 5px, consider it a drag
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        isDragging = true;
        clearTimeout(longPressTimer); // Cancel long press if moving
    }

    if (isDragging) {
        e.preventDefault();
        bubble.style.left = `${initialLeft + dx}px`;
        bubble.style.top = `${initialTop + dy}px`;
        bubble.style.bottom = 'auto';
        bubble.style.right = 'auto';
    }
}

function handleDragEnd(e) {
    clearTimeout(longPressTimer);

    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('touchmove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchend', handleDragEnd);

    // If it was a short click and not a drag, toggle modal
    if (!isDragging && Date.now() - dragStartTime < LONG_PRESS_DURATION) {
        toggleModal();
    }
}

function triggerGameBlast() {
    if (navigator.vibrate) {
        navigator.vibrate([50, 50, 50]);
    }
    bubble.classList.add('blasting');
    setTimeout(() => {
        bubble.style.display = 'none';
        bubble.classList.remove('blasting');
        initGame();
    }, 500);
}

// --- Modal Logic ---
const modal = document.createElement('div');
modal.className = 'job-ai-modal';
modal.innerHTML = `
  <div class="job-ai-header">
    <span class="job-ai-title">JobTracker AI Agent</span>
    <div style="display: flex; gap: 10px;">
      <button class="job-ai-settings-btn" title="Settings">⚙️</button>
      <button class="job-ai-close">&times;</button>
    </div>
  </div>
  
  <!-- Settings View -->
  <div class="job-ai-settings" style="display: none; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #233554;">
    <div class="job-ai-field">
      <label class="job-ai-label">Target App URL</label>
      <input type="text" class="job-ai-input" id="ai-target-url" placeholder="http://localhost:5173">
    </div>
    <button class="job-ai-btn job-ai-btn-secondary" id="ai-save-settings">Save URL</button>
  </div>

  <div class="job-ai-content">
    <div class="job-ai-field">
      <label class="job-ai-label">Company</label>
      <input type="text" class="job-ai-input" id="ai-company" placeholder="Auto-detecting...">
    </div>
    <div class="job-ai-field">
      <label class="job-ai-label">Job Title</label>
      <input type="text" class="job-ai-input" id="ai-title" placeholder="Auto-detecting...">
    </div>
    <div class="job-ai-field">
      <label class="job-ai-label">Location</label>
      <input type="text" class="job-ai-input" id="ai-location" placeholder="Auto-detecting...">
    </div>
    <div class="job-ai-field">
      <label class="job-ai-label">CTC / Salary</label>
      <input type="text" class="job-ai-input" id="ai-ctc" placeholder="e.g. 24 LPA">
    </div>
    <button class="job-ai-btn" id="ai-save">Save to Tracker</button>
    <button class="job-ai-btn job-ai-btn-secondary" id="ai-cover-letter">Generate Cover Letter</button>
  </div>
`;
document.body.appendChild(modal);

// Load Saved URL
let targetUrl = 'http://localhost:5173';
if (chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['jobTrackerUrl'], (result) => {
        if (result.jobTrackerUrl) {
            targetUrl = result.jobTrackerUrl;
        }
        document.getElementById('ai-target-url').value = targetUrl;
    });
}

// Toggle Settings
const settingsBtn = modal.querySelector('.job-ai-settings-btn');
const settingsView = modal.querySelector('.job-ai-settings');
settingsBtn.style.background = 'none';
settingsBtn.style.border = 'none';
settingsBtn.style.cursor = 'pointer';
settingsBtn.style.fontSize = '16px';

settingsBtn.addEventListener('click', () => {
    settingsView.style.display = settingsView.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('ai-save-settings').addEventListener('click', () => {
    const newUrl = document.getElementById('ai-target-url').value;
    if (newUrl) {
        // Remove trailing slash
        targetUrl = newUrl.replace(/\/$/, "");
        chrome.storage.local.set({ jobTrackerUrl: targetUrl }, () => {
            alert('Target URL saved!');
            settingsView.style.display = 'none';
        });
    }
});

function toggleModal() {
    modal.classList.toggle('active');
    if (modal.classList.contains('active')) {
        scrapeData();
        // Position modal near bubble if possible, or default
        const rect = bubble.getBoundingClientRect();
        // Simple logic: if bubble is low, show modal above, else below
        if (rect.top > window.innerHeight / 2) {
            modal.style.top = 'auto';
            modal.style.bottom = `${window.innerHeight - rect.top + 20}px`;
        } else {
            modal.style.bottom = 'auto';
            modal.style.top = `${rect.bottom + 20}px`;
        }
        // Keep horizontal in check
        modal.style.left = `${Math.min(window.innerWidth - 370, Math.max(20, rect.left - 150))}px`;
        modal.style.right = 'auto';
        // Job Tracker AI Agent - Content Script

        let agentEnabled = true;

        // Create and Inject Floating Bubble
        function createFloatingBubble() {
            if (document.getElementById('job-tracker-agent-bubble')) return;

            const bubble = document.createElement('div');
            bubble.id = 'job-tracker-agent-bubble';
            bubble.innerHTML = `
        <div style="
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0a192f;
            border: 2px solid #64ffda;
            border-radius: 50%;
            box-shadow: 0 0 15px rgba(100, 255, 218, 0.3);
            cursor: pointer;
            overflow: hidden;
            transition: all 0.3s ease;
        ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64ffda" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                <path d="M12 2a10 10 0 0 1 10 10"></path>
                <path d="M12 12 2.1 12"></path>
            </svg>
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle at 30% 30%, rgba(100, 255, 218, 0.1), transparent);
                pointer-events: none;
            "></div>
        </div>
    `;

            // Bubble Styles
            Object.assign(bubble.style, {
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                width: '60px',
                height: '60px',
                zIndex: '2147483647', // Max Z-Index
                transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                userSelect: 'none',
                fontFamily: 'system-ui, -apple-system, sans-serif'
            });

            // Hover Effects
            bubble.onmouseenter = () => bubble.style.transform = 'scale(1.1)';
            bubble.onmouseleave = () => bubble.style.transform = 'scale(1)';

            // Click Handler
            bubble.onclick = () => {
                if (!agentEnabled) return;

                // Animate Click
                bubble.style.transform = 'scale(0.9)';
                setTimeout(() => bubble.style.transform = 'scale(1)', 150);

                // Extract Data
                const data = extractJobData();

                // Send to Background Script
                chrome.runtime.sendMessage({
                    action: "jobDataExtracted",
                    data: data
                });
            };

            document.body.appendChild(bubble);
        }

        // Extract Job Data (Same logic as before)
        function extractJobData() {
            const url = window.location.href;
            let jobTitle = document.title;
            let company = "Unknown Company";
            let location = "Remote";
            let description = "";

            // LinkedIn Specific Extraction
            if (url.includes('linkedin.com')) {
                const titleEl = document.querySelector('.job-details-jobs-unified-top-card__job-title') ||
                    document.querySelector('h1');
                if (titleEl) jobTitle = titleEl.innerText.trim();

                const companyEl = document.querySelector('.job-details-jobs-unified-top-card__company-name') ||
                    document.querySelector('.topcard__org-name-link');
                if (companyEl) company = companyEl.innerText.trim();

                const locationEl = document.querySelector('.job-details-jobs-unified-top-card__bullet') ||
                    document.querySelector('.topcard__flavor--bullet');
                if (locationEl) location = locationEl.innerText.trim();
            }
            // Indeed Specific Extraction
            else if (url.includes('indeed.com')) {
                const titleEl = document.querySelector('.jobsearch-JobInfoHeader-title');
                if (titleEl) jobTitle = titleEl.innerText.trim();

                const companyEl = document.querySelector('[data-company-name="true"]');
                if (companyEl) company = companyEl.innerText.trim();

                const locationEl = document.querySelector('[data-testid="inlineHeader-companyLocation"]');
                if (locationEl) location = locationEl.innerText.trim();
            }

            return {
                jobTitle,
                company,
                location,
                link: url,
                status: 'Applied',
                appliedDate: new Date().toISOString().split('T')[0]
            };
        }

        // Initialize
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createFloatingBubble);
        } else {
            createFloatingBubble();
        }

        // Listen for messages from the Popup/Background
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === "toggleAgent") {
                agentEnabled = request.enabled;
                const bubble = document.getElementById('job-tracker-agent-bubble');
                if (bubble) {
                    bubble.style.display = agentEnabled ? 'block' : 'none';
                }
            }
        });
    }
}

document.querySelector('.job-ai-close').addEventListener('click', () => {
    modal.classList.remove('active');
});

// --- Scraper & Save Logic (Existing) ---
function scrapeData() {
    let company = '';
    let title = '';
    let location = '';

    if (window.location.hostname.includes('linkedin.com')) {
        title = document.querySelector('.job-details-jobs-unified-top-card__job-title')?.innerText ||
            document.querySelector('.top-card-layout__title')?.innerText || '';
        company = document.querySelector('.job-details-jobs-unified-top-card__company-name')?.innerText ||
            document.querySelector('.topcard__org-name-link')?.innerText || '';
        location = document.querySelector('.job-details-jobs-unified-top-card__bullet')?.innerText || '';
    } else if (window.location.hostname.includes('indeed.com')) {
        title = document.querySelector('.jobsearch-JobInfoHeader-title')?.innerText || '';
        company = document.querySelector('[data-testid="inlineHeader-companyName"]')?.innerText || '';
        location = document.querySelector('[data-testid="inlineHeader-companyLocation"]')?.innerText || '';
    } else {
        title = document.querySelector('meta[property="og:title"]')?.content || document.title;
        company = document.querySelector('meta[property="og:site_name"]')?.content || '';
    }

    document.getElementById('ai-company').value = company.trim();
    document.getElementById('ai-title').value = title.trim();
    document.getElementById('ai-location').value = location.trim();
}

document.getElementById('ai-save').addEventListener('click', () => {
    const data = {
        companyName: document.getElementById('ai-company').value,
        jobTitle: document.getElementById('ai-title').value,
        location: document.getElementById('ai-location').value,
        ctc: document.getElementById('ai-ctc').value || 'Not disclosed',
        status: 'Applied',
        appliedDate: new Date().toISOString().split('T')[0],
        link: window.location.href
    };
    const params = new URLSearchParams(data).toString();

    // Use the dynamic targetUrl
    window.open(`${targetUrl}?action=add&${params}`, '_blank');

    modal.classList.remove('active');
});

document.getElementById('ai-cover-letter').addEventListener('click', () => {
    const company = document.getElementById('ai-company').value;
    const title = document.getElementById('ai-title').value;
    const location = document.getElementById('ai-location').value;
    const today = new Date().toLocaleDateString('en-GB');

    const coverLetter = `Srikanth Sridhar
TVS Nagar , Palanganatham
Madurai , TamilNadu
srisrikanthtvs@gmail.com
 | +91 9342869610
https://www.linkedin.com/in/srikanth-sridhar-a43574242/

${today}

Hiring Manager
${company}
${location || '[Location]'}

Subject: Application for ${title}

Dear Hiring Manager,

I am excited to apply for the ${title} position at ${company}. I am deeply passionate about building scalable, secure, and high-performance applications that power real-world digital trust. ${company}’s leadership in the industry strongly resonates with my interest in systems engineering, reliability, and secure software development.

Throughout my academic journey, I have consistently taken on leadership roles and responsibilities. I served as the School Pupil Leader at TVS Sundaram School and a district-level badminton player in 2018 and 2020. In college, I have been the Student Representative of the Complaint-cum-Redressal Committee since my first year. These experiences strengthened my communication, decision-making, and collaboration skills — qualities that align with ${company}’s cross-functional, high-ownership engineering culture.

I have also participated in and won several tech competitions such as Guvi Hackathon, Technovision, Buildathon, and the Gen AI Hackathon. One of my projects was selected for funding by FAER, which encouraged me to pursue impactful, real-world engineering solutions with strong analytical rigor. As a Campus Ambassador for IIST, I gained exposure to working with diverse groups, promoting technology initiatives, and coordinating outreach activities.

My technical foundation aligns closely with ${company}’s engineering requirements:

Experience developing backend services using Node.js (with foundational experience in Java)
Strong understanding of data structures, algorithms, concurrency concepts, and distributed systems
Frontend expertise with React.js, Next.js, TypeScript, JavaScript (ES6+), HTML5, CSS3
Experience designing APIs, data models, and modular architectures
Practical exposure to SQL databases, caching patterns, and scalable application flows
Hands-on experience with CI/CD workflows, automated testing, Git, and debugging tools
Understanding of containers, deployment workflows, and Kubernetes fundamentals
Familiarity with resilience, fault tolerance, and handling edge cases in production systems
Experience writing clear documentation, managing code reviews, and ensuring code quality

I gained practical industry exposure through internships at TVS Eurogrip and TVS Sensing Solutions, where I worked on real-time automation systems, explored machine learning workflows, and strengthened my understanding of backend logic and system reliability. Alongside this, I hold international certifications from CISCO (Modules 1 & 2), which strengthened my networking and communication systems fundamentals.

Beyond academics, I delivered a complete food-ordering platform as a freelance project with my friends using React.js, Node.js, Express, and MySQL. I took ownership of both frontend and backend development — building the UI, APIs, database schema, authentication logic, and the core ordering flow. I am proud to have shipped a real, production-ready product now live at www.nutrosapien.com. This experience strengthened my engineering judgement, ability to design scalable systems, and comfort with end-to-end development — all essential for contributing effectively at ${company}.

I am eager to bring my technical skills, security mindset, learning ability, and enthusiasm to ${company}’s engineering organization. I would be grateful for the opportunity to contribute to designing secure, reliable, and scalable software solutions that drive digital trust for millions of users and enterprises worldwide.

Thank you for considering my application. I would be glad to discuss how I can contribute to ${company}’s engineering excellence and security-driven innovation.

Warm regards,
Srikanth Sridhar
+91 9342869610
srisrikanthtvs@gmail.com`;

    navigator.clipboard.writeText(coverLetter).then(() => {
        alert('Personalized cover letter generated and copied to clipboard!');
    });
});

// --- GAME LOGIC ---
const gameOverlay = document.createElement('div');
gameOverlay.className = 'job-ai-game-overlay';
gameOverlay.innerHTML = `
  <div class="job-ai-game-ui">
    <div class="job-ai-score">0</div>
    <div class="job-ai-highscore">High Score: 0</div>
  </div>
  <button class="job-ai-game-close">Exit</button>
  <canvas class="job-ai-game-canvas"></canvas>
  <div class="job-ai-game-over">
    <h2 style="color:#64ffda; margin-bottom:10px;">Game Over</h2>
    <p style="color:#ccd6f6;">Score: <span id="final-score">0</span></p>
    <button class="job-ai-game-btn" id="restart-game">Play Again</button>
  </div>
`;
document.body.appendChild(gameOverlay);

const canvas = gameOverlay.querySelector('canvas');
const ctx = canvas.getContext('2d');
const scoreEl = gameOverlay.querySelector('.job-ai-score');
const highScoreEl = gameOverlay.querySelector('.job-ai-highscore');
const gameOverEl = gameOverlay.querySelector('.job-ai-game-over');
const finalScoreEl = document.getElementById('final-score');

let gameLoopId;
let score = 0;
let highScore = localStorage.getItem('job_ai_highscore') || 0;
highScoreEl.innerText = `High Score: ${highScore}`;

// Game State
const paddle = { x: 0, width: 180, height: 10, color: '#64ffda' };
let balls = [];
let particles = []; // For crash effects

// Logo Images
const LOGO_URLS = [
    'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg', // Google
    'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',     // Microsoft
    'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', // Meta
    'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',   // Apple
    'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg',        // Amazon
    'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',  // Netflix
    'https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg'      // Twitter
];

const loadedLogos = [];
LOGO_URLS.forEach(url => {
    const img = new Image();
    img.src = url;
    img.crossOrigin = "Anonymous"; // Try to handle CORS
    loadedLogos.push(img);
});

function initGame() {
    gameOverlay.classList.add('active');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Reset Game
    score = 0;
    scoreEl.innerText = score;
    balls = [];
    particles = [];
    gameOverEl.classList.remove('visible');

    // Input Listeners
    canvas.addEventListener('mousemove', movePaddle);
    canvas.addEventListener('touchmove', movePaddleTouch, { passive: false });

    gameLoopId = requestAnimationFrame(gameLoop);
    spawnBall();
}

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.8;
    paddle.y = canvas.height - 30;
}

function movePaddle(e) {
    const rect = canvas.getBoundingClientRect();
    paddle.x = e.clientX - rect.left - paddle.width / 2;
    // Clamp
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
}

function movePaddleTouch(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    paddle.x = e.touches[0].clientX - rect.left - paddle.width / 2;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
}

function spawnBall() {
    if (!gameOverlay.classList.contains('active')) return;

    const img = loadedLogos[Math.floor(Math.random() * loadedLogos.length)];
    balls.push({
        x: Math.random() * (canvas.width - 40) + 20,
        y: -40,
        radius: 25, // Slightly larger for logos
        vx: (Math.random() - 0.5) * 3, // Reduced horizontal variance
        vy: Math.random() * 1.5 + 1, // Slower vertical start
        img: img
    });

    // Spawn rate
    const delay = Math.max(800, 2500 - score * 50); // Slower spawn rate initially
    setTimeout(spawnBall, delay);
}

function createExplosion(x, y, color) {
    for (let i = 0; i < 15; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: 1.0,
            color: color || '#64ffda'
        });
    }
}

function gameLoop() {
    if (!gameOverlay.classList.contains('active')) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Paddle
    ctx.fillStyle = paddle.color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = paddle.color;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.shadowBlur = 0;

    // Update & Draw Particles
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;

        if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
        }

        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }

    // Update & Draw Balls
    for (let i = balls.length - 1; i >= 0; i--) {
        let b = balls[i];

        // Physics
        b.x += b.vx;
        b.y += b.vy;
        b.vy += 0.08; // Reduced Gravity for slower fall

        // Wall Bounce
        if (b.x - b.radius < 0 || b.x + b.radius > canvas.width) {
            b.vx *= -1;
        }

        // Paddle Collision
        if (
            b.y + b.radius >= paddle.y &&
            b.y - b.radius <= paddle.y + paddle.height &&
            b.x >= paddle.x &&
            b.x <= paddle.x + paddle.width
        ) {
            // Crash Effect
            createExplosion(b.x, b.y + b.radius, '#64ffda');
            if (navigator.vibrate) navigator.vibrate(20); // Haptic hit

            b.vy = -Math.abs(b.vy * 0.9); // Bounce back up with slightly less energy
            b.vx += (b.x - (paddle.x + paddle.width / 2)) * 0.2; // Add spin/angle

            // Cap max speed
            if (b.vy < -15) b.vy = -15;

            score++;
            scoreEl.innerText = score;
        }

        // Game Over Condition
        if (b.y - b.radius > canvas.height) {
            endGame();
            return;
        }

        // Draw Ball (Logo)
        ctx.save();
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.clip(); // Clip to circle

        // Draw white background for transparent logos
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        if (b.img && b.img.complete) {
            try {
                ctx.drawImage(b.img, b.x - b.radius, b.y - b.radius, b.radius * 2, b.radius * 2);
            } catch (e) {
                // Fallback if CORS fails
                ctx.fillStyle = '#ff0000';
                ctx.fill();
            }
        } else {
            ctx.fillStyle = '#cccccc';
            ctx.fill();
        }

        ctx.restore();

        // Border
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#64ffda';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    gameLoopId = requestAnimationFrame(gameLoop);
}

function endGame() {
    cancelAnimationFrame(gameLoopId);
    gameOverEl.classList.add('visible');
    finalScoreEl.innerText = score;

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('job_ai_highscore', highScore);
        highScoreEl.innerText = `High Score: ${highScore}`;
    }
}

// Controls
document.querySelector('.job-ai-game-close').addEventListener('click', () => {
    gameOverlay.classList.remove('active');
    bubble.style.display = 'flex'; // Show bubble again
});

document.getElementById('restart-game').addEventListener('click', () => {
    initGame();
});
