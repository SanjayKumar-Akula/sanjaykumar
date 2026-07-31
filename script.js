/* ==========================================
   EMAILJS CONFIGURATION (SDK v4)
   ========================================== */
const EMAILJS_PUBLIC_KEY = "aUXflbD2ZRlB-6JGe";
const EMAILJS_SERVICE_ID = "service_g9uk8k9";
const EMAILJS_TEMPLATE_ID = "template_a54re32";

(function () {
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS SDK not loaded! Check CDN in index.html');
        return;
    }
    console.log('EmailJS SDK loaded:', emailjs);
    emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY
    });
    console.log('EmailJS initialized with public key:', EMAILJS_PUBLIC_KEY);
})();

/* ==========================================
   PRELOADER
   ========================================== */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 800);
});

/* ==========================================
   CURSOR FOLLOWER
   ========================================== */
const cursorFollower = document.getElementById('cursorFollower');
const cursorDot = document.getElementById('cursorDot');

if (window.innerWidth > 991) {
    document.addEventListener('mousemove', (e) => {
        cursorFollower.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
        cursorDot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
    });

    const hoverElements = document.querySelectorAll('a, button, .btn, .skill-card, .project-card, .timeline-item, .social-link, .tech-icon');
    hoverElements.forEach((el) => {
        el.addEventListener('mouseenter', () => cursorFollower.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hover'));
    });
}

/* ==========================================
   PARTICLE BACKGROUND
   ========================================== */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let particleCount = 80;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(56, 189, 248, ${0.08 * (1 - distance / 150)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle) => {
        particle.update();
        particle.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

/* ==========================================
   AOS INITIALIZATION
   ========================================== */
AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: 'ease-out-cubic'
});

/* ==========================================
   TYPING ANIMATION
   ========================================== */
const typed = new Typed('#typing', {
    strings: [
        'Software Engineer',
        'Web Developer',
        'Python Programmer',
        'Tech Enthusiast',
        'Problem Solver',
        'Full Stack Developer'
    ],
    typeSpeed: 70,
    backSpeed: 40,
    backDelay: 1800,
    loop: true,
    cursorChar: '',
    showCursor: false
});

/* ==========================================
   NAVBAR SCROLL EFFECT
   ========================================== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
});

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';
    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 200;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

/* ==========================================
   MOBILE HAMBURGER MENU
   ========================================== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

/* ==========================================
   DARK / LIGHT MODE
   ========================================== */
const themeToggle = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeToggle.querySelector('i').classList.remove('fa-moon');
    themeToggle.querySelector('i').classList.add('fa-sun');
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('light-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    }
});

/* ==========================================
   SCROLL PROGRESS BAR
   ========================================== */
const progressBar = document.createElement('div');
progressBar.style.position = 'fixed';
progressBar.style.top = '0';
progressBar.style.left = '0';
progressBar.style.height = '3px';
progressBar.style.background = 'linear-gradient(90deg, #2563eb, #38bdf8, #8b5cf6)';
progressBar.style.zIndex = '9999';
progressBar.style.transition = 'width 0.1s ease';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = progress + '%';
});

/* ==========================================
   COUNTER ANIMATION
   ========================================== */
function animateCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((stat) => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 2000;
        const step = Math.ceil(target / (duration / 16));
        let current = 0;
        const updateCounter = () => {
            current += step;
            if (current >= target) {
                stat.textContent = target;
                return;
            }
            stat.textContent = current;
            requestAnimationFrame(updateCounter);
        };
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );
        observer.observe(stat);
    });
}
animateCounter();

/* ==========================================
   SKILL CARDS STAGGER ANIMATION
   ========================================== */
const skillCards = document.querySelectorAll('.skill-card');
skillCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = `0.6s ease ${index * 0.1}s`;
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                    observer.unobserve(card);
                }
            });
        },
        { threshold: 0.1 }
    );
    observer.observe(card);
});

/* ==========================================
   TIMELINE ITEMS STAGGER ANIMATION
   ========================================== */
const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(30px)';
    item.style.transition = `0.6s ease ${index * 0.2}s`;
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                    observer.unobserve(item);
                }
            });
        },
        { threshold: 0.1 }
    );
    observer.observe(item);
});

/* ==========================================
   PROJECT CARDS STAGGER ANIMATION
   ========================================== */
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px) scale(0.95)';
    card.style.transition = `0.6s ease ${index * 0.15}s`;
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                    observer.unobserve(card);
                }
            });
        },
        { threshold: 0.1 }
    );
    observer.observe(card);
});

/* ==========================================
   HERO IMAGE 3D TILT
   ========================================== */
const heroImageWrapper = document.getElementById('heroImageWrapper');
const heroImage = document.getElementById('heroImage');

if (heroImageWrapper && window.innerWidth > 991) {
    heroImageWrapper.addEventListener('mousemove', (e) => {
        const rect = heroImageWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -15;
        const rotateY = ((x - centerX) / centerX) * 15;
        heroImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    heroImageWrapper.addEventListener('mouseleave', () => {
        heroImage.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
}

/* ==========================================
   CONTACT FORM
   ========================================== */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach((input) => {
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                input.style.borderColor = 'rgba(56, 189, 248, 0.3)';
            } else {
                input.style.borderColor = '';
            }
        });
        input.addEventListener('blur', () => {
            if (input.hasAttribute('required') && input.value.trim() === '') {
                input.style.borderColor = '#ef4444';
            }
        });
        input.addEventListener('focus', () => {
            input.style.borderColor = 'var(--primary)';
        });
    });

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const inputs = this.querySelectorAll('input, textarea');
        let valid = true;
        inputs.forEach((input) => {
            if (input.hasAttribute('required') && input.value.trim() === '') {
                valid = false;
                input.style.borderColor = '#ef4444';
            }
        });
        if (!valid) {
            this.style.animation = 'shake 0.5s ease';
            setTimeout(() => { this.style.animation = ''; }, 500);
            return;
        }
        const submitButton = this.querySelector('.btn-submit');
        const btnText = submitButton.querySelector('.btn-text');
        const btnLoading = submitButton.querySelector('.btn-loading');
        const icon = submitButton.querySelector('i');
        submitButton.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        icon.style.display = 'none';

        // Collect form data
        // Both "subject" and "title" carry the subject value so the EmailJS
        // template works whether it uses {{subject}} or {{title}}.
        const subjectValue = this.querySelector('input[name="subject"]').value;
        const formData = {
            name: this.querySelector('input[name="name"]').value,
            email: this.querySelector('input[name="email"]').value,
            subject: subjectValue,
            title: subjectValue,
            message: this.querySelector('textarea[name="message"]').value
        };

        // Debug: Log everything before sending
        console.log('=== EmailJS Send Debug ===');
        console.log('EmailJS object:', emailjs);
        console.log('Service ID:', EMAILJS_SERVICE_ID);
        console.log('Template ID:', EMAILJS_TEMPLATE_ID);
        console.log('Public Key:', EMAILJS_PUBLIC_KEY);
        console.log('Form data:', formData);
        console.log('JSON form data:', JSON.stringify(formData, null, 2));

        try {
            const response = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    name: this.querySelector('input[name="name"]').value,
                    email: this.querySelector('input[name="email"]').value,
                    title: this.querySelector('input[name="subject"]').value,
                    message: this.querySelector('textarea[name="message"]').value
                }
            );
            console.log('=== EmailJS Response ===');
            console.log('Full response:', response);
            console.log('Response status:', response.status);
            console.log('Response text:', response.text);
            console.log('JSON response:', JSON.stringify(response, null, 2));

            this.reset();
            inputs.forEach((input) => { input.style.borderColor = ''; });
            showSuccessModal();
        } catch (error) {
            console.error('=== EmailJS Error ===');
            console.error('Error object:', error);
            console.error('Error status:', error.status);
            console.error('Error text:', error.text);
            console.error('JSON error:', JSON.stringify(error, null, 2));

            // 412 Precondition Failed = the Public Key does not match the
            // EmailJS account that owns the Service ID / Template ID.
            // All three must come from the SAME EmailJS account.
            if (error.status === 412) {
                alert(
                    'EmailJS Error 412 — Precondition Failed\n\n' +
                    'CAUSE: The Public Key does not match the EmailJS account that owns the Service ID or Template ID.\n\n' +
                    'FIX:\n' +
                    '1. Log in to https://dashboard.emailjs.com\n' +
                    '2. Account → API Keys → copy the current Public Key\n' +
                    '3. Email Services → confirm the Service ID\n' +
                    '4. Email Templates → confirm the Template ID\n' +
                    '5. Make sure all three are from the SAME account\n' +
                    '6. Update the values in script.js if any differ\n\n' +
                    'Current values in script.js:\n' +
                    '  Public Key:  ' + EMAILJS_PUBLIC_KEY + '\n' +
                    '  Service ID:  ' + EMAILJS_SERVICE_ID + '\n' +
                    '  Template ID: ' + EMAILJS_TEMPLATE_ID
                );
            } else {
                alert(
                    'EmailJS Error:\n' +
                    'Status: ' + (error.status || 'N/A') + '\n' +
                    'Message: ' + (error.text || error.message || JSON.stringify(error))
                );
            }
        } finally {
            submitButton.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            icon.style.display = 'inline';
        }
    });
}

/* ==========================================
   TOAST NOTIFICATION
   ========================================== */
function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-icon"><i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i></div>
        <span class="toast-message">${message}</span>
    `;
    toast.style.cssText = `
        position: fixed; bottom: 30px; right: 30px;
        background: ${type === 'success' ? 'rgba(34, 197, 94, 0.95)' : 'rgba(239, 68, 68, 0.95)'};
        color: white; padding: 16px 24px; border-radius: 12px;
        display: flex; align-items: center; gap: 12px;
        font-size: 14px; font-weight: 500; z-index: 100000;
        backdrop-filter: blur(10px); box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        animation: slideInRight 0.4s ease, fadeOut 0.4s ease 3s forwards;
        font-family: 'Inter', sans-serif;
    `;
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3500);
}

const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes slideInRight { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes fadeOut { to { opacity: 0; transform: translateX(100px); } }
    @keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 50% { transform: translateX(10px); } 75% { transform: translateX(-10px); } }
`;
document.head.appendChild(toastStyle);

/* ==========================================
   BACK TO TOP BUTTON
   ========================================== */
const topBtn = document.createElement('button');
topBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
topBtn.style.cssText = `
    position: fixed; bottom: 30px; left: 30px;
    width: 50px; height: 50px; border: none; border-radius: 50%;
    cursor: pointer; background: linear-gradient(135deg, #2563eb, #38bdf8);
    color: #fff; font-size: 20px; display: none;
    align-items: center; justify-content: center; z-index: 999;
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
    transition: all 0.3s ease; opacity: 0; transform: translateY(20px);
`;
document.body.appendChild(topBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        topBtn.style.display = 'flex';
        setTimeout(() => { topBtn.style.opacity = '1'; topBtn.style.transform = 'translateY(0)'; }, 50);
    } else {
        topBtn.style.opacity = '0'; topBtn.style.transform = 'translateY(20px)';
        setTimeout(() => { topBtn.style.display = 'none'; }, 300);
    }
});
topBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
topBtn.addEventListener('mouseenter', () => { topBtn.style.transform = 'translateY(-5px)'; topBtn.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.4)'; });
topBtn.addEventListener('mouseleave', () => { topBtn.style.transform = 'translateY(0)'; topBtn.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)'; });

/* ==========================================
   LOAD PORTFOLIO DATA
   ========================================== */
async function loadPortfolioData() {
    try {
        const response = await fetch('/api/portfolio');
        const data = await response.json();
        if (data.name) {
            const nameElement = document.getElementById('profile-name');
            if (nameElement) nameElement.textContent = data.name;
        }
        if (data.summary) {
            const summaryElement = document.getElementById('profile-summary');
            if (summaryElement) summaryElement.textContent = data.summary;
        }
        // Skills are hardcoded in HTML - no need to override from API
        // Just ensure stagger animation works on hardcoded skills
        setTimeout(() => {
            document.querySelectorAll('.skill-card').forEach((card) => {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; observer.unobserve(card); }
                        });
                    }, { threshold: 0.1 }
                );
                observer.observe(card);
            });
        }, 100);
        const projectsList = document.getElementById('projects-list');
        if (projectsList && data.projects) {
            projectsList.innerHTML = data.projects.map((project, index) => `
                <div class="project-card" style="animation-delay: ${index * 0.15}s">
                    <img src="${project.image || 'techfest.png'}" alt="${project.name}">
                    <div class="project-content">
                        <h3>${project.name}</h3>
                        <p>${project.description}</p>
                        <div class="project-buttons">
                            <a href="${project.liveDemo || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-primary"><i class="fas fa-external-link-alt"></i> Live Demo</a>
                            <a href="https://github.com/SanjayKumar-Akula" target="_blank" rel="noopener noreferrer" class="btn btn-outline"><i class="fab fa-github"></i> GitHub</a>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        const experienceList = document.getElementById('experience-list');
        if (experienceList) {
            const experiences = [
                { title: 'NASSCOM Certificate', company: 'Successfully completed Digital 101 Journey', date: 'Certificate-1' },
                { title: 'Python Developer Intern', company: 'YAICESS Solutions', date: 'Internship 1' },
                { title: 'Cyber Security Intern', company: 'BIST Technologies', date: 'Internship 2' },
                { title: 'Python Programming Intern', company: 'CodingMissions IT Solutions', date: 'Internship 3' }
            ];
            experienceList.innerHTML = experiences.map((exp, index) => `
                <div class="timeline-item">
                    <span class="timeline-date">${exp.date}</span>
                    <h3>${exp.title}</h3>
                    <p>${exp.company}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Failed to load portfolio data:', error);
        loadDefaultData();
    }
}

/* ==========================================
   DEFAULT DATA FALLBACK
   ========================================== */
function loadDefaultData() {
    const skillsGrid = document.getElementById('skills-grid');
    if (skillsGrid && skillsGrid.children.length === 0) {
        const defaultSkills = [
            { name:'Python', icon:'fab fa-python' }, { name:'C Programming', icon:'fas fa-code' },
            { name:'C++', icon:'fas fa-laptop-code' }, { name:'SQL', icon:'fas fa-database' },
            { name:'HTML5', icon:'fab fa-html5' }, { name:'CSS3', icon:'fab fa-css3-alt' },
            { name:'JavaScript', icon:'fab fa-js' }, { name:'GitHub', icon:'fab fa-github' }
        ];
        skillsGrid.innerHTML = '';
        defaultSkills.forEach((skill, index) => {
            const card = document.createElement('div');
            card.className = 'skill-card';
            card.style.opacity = '0'; card.style.transform = 'translateY(40px)';
            card.style.transition = `0.6s ease ${index * 0.1}s`;
            card.innerHTML = `<i class="${skill.icon}"></i><h3>${skill.name}</h3>`;
            skillsGrid.appendChild(card);
        });
    }
    const projectsList = document.getElementById('projects-list');
    if (projectsList && projectsList.children.length === 0) {
        projectsList.innerHTML = `
            <div class="project-card">
                <img src="techfest.png" alt="TechFest 2025">
                <div class="project-content">
                    <h3>TechFest 2025</h3>
                    <p>Responsive Event Management Website with registration, login system, payment section, dashboard and modern UI.</p>
                    <div class="project-buttons">
                        <a href="https://sanjaykumar-akula.github.io/techfest/" target="_blank" rel="noopener noreferrer" class="btn btn-primary"><i class="fas fa-external-link-alt"></i> Live Demo</a>
                        <a href="https://github.com/SanjayKumar-Akula" target="_blank" rel="noopener noreferrer" class="btn btn-outline"><i class="fab fa-github"></i> GitHub</a>
                    </div>
                </div>
            </div>
        `;
    }
    const experienceList = document.getElementById('experience-list');
    if (experienceList && experienceList.children.length === 0) {
        const experiences = [
            { title: 'NASSCOM Certificate', company: 'Successfully completed Digital 101 Journey', date: 'Certificate-1' },
            { title: 'Python Developer Intern', company: 'YAICESS Solutions', date: 'Internship 1' },
            { title: 'Cyber Security Intern', company: 'BIST Technologies', date: 'Internship 2' },
            { title: 'Python Programming Intern', company: 'CodingMissions IT Solutions', date: 'Internship 3' }
        ];
        experienceList.innerHTML = experiences.map((exp, index) => `
            <div class="timeline-item">
                <span class="timeline-date">${exp.date}</span>
                <h3>${exp.title}</h3>
                <p>${exp.company}</p>
            </div>
        `).join('');
    }
}

loadPortfolioData();

/* ==========================================
   AUTO UPDATE FOOTER YEAR
   ========================================== */
const footerCopyright = document.getElementById('footerCopyright');
if (footerCopyright) {
    const year = new Date().getFullYear();
    footerCopyright.textContent = `© ${year} Akula Sanjay Kumar. All Rights Reserved.`;
}

/* ==========================================
   SMOOTH SCROLL FOR NAV LINKS
   ========================================== */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

/* ==========================================
   PARALLAX EFFECT
   ========================================== */
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero');
    if (hero) {
        const heroContent = hero.querySelector('.hero-content');
        const heroVisual = hero.querySelector('.hero-visual');
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.05}px)`;
        }
        if (heroVisual && scrolled < window.innerHeight) {
            heroVisual.style.transform = `translateY(${scrolled * -0.05}px)`;
        }
    }
});

/* ==========================================
   SUCCESS MODAL
   ========================================== */
function showSuccessModal() {
    const existingModal = document.querySelector('.success-modal-overlay');
    if (existingModal) existingModal.remove();

    const overlay = document.createElement('div');
    overlay.className = 'success-modal-overlay';
    overlay.innerHTML = `
        <div class="success-modal">
            <div class="modal-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3 class="modal-title">Message Sent!</h3>
            <p class="modal-text">Thank you for reaching out! I have received your message and will get back to you as soon as possible. Have a great day!</p>
            <button class="btn btn-primary modal-btn">Awesome!</button>
        </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('.modal-btn').addEventListener('click', () => {
        overlay.classList.add('fade-out');
        setTimeout(() => overlay.remove(), 400);
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.add('fade-out');
            setTimeout(() => overlay.remove(), 400);
        }
    });
}

/* ==========================================
   CERTIFICATES MODAL
   ========================================== */
function showCertificatesModal() {
    const existing = document.querySelector('.cert-modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'cert-modal-overlay';
    overlay.innerHTML = `
        <div class="cert-modal">
            <button class="cert-modal-close"><i class="fas fa-times"></i></button>
            <div class="cert-modal-header">
                <i class="fas fa-certificate"></i>
                <h2>My Certifications</h2>
                <p id="certStatus">Checking for saved certificates...</p>
            </div>
            <div class="cert-grid" id="certGrid"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    const grid = overlay.querySelector('#certGrid');
    const status = overlay.querySelector('#certStatus');
    const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'];
    let foundCount = 0;
    let checkedCount = 0;

    function checkCertificates() {
        for (let i = 1; i <= 100; i++) {
            (function(index) {
                let found = false;
                extensions.forEach((ext) => {
                    const path = `certificate-${index}.${ext}`;
                    fetch(path, { method: 'HEAD' })
                        .then((res) => {
                            if (res.ok && !found) {
                                found = true;
                                foundCount++;
                                const card = document.createElement('div');
                                card.className = 'cert-card';
                                card.style.animationDelay = `${(foundCount - 1) * 0.05}s`;
                                const isPdf = ext === 'pdf';
                                card.innerHTML = `
                                    <div class="cert-card-icon"><i class="fas ${isPdf ? 'fa-file-pdf' : 'fa-image'}"></i></div>
                                    <div class="cert-card-info">
                                        <span class="cert-card-title">Certificate-${index}</span>
                                        <span class="cert-card-sub">Click to view</span>
                                    </div>
                                `;
                                card.addEventListener('click', () => {
                                    window.open(path, '_blank');
                                });
                                grid.appendChild(card);
                                status.textContent = `${foundCount} certificate${foundCount > 1 ? 's' : ''} found`;
                            }
                        })
                        .catch(() => {})
                        .finally(() => {
                            checkedCount++;
                            if (checkedCount >= 100 * extensions.length && foundCount === 0) {
                                status.textContent = 'No certificates found. Save your certificates as certificate-1.jpg, certificate-2.png, etc.';
                            }
                        });
                });
            })(i);
        }
    }

    checkCertificates();

    overlay.querySelector('.cert-modal-close').addEventListener('click', () => {
        overlay.classList.add('fade-out');
        setTimeout(() => overlay.remove(), 400);
    });
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.add('fade-out');
            setTimeout(() => overlay.remove(), 400);
        }
    });
}

/* ==========================================
   CONSOLE WELCOME MESSAGE
   ========================================== */
console.log('%c💻 Akula Sanjay Kumar Portfolio', 'font-size: 24px; font-weight: bold; color: #38bdf8;');
console.log('%cBuilt with ❤️ using HTML, CSS & JavaScript', 'font-size: 14px; color: #8b5cf6;');
