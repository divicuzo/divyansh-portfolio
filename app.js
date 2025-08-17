// Application Data
const appData = {
  personal_info: {
    name: "Divyansh Verma",
    location: "Chicago, IL",
    phone: "+1(912)441-3829",
    email: "divyanshv1911@gmail.com",
    linkedin: "https://www.linkedin.com/in/divyansh-verma-analytics"
  },
  hero: {
    headline: "I'm a Visual Artist & Designer striving to create impactful innovation.",
    subtitle: "Hi! I'm Divyansh. I'm a Digital Marketing Strategist and VFX Artist specializing in 3D Modeling, Visual Effects, and UI/UX Design. I create with precision and drive change through immersive experiences."
  },
  about: {
    title: "Hello! I'm Divyansh.",
    intro: "I'm from Chicago, IL, and I am a multidisciplinary creative professional. I hold a Master's degree in Business Data Analytics from National Louis University and a Bachelor's degree in Visual Effects from the Savannah College of Art and Design.",
    journey: "I started as a 3D artist and VFX specialist, creating volcanic simulations and architectural visualizations. I then expanded into digital marketing, UI/UX design, and business analytics, discovering that the intersection of creativity and data drives the most impactful innovation.",
    vision: "I aim to create functional, efficient, and memorable experiences that solve real-world problems through the application of cutting-edge technology, design thinking, and data-driven insights."
  },
  projects: [
    {
      id: "01",
      title: "Inactivity Through Ages",
      subtitle: "VFX Short Film",
      timeline: "5 Months | Personal Project",
      date: "January 2021 - May 2021",
      summary: "Developed complete 3D environmental recreation of Mount Sinabung volcano using Maya, creating 200+ detailed geological assets with complex PYRO simulations for volcanic eruption sequences.",
      roles: "3D Artist, VFX Supervisor, Lighting Artist",
      tools: ["Maya", "Houdini", "Substance Painter"],
      details: "Engineered complex PYRO simulations for volcanic eruption sequences in Houdini, achieving photorealistic destruction effects. Executed advanced lighting and look development in Substance Painter, creating realistic material shaders and textures. Managed end-to-end VFX pipeline from pre-visualization to final compositing, delivering project 15% under budget."
    },
    {
      id: "02", 
      title: "Diagem Digital Presence",
      subtitle: "Brand & Marketing Design",
      timeline: "3+ Years | Current Role",
      date: "November 2021 - Current",
      summary: "Leading comprehensive digital marketing and design strategy for luxury jewelry brand, managing product sample logistics and customer acquisition processes across multiple channels.",
      roles: "Design Lead, Sales Manager, Brand Strategist",
      tools: ["Adobe Creative Suite", "Social Media Platforms"],
      details: "Created high-quality graphic content for digital marketing channels including websites, social media platforms, and promotional materials. Enhanced brand visibility through strategic content marketing and social media marketing initiatives."
    },
    {
      id: "03",
      title: "REMAX Architectural Visualization",
      subtitle: "3D Real Estate Solutions", 
      timeline: "6 Months | Freelance Project",
      date: "December 2016 - May 2017",
      summary: "Created immersive 3D architectural visualizations and virtual environments for 15+ real estate projects, increasing property viewing engagement by 45% through interactive virtual tours.",
      roles: "3D Designer, Virtual Tour Developer",
      tools: ["Maya", "Unreal Engine", "3D Modeling"],
      details: "Developed interactive virtual tours and real-time rendering solutions. Collaborated with architects and interior designers on spatial design concepts and 3D space generation."
    },
    {
      id: "04",
      title: "Restaurant Operations Optimization",
      subtitle: "Management & Analytics",
      timeline: "11 Months | Management Role", 
      date: "December 2019 - October 2020",
      summary: "Managed daily operations for Savannah's #1-rated seafood restaurant, implementing CRM systems and data-driven strategies that increased customer retention by 30%.",
      roles: "Assistant Manager, Operations Specialist, Data Analyst",
      tools: ["CRM Systems", "Data Analytics", "Staff Management"],
      details: "Implemented customer relationship management systems and developed staff training programs that reduced employee turnover by 20% while optimizing costs by 15%."
    },
    {
      id: "05",
      title: "West Elm Visual Merchandising",
      subtitle: "Retail Design & Strategy",
      timeline: "10 Months | Part-time Role",
      date: "September 2018 - June 2019", 
      summary: "Enhanced store display strategies and visual merchandising, resulting in 20% boost in overall sales through targeted promotional campaigns and advanced CRM techniques.",
      roles: "Visual Merchandiser, Sales Analyst, Customer Relations",
      tools: ["Visual Design", "CRM Systems", "Sales Analytics"],
      details: "Implemented advanced CRM techniques and analyzed sales data to optimize inventory management, achieving 25% reduction in stock discrepancies."
    },
    {
      id: "06",
      title: "Business Data Analytics",
      subtitle: "Academic Research & Projects",
      timeline: "2 Years | Master's Program",
      date: "September 2022 - June 2024",
      summary: "Completed comprehensive Master's program focusing on data-driven decision making, statistical analysis, and business intelligence solutions across various industries.",
      roles: "Data Analyst, Research Lead, Business Intelligence Developer", 
      tools: ["Python", "R", "SQL", "Tableau", "Business Intelligence"],
      details: "Developed advanced analytical skills and created data-driven solutions for business challenges, focusing on ROI optimization and performance measurement."
    }
  ]
};

