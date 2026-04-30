/* ========================================
   HEXA WEB SOLUTIONS - ENHANCED SCRIPTS
   With theme integration & new features
   ======================================== */

// DOM Elements
const header = document.querySelector('header');
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');
const chatbotBtn = document.querySelector('.fab.chatbot');
const chatbotModal = document.querySelector('.chatbot-modal');
const chatbotClose = document.querySelector('.chatbot-close');
const chatbotInput = document.querySelector('.chatbot-input input');
const chatbotSend = document.querySelector('.chatbot-input button');
const chatbotBody = document.querySelector('.chatbot-body');
const loader = document.querySelector('.loader');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Hide loader after page load
  setTimeout(() => loader?.classList.add('hidden'), 1500);

  // Initialize features
  initScrollAnimations();
  initParticles();
  setupEventListeners();
  initChatbot();
  initTestimonialSlider();
  initFAQ();
  initNewsletter();
  
  // Animate counters if on homepage
  if (document.querySelector('.stat-number')) {
    animateCounters();
  }
  
  console.log('✨ HEXA WEB SOLUTIONS loaded with theme engine');
});

// Header scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header?.classList.add('scrolled');
  } else {
    header?.classList.remove('scrolled');
  }
});

// Mobile navigation
mobileToggle?.addEventListener('click', () => {
  navLinks?.classList.toggle('active');
  mobileToggle.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks?.classList.remove('active');
    mobileToggle?.classList.remove('active');
  });
});

// Scroll animations
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

// Animated particles
function initParticles() {
  const container = document.querySelector('.particles');
  if (!container) return;
  
  for (let i = 0; i < 25; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';
    particle.style.width = particle.style.height = (3 + Math.random() * 4) + 'px';
    container.appendChild(particle);
  }
}

// Global event listeners
function setupEventListeners() {
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  
  // Newsletter form
  document.querySelector('.newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input').value;
    showNotification(`🎉 Thanks for subscribing, ${email.split('@')[0]}! Check your inbox.`, 'success');
    e.target.reset();
  });
}

// Animated counters
function animateCounters() {
  document.querySelectorAll('.stat-number[data-count]').forEach(counter => {
    const target = parseInt(counter.dataset.count);
    const duration = 2000;
    const start = performance.now();
    
    function update(currentTime) {
      const progress = Math.min((currentTime - start) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * target);
      counter.textContent = current + (target >= 100 ? '+' : '');
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// Chatbot
function initChatbot() {
  if (!chatbotBtn || !chatbotModal) return;
  
  chatbotBtn.addEventListener('click', () => {
    chatbotModal.classList.toggle('active');
    if (chatbotModal.classList.contains('active')) {
      chatbotInput?.focus();
      addBotMessage("👋 Hi! I'm HEXA Bot. Ask me about services, pricing, or just say hello! 🚀");
    }
  });
  
  chatbotClose?.addEventListener('click', () => chatbotModal?.classList.remove('active'));
  chatbotSend?.addEventListener('click', sendChatMessage);
  chatbotInput?.addEventListener('keypress', (e) => e.key === 'Enter' && sendChatMessage());
  
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (chatbotModal?.classList.contains('active') && 
        !chatbotModal.contains(e.target) && 
        !chatbotBtn?.contains(e.target)) {
      chatbotModal?.classList.remove('active');
    }
  });
}

function sendChatMessage() {
  const text = chatbotInput?.value.trim();
  if (!text) return;
  
  addUserMessage(text);
  chatbotInput.value = '';
  
  setTimeout(() => {
    addBotMessage(getBotResponse(text));
  }, 700);
}

function addUserMessage(text) {
  const msg = document.createElement('div');
  msg.className = 'chat-message user';
  msg.textContent = text;
  chatbotBody?.appendChild(msg);
  scrollToBottom();
}

function addBotMessage(html) {
  const msg = document.createElement('div');
  msg.className = 'chat-message bot';
  msg.innerHTML = html;
  chatbotBody?.appendChild(msg);
  scrollToBottom();
}

function scrollToBottom() {
  if (chatbotBody) chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

function getBotResponse(input) {
  const lower = input.toLowerCase();
  
  const responses = {
    greetings: ["👋 Hello! Welcome to HEXA WEB SOLUTIONS. How can I help you today?", "👋 Hi there! Ready to build something amazing?"],
    services: ["🚀 We offer:<br>• Web Development<br>• UI/UX Design<br>• Mobile Apps<br>• SEO & Marketing<br>• Branding<br><br>Which interests you?", "✨ Our services:<br>1️⃣ Custom Websites<br>2️⃣ E-commerce Solutions<br>3️⃣ Mobile Applications<br>4️⃣ Digital Strategy<br><br>What's your goal?"],
    pricing: ["💰 Projects start at $2,500. For a custom quote, <a href='contact.html' style='color:var(--primary);font-weight:600'>contact us</a> with your requirements!", "💡 Pricing is project-based. Share your vision via <a href='contact.html' style='color:var(--primary);font-weight:600'>our contact form</a> for a free estimate."],
    contact: ["📬 Reach us:<br>📧 hello@hexawebsolutions.com<br>📱 +91 98765 43210<br>🌐 Or use our contact form!", "🤝 Let's connect! <a href='contact.html' style='color:var(--primary);font-weight:600'>Click here</a> to start a conversation."],
    thanks: ["🙏 You're welcome! Anything else I can help with?", "😊 Glad I could help! What's next?"],
    goodbye: ["👋 Thanks for chatting! Visit us anytime. Have a great day! ✨", "🚀 Catch you later! Remember: great digital experiences start with a conversation."],
    default: ["🤔 Great question! For detailed answers, <a href='contact.html' style='color:var(--primary);font-weight:600'>contact our team</a>. They're experts! 🎯", "💬 I'm learning every day! For complex queries, our human team at <a href='contact.html' style='color:var(--primary);font-weight:600'>contact</a> can help better."]
  };
  
  if (/(hello|hi|hey|greetings)/.test(lower)) return random(responses.greetings);
  if (/(service|offer|do|build|create)/.test(lower)) return random(responses.services);
  if (/(price|cost|quote|budget|investment)/.test(lower)) return random(responses.pricing);
  if (/(contact|email|phone|reach|call|whatsapp)/.test(lower)) return random(responses.contact);
  if (/(thank|thanks|appreciate)/.test(lower)) return random(responses.thanks);
  if (/(bye|goodbye|see you|later)/.test(lower)) return random(responses.goodbye);
  
  return random(responses.default);
}

function random(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Testimonial Slider
function initTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  const dots = document.querySelectorAll('.testimonial-dot');
  if (!track || dots.length === 0) return;
  
  let current = 0;
  
  function goTo(index) {
    current = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }
  
  dots.forEach(dot => {
    dot.addEventListener('click', () => goTo(parseInt(dot.dataset.index)));
  });
  
  // Auto-advance
  setInterval(() => {
    goTo((current + 1) % dots.length);
  }, 7000);
}

// FAQ Accordion
function initFAQ() {
  document.querySelectorAll('.faq-question')?.forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const active = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!active) item.classList.add('active');
    });
  });
}

// Newsletter
function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('input').value;
    showNotification(`🎉 Thanks for subscribing, ${email.split('@')[0]}!`, 'success');
    form.reset();
  });
}

// Notification system
function showNotification(message, type = 'info') {
  // Remove existing
  document.querySelectorAll('.notification').forEach(n => n.remove());
  
  const colors = { success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#6366f1' };
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  
  const note = document.createElement('div');
  note.className = 'notification';
  note.style.cssText = `
    position: fixed; top: 2rem; right: 2rem;
    padding: 1rem 1.5rem; background: ${colors[type]};
    color: white; border-radius: 12px; box-shadow: var(--shadow-lg);
    display: flex; align-items: center; gap: 0.75rem;
    z-index: 10002; animation: slideIn 0.3s ease, fadeOut 0.5s ease 3s forwards;
    max-width: 350px; font-weight: 500;
  `;
  note.innerHTML = `<span>${icons[type]}</span> ${message}`;
  document.body.appendChild(note);
  
  setTimeout(() => note.remove(), 3500);
}

// WhatsApp handler
document.querySelector('.fab.whatsapp')?.addEventListener('click', () => {
  window.open('https://wa.me/94764720488?text=Hello%20HEXA!%20I\'d%20like%20to%20know%20more.', '_blank');
});

// Listen for theme changes to update dynamic elements
document.addEventListener('themeChanged', (e) => {
  console.log(`🎨 Theme changed to: ${e.detail.theme}`);
  // Update any theme-dependent UI here
});

// Utility: Check if element in viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top <= window.innerHeight && rect.bottom >= 0;
}

// Polyfill for ?.let() pattern
if (!Element.prototype.let) {
  Element.prototype.let = function(callback) {
    if (this) callback(this);
    return this;
  };
}

// Initialize on load
window.addEventListener('load', () => {
  document.querySelectorAll('[data-animate]').forEach((el, i) => {
    setTimeout(() => {
      if (isElementInViewport(el)) el.classList.add('animated');
    }, i * 100);
  });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Escape closes chatbot
  if (e.key === 'Escape') {
    chatbotModal?.classList.remove('active');
  }
});