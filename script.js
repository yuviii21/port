const defaultName = 'Yuvaraj';
const terminalTitle = document.querySelector('#terminal-title');
const terminalStatus = document.querySelector('#terminal-status');
const terminalDescription = document.querySelector('#terminal-description');
const keys = [...document.querySelectorAll('.key')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const welcome = () => `${getName()}'s portfolio`;
let typeTimer;
let typeStartTimer;
let restoreTimer;
let activeText = '';
let waveTimer;
let lastFocused;

const sections = {
  work: {
    label: 'Selected Projects',
    intro: 'Full-stack and AI-integrated applications built from idea through deployment.',
    items: [
      'LMS: Node.js, Express.js, PostgreSQL, JWT authentication, Vercel, and a Hugging Face Llama 3.2 AI tutor.',
      'PlugEase: a React Native EV-charging application with Node.js, Express.js, MongoDB, REST APIs, and Azure deployment.',
      'Gesture Voice Board: browser-based hand-gesture and voice controls using MediaPipe Hands, Canvas API, and Web Speech API.',
      'one8 Commune: a Django and Python food-delivery application with an ORM-based data model and Razorpay payments.'
    ]
  },
  about: {
    label: 'About',
    intro: 'G. Yuvaraj is a Bengaluru-based Computer Science and Engineering graduate focused on Generative AI and backend development.',
    items: ['Builds practical, scalable applications with secure backend integrations.', 'Works with LLM-powered experiences, RAG pipelines, prompt engineering, and context-aware assistants.']
  },
  experience: {
    label: 'Experience',
    intro: 'Python Full Stack Intern at KodNest Technologies Pvt. Ltd., Bengaluru - January to May 2026.',
    items: ['Developed backend application logic using Python, object-oriented programming, data handling, and modular code structure.', 'Created database structures and queries with MySQL and MongoDB.', 'Built HTML, CSS, and JavaScript interfaces connected to backend applications, using Git and code-review practices.']
  },
  education: {
    label: 'Education',
    intro: 'Bachelor of Engineering in Computer Science and Engineering, Sai Vidya Institute of Technology, Bengaluru.',
    items: ['CGPA: 8.21/10.0, August 2022 to May 2026.', 'Relevant coursework: data structures and algorithms, object-oriented programming, databases, computer networks, operating systems, machine learning, and software engineering.']
  },
  skills: {
    label: 'Technical Skills',
    intro: 'A focused toolkit for backend services, AI features, and full-stack applications.',
    items: ['Python, JavaScript (ES6+), C, SQL, HTML5, CSS3, Tailwind CSS, and React Native.', 'Django, Node.js, Express.js, REST APIs, JWT, bcrypt, Firebase, MySQL, MongoDB, PostgreSQL, Docker, CI/CD, and Vercel.', 'Hugging Face Inference API with Llama 3.2, Claude API, RAG pipelines, prompt engineering, OpenCV, and MediaPipe.']
  },
  contact: {
    label: 'Let’s Connect',
    intro: 'For opportunities, collaborations, and software projects, contact Yuvaraj directly.',
    items: ['Email: yuvrazz21@gmail.com', 'LinkedIn: linkedin.com/in/g-yuvaraj-42b1b634a', 'GitHub: github.com/yuviii21']
  }
};

function getName() { return localStorage.getItem('yuvaraj-console-name') || defaultName; }
function setName(name) { localStorage.setItem('yuvaraj-console-name', name); document.querySelector('#display-name').textContent = name; }

function typeText(text, description, immediate = false) {
  if (text === activeText && (typeTimer || typeStartTimer)) return;
  clearInterval(typeTimer); clearTimeout(typeStartTimer); clearTimeout(restoreTimer);
  activeText = text;
  terminalTitle.setAttribute('aria-label', text);
  terminalDescription.textContent = description;
  if (reduceMotion.matches || immediate) {
    terminalTitle.textContent = text;
    terminalStatus.textContent = 'READY';
    typeTimer = null;
    return;
  }
  terminalTitle.textContent = '';
  terminalStatus.textContent = 'TYPING';
  let index = 0;
  const begin = () => {
    typeTimer = setInterval(() => {
      terminalTitle.textContent += text[index++] || '';
      if (index >= text.length) { clearInterval(typeTimer); typeTimer = null; terminalStatus.textContent = 'READY'; }
    }, 110);
  };
  typeStartTimer = setTimeout(() => { typeStartTimer = null; begin(); }, 350);
}

function restoreWelcome() {
  clearTimeout(restoreTimer);
  restoreTimer = setTimeout(() => {
    const noKeyFocused = !keys.some(key => key.matches(':focus'));
    if (noKeyFocused && !document.querySelector('dialog[open]')) typeText(welcome(), 'Generative AI, backend systems, and thoughtful products.');
  }, 350);
}

function pauseWave() { clearInterval(waveTimer); keys.forEach(key => key.classList.remove('idle')); }
function playWave() {
  if (reduceMotion.matches || document.hidden || document.querySelector('dialog[open]') || keys.some(key => key.matches(':focus'))) return;
  keys.forEach(key => key.classList.remove('idle'));
  requestAnimationFrame(() => keys.forEach(key => key.classList.add('idle')));
}
function startWaves() { pauseWave(); playWave(); waveTimer = setInterval(playWave, 7000); }

function previewKey(key) { pauseWave(); typeText(key.dataset.title, key.dataset.description); }
keys.forEach(key => {
  key.addEventListener('pointerenter', () => previewKey(key));
  key.addEventListener('focus', () => previewKey(key));
  key.addEventListener('pointerleave', restoreWelcome);
  key.addEventListener('blur', () => { restoreWelcome(); startWaves(); });
  key.addEventListener('click', () => openSection(key.dataset.section, key));
});

const modal = document.querySelector('#section-modal');
const modalTitle = document.querySelector('#modal-title');
const modalCopy = document.querySelector('#modal-copy');
function openSection(id, origin) {
  const section = sections[id];
  if (!section) return;
  lastFocused = origin;
  modalTitle.textContent = section.label;
  modalCopy.replaceChildren();
  const intro = document.createElement('p');
  intro.textContent = section.intro;
  modalCopy.append(intro);
  if (section.items?.length) {
    const list = document.createElement('ul');
    section.items.forEach(item => { const listItem = document.createElement('li'); listItem.textContent = item; list.append(listItem); });
    modalCopy.append(list);
  }
  typeText(section.label, section.intro);
  pauseWave();
  modal.showModal();
  modal.querySelector('.modal-close').focus();
}
function closeModal() { if (modal.open) modal.close(); }
modal.addEventListener('close', () => { lastFocused?.focus(); restoreWelcome(); startWaves(); });
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
modal.querySelector('.modal-close').addEventListener('click', closeModal);
modal.querySelector('.modal-action').addEventListener('click', closeModal);
document.querySelectorAll('[data-section]').forEach(control => {
  if (!control.classList.contains('key')) control.addEventListener('click', () => openSection(control.dataset.section, control));
});

const nameModal = document.querySelector('#name-modal');
const nameInput = document.querySelector('#name-input');
document.querySelector('.name-edit').addEventListener('click', () => { nameInput.value = getName(); nameModal.showModal(); nameInput.focus(); nameInput.select(); });
document.querySelector('#name-form').addEventListener('submit', event => {
  if (event.submitter.value === 'save') { const value = nameInput.value.trim(); if (value) { setName(value); typeText(welcome(), 'A curious mind. A world of possibilities.', true); } }
});
nameModal.addEventListener('close', () => document.querySelector('.name-edit').focus());
nameModal.addEventListener('click', event => { if (event.target === nameModal) nameModal.close(); });

document.addEventListener('visibilitychange', () => document.hidden ? pauseWave() : startWaves());
reduceMotion.addEventListener('change', () => { typeText(welcome(), 'Generative AI, backend systems, and thoughtful products.', true); startWaves(); });
setName(getName());
typeText(welcome(), 'Generative AI, backend systems, and thoughtful products.');
startWaves();