// State Management
let editMode = false;
let currentVideoFile = null;

// DOM Elements - Initialize after DOM loads
let uploadZone, videoUpload, uploadProgress, videoPlayer, demoVideo;
let projectsGrid, projectModal, modalBody, contactForm, editToggle;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  // Initialize DOM elements
  uploadZone = document.getElementById('uploadZone');
  videoUpload = document.getElementById('videoUpload');
  uploadProgress = document.getElementById('uploadProgress');
  videoPlayer = document.getElementById('videoPlayer');
  demoVideo = document.getElementById('demoVideo');
  projectsGrid = document.getElementById('projectsGrid');
  projectModal = document.getElementById('projectModal');
  modalBody = document.getElementById('modalBody');
  contactForm = document.getElementById('contactForm');
  editToggle = document.querySelector('.edit-toggle');

  // Initialize functionality
  initializeNavigation();
  initializeDemoReel();
  renderProjects();
  initializeEditMode();
  initializeContactForm();
  initializeModal();
  initializeScrollAnimations();
});

// Navigation Functions
function initializeNavigation() {
  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      
      if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 10;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav__toggle');
  const navList = document.querySelector('.nav__list');
  
  if (navToggle && navList) {
    navToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      navList.classList.toggle('show');
    });
  }

  // Close mobile menu when clicking on a link
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', function() {
      if (navList) {
        navList.classList.remove('show');
      }
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (navList && !e.target.closest('.header__nav')) {
      navList.classList.remove('show');
    }
  });
}

// Demo Reel Functions
function initializeDemoReel() {
  if (!uploadZone || !videoUpload) return;

  const uploadZoneContent = uploadZone.querySelector('.upload-zone__content');
  
  // File upload handling
  videoUpload.addEventListener('change', handleFileUpload);
  
  // Drag and drop functionality
  if (uploadZoneContent) {
    uploadZoneContent.addEventListener('dragover', function(e) {
      e.preventDefault();
      this.classList.add('dragover');
    });
    
    uploadZoneContent.addEventListener('dragleave', function(e) {
      e.preventDefault();
      this.classList.remove('dragover');
    });
    
    uploadZoneContent.addEventListener('drop', function(e) {
      e.preventDefault();
      this.classList.remove('dragover');
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload({ target: { files: files } });
      }
    });

    // Click to browse
    uploadZoneContent.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      videoUpload.click();
    });
  }

  // Player controls
  const replaceBtn = document.getElementById('replaceVideo');
  const removeBtn = document.getElementById('removeVideo');
  
  if (replaceBtn) {
    replaceBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      showUploadZone();
    });
  }

  if (removeBtn) {
    removeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      removeVideo();
    });
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith('video/')) {
    alert('Please upload a video file.');
    return;
  }

  // Validate file size (100MB limit)
  if (file.size > 100 * 1024 * 1024) {
    alert('File size must be less than 100MB.');
    return;
  }

  currentVideoFile = file;
  showUploadProgress();
  simulateUpload(file);
}

function showUploadProgress() {
  if (uploadZone) uploadZone.style.display = 'none';
  if (uploadProgress) uploadProgress.classList.remove('hidden');
}

function simulateUpload(file) {
  const progressFill = document.querySelector('.progress-fill');
  const progressText = document.querySelector('.progress-text');
  
  if (!progressFill || !progressText) return;
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      showVideoPlayer(file);
    }
    
    progressFill.style.width = progress + '%';
    progressText.textContent = `Uploading... ${Math.round(progress)}%`;
  }, 200);
}

function showVideoPlayer(file) {
  if (!demoVideo) return;
  
  const videoURL = URL.createObjectURL(file);
  demoVideo.src = videoURL;
  
  if (uploadProgress) uploadProgress.classList.add('hidden');
  if (videoPlayer) videoPlayer.classList.remove('hidden');
}

function showUploadZone() {
  if (uploadZone) uploadZone.style.display = 'block';
  if (videoPlayer) videoPlayer.classList.add('hidden');
  if (uploadProgress) uploadProgress.classList.add('hidden');
  
  // Clear the file input
  if (videoUpload) videoUpload.value = '';
  currentVideoFile = null;
}

function removeVideo() {
  if (demoVideo && demoVideo.src) {
    URL.revokeObjectURL(demoVideo.src);
  }
  showUploadZone();
}

// Projects Functions
function renderProjects() {
  if (!projectsGrid) return;
  
  projectsGrid.innerHTML = '';
  
  appData.projects.forEach(project => {
    const projectCard = createProjectCard(project);
    projectsGrid.appendChild(projectCard);
  });
}

function createProjectCard(project) {
  const card = document.createElement('div');
  card.className = 'project-card';
  
  // Make entire card clickable
  card.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    openProjectModal(project);
  });
  
  card.innerHTML = `
    <div class="project-card__header">
      <div class="project-number">${project.id}</div>
      <div class="project-info">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-subtitle">${project.subtitle}</p>
        <p class="project-timeline">${project.timeline}</p>
      </div>
    </div>
    <p class="project-summary">${project.summary}</p>
    <div class="project-roles">
      <h4>My Roles</h4>
      <p>${project.roles}</p>
    </div>
    <div class="project-cta">View Project</div>
  `;
  
  return card;
}

// Modal Functions
function initializeModal() {
  if (!projectModal) return;
  
  const modalOverlay = projectModal.querySelector('.modal__overlay');
  const modalClose = projectModal.querySelector('.modal__close');
  
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      closeProjectModal();
    });
  }
  
  if (modalClose) {
    modalClose.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      closeProjectModal();
    });
  }
  
  // Close modal on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && projectModal && !projectModal.classList.contains('hidden')) {
      closeProjectModal();
    }
  });
}

function openProjectModal(project) {
  if (!projectModal || !modalBody) return;
  
  modalBody.innerHTML = `
    <div class="modal-project__header">
      <div class="modal-project__number">${project.id}</div>
      <h2 class="modal-project__title">${project.title}</h2>
      <p class="modal-project__subtitle">${project.subtitle}</p>
      <p class="modal-project__timeline">${project.timeline}</p>
    </div>
    
    <div class="modal-project__section">
      <h3>Project Overview</h3>
      <p>${project.summary}</p>
    </div>
    
    <div class="modal-project__section">
      <h3>My Roles</h3>
      <p>${project.roles}</p>
    </div>
    
    <div class="modal-project__section">
      <h3>Tools Used</h3>
      <div class="modal-project__tools">
        ${project.tools.map(tool => `<span class="modal-project__tool">${tool}</span>`).join('')}
      </div>
    </div>
    
    <div class="modal-project__section">
      <h3>Project Details</h3>
      <p>${project.details}</p>
    </div>
    
    <div class="modal-project__section">
      <h3>Timeline</h3>
      <p>${project.date}</p>
    </div>
  `;
  
  projectModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  if (!projectModal) return;
  
  projectModal.classList.add('hidden');
  document.body.style.overflow = 'auto';
}

// Edit Mode Functions
function initializeEditMode() {
  if (!editToggle) return;
  
  editToggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    editMode = !editMode;
    document.body.classList.toggle('edit-mode', editMode);
    this.textContent = editMode ? 'Exit Edit' : 'Edit Mode';
    this.className = editMode ? 'btn btn--primary btn--sm edit-toggle' : 'btn btn--secondary btn--sm edit-toggle';
    
    if (editMode) {
      enableEditMode();
    } else {
      disableEditMode();
    }
  });
}

function enableEditMode() {
  // Make text editable
  document.querySelectorAll('.editable').forEach(element => {
    element.contentEditable = true;
    element.addEventListener('blur', saveEditableContent);
    element.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.blur();
      }
    });
    
    // Prevent default click behavior during edit
    element.addEventListener('click', function(e) {
      if (editMode) {
        e.stopPropagation();
      }
    });
  });

  // Show add buttons
  document.querySelectorAll('.add-project-btn, .add-creative-btn').forEach(btn => {
    btn.classList.remove('hidden');
  });
}

function disableEditMode() {
  document.querySelectorAll('.editable').forEach(element => {
    element.contentEditable = false;
    element.removeEventListener('blur', saveEditableContent);
  });

  document.querySelectorAll('.add-project-btn, .add-creative-btn').forEach(btn => {
    btn.classList.add('hidden');
  });
}

function saveEditableContent(event) {
  const field = event.target.dataset.field;
  const value = event.target.textContent.trim();
  
  if (field) {
    // Update the data object
    const keys = field.split('.');
    let obj = appData;
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    
    console.log(`Updated ${field}:`, value);
  }
}

// Contact Form Functions
function initializeContactForm() {
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const formData = new FormData(this);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      projectType: formData.get('projectType'),
      message: formData.get('message')
    };
    
    // Validate required fields
    if (!data.name || !data.email || !data.projectType || !data.message) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Simulate form submission
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      alert('Thank you for your message! I\'ll get back to you soon.');
      this.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });
}

// Add scroll-based animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe project cards and other elements
  setTimeout(() => {
    document.querySelectorAll('.project-card, .skill-category, .gallery-item').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }, 100);
}

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Handle window resize for responsive features
window.addEventListener('resize', debounce(function() {
  const navList = document.querySelector('.nav__list');
  if (navList && window.innerWidth > 768) {
    navList.classList.remove('show');
  }
}, 250));

// Export functions for potential external use
window.PortfolioApp = {
  openProject: openProjectModal,
  closeProject: closeProjectModal,
  toggleEditMode: () => editToggle && editToggle.click(),
  addProject: (projectData) => {
    appData.projects.push(projectData);
    renderProjects();
  },
  removeProject: (projectId) => {
    appData.projects = appData.projects.filter(p => p.id !== projectId);
    renderProjects();
  }
};