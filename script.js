const textArray = [
    "Web Developer",
    "Software Engineer",
    "UI/UX Designer",
    "Full Stack Developer",
    "Frontend Developer"
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;
let deletingDelay = 50;
let pauseDelay = 2000;

function typeWriter() {
    const currentText = textArray[textIndex];
    const typingText = document.querySelector('.typing-text .animated-text');
    
    if (isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = deletingDelay;
    } else {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingDelay = pauseDelay;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textArray.length;
    }

    setTimeout(typeWriter, typingDelay);
}

// Start the typewriter effect when the page loads


// Function to update active nav link
function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');
    
    // Get the current scroll position
    const scrollY = window.scrollY;
    
    // Find which section is currently in view
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // Offset for better UX
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to corresponding nav link
            const correspondingLink = document.querySelector(`nav a[href="#${sectionId}"]`);
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
}

// Setup smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Mobile menu toggle function
function setupMobileMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelectorAll('nav a');
    
    if (menuBtn && navContainer) {
        // Toggle menu when hamburger is clicked
        menuBtn.addEventListener('click', () => {
            navContainer.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });
        
        // Close menu when a nav link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navContainer.classList.remove('active');
                menuBtn.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navContainer.contains(e.target) && !menuBtn.contains(e.target) && navContainer.classList.contains('active')) {
                navContainer.classList.remove('active');
                menuBtn.classList.remove('active');
            }
        });
    }
}

// Skills section functionality
function setupProjectsSection() {
    const projectItems = document.querySelectorAll('.project-item');
    const projectContentAreas = document.querySelectorAll('.project-content-area');
    let currentProject = 0; // Track current active project
    
    // Preload all project images for faster switching
    const preloadImages = () => {
        const projectImages = document.querySelectorAll('.project-image');
        projectImages.forEach(img => {
            if (img.getAttribute('src')) {
                const preloadLink = document.createElement('link');
                preloadLink.rel = 'preload';
                preloadLink.as = 'image';
                preloadLink.href = img.getAttribute('src');
                document.head.appendChild(preloadLink);
            }
        });
    };
    
    // Optimize project switching
    const switchProject = (projectId) => {
        // Skip if already on this project
        if (projectId === currentProject) return;
        
        // Update current project tracker
        currentProject = projectId;
        
        // Update active class on project items (using direct indexing for speed)
        for (let i = 0; i < projectItems.length; i++) {
            if (i === projectId) {
                projectItems[i].classList.add('active');
            } else {
                projectItems[i].classList.remove('active');
            }
        }
        
        // Update visible project content area (using direct indexing for speed)
        for (let i = 0; i < projectContentAreas.length; i++) {
            if (i === projectId) {
                projectContentAreas[i].classList.add('active');
            } else {
                projectContentAreas[i].classList.remove('active');
            }
        }
        
        // Scroll to project content area on mobile with faster animation
        if (window.innerWidth < 768) {
            const activeContentArea = projectContentAreas[projectId];
            if (activeContentArea) {
                activeContentArea.scrollIntoView({ behavior: 'auto', block: 'nearest' });
            }
        }
    };
    
    // Add animation for project content areas
    const animateProjectsOnScroll = () => {
        const projectsSection = document.querySelector('.projects');
        if (projectsSection) {
            const rect = projectsSection.getBoundingClientRect();
            const isInViewport = rect.top <= window.innerHeight * 0.8;
            
            if (isInViewport) {
                projectItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 100);
                });
                
                const activeContentArea = document.querySelector('.project-content-area.active');
                if (activeContentArea) {
                    setTimeout(() => {
                        activeContentArea.style.opacity = '1';
                        activeContentArea.style.transform = 'translateY(0)';
                    }, projectItems.length * 100);
                }
            }
        }
    };
    
    // Set initial styles for animation
    projectItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    projectContentAreas.forEach(area => {
        area.style.opacity = '0';
        area.style.transform = 'translateY(30px)';
        area.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Add click event listeners to project items with optimized handler
    if (projectItems.length) {
        projectItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                const projectId = parseInt(item.getAttribute('data-project'));
                switchProject(projectId);
            });
        });
    }
    
    // Run animation on scroll
    window.addEventListener('scroll', animateProjectsOnScroll);
    
    // Initial check for elements in viewport
    setTimeout(animateProjectsOnScroll, 300);
    
    // Preload images for faster initial load
    preloadImages();
}

function setupSkillsSection() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabButtons.length && tabContents.length) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Show corresponding content
                const targetId = button.getAttribute('data-target');
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
    
    // Honeycomb cell click functionality
    const honeycombCells = document.querySelectorAll('.honeycomb-cell');
    const skillModal = document.querySelector('.skill-modal');
    const closeModal = document.querySelector('.close-modal');
    const skillTitle = document.querySelector('.skill-title');
    const skillLevelFill = document.querySelector('.skill-level-fill');
    const skillLevelText = document.querySelector('.skill-level-text');
    const skillDescription = document.querySelector('.skill-description');
    
    // Skill descriptions
    const skillDescriptions = {
        'Python': 'Proficient in Python for data science, machine learning, and web development using frameworks like Django and Flask.',
        'C++': 'Strong foundation in C++ for algorithm implementation, data structures, and competitive programming.',
        'C': 'Experience with C programming for system-level development and embedded systems.',
        'HTML/CSS': 'Expert in creating responsive, modern web interfaces with advanced CSS techniques.',
        // 'JavaScript': 'Skilled in modern JavaScript (ES6+) for interactive web applications.',
        // 'React': 'Experience building single-page applications with React and related ecosystem tools.',
        // 'Git': 'Proficient in version control with Git for collaborative development and project management.',
        // 'Machine Learning': 'Experience implementing machine learning algorithms and models for predictive analytics and pattern recognition.',
        'Data Analysis': 'Skilled in data cleaning, transformation, visualization, and statistical analysis using Python libraries.',
        // 'Deep Learning': 'Knowledge of neural networks, CNN, RNN architectures using frameworks like TensorFlow and PyTorch.',
        'Prompt Engineering': 'Creating insightful prompts using tools like ChatGPT, Claude, Qwen, and Deepseek.',
        // 'NLP': 'Experience with Natural Language Processing for text analysis, sentiment analysis, and language models.',
        // 'Computer Vision': 'Working with image processing and computer vision algorithms for object detection and recognition.',
        // 'SQL': 'Database design, optimization, and querying using SQL for data management.',
        'Problem Solving': 'Strong analytical thinking and creative problem-solving approach to technical challenges.',
        'Team Collaboration': 'Effective team player with experience in collaborative development environments.',
        'Communication': 'Clear and concise communication of complex technical concepts to diverse audiences.',
        'Adaptability': 'Quick to learn new technologies and adapt to changing project requirements.',
        'Critical Thinking': 'Analytical approach to evaluating solutions and making informed decisions.',
        'Time Management': 'Efficient prioritization of tasks to meet deadlines in fast-paced environments.',
        'Leadership': 'Experience leading small teams and coordinating project efforts.'
    };
    
    // Open modal with skill details
    if (honeycombCells.length && skillModal && skillTitle && skillLevelFill && skillLevelText && skillDescription) {
        honeycombCells.forEach(cell => {
            cell.addEventListener('click', () => {
                const skillName = cell.getAttribute('data-skill');
                const skillLevel = cell.getAttribute('data-level');
                
                skillTitle.textContent = skillName;
                skillLevelFill.style.width = `${skillLevel}%`;
                skillLevelText.textContent = `${skillLevel}%`;
                
                // Set description or default if not found
                skillDescription.textContent = skillDescriptions[skillName] || 
                    `Advanced proficiency in ${skillName} with practical experience in real-world applications.`;
                
                // Show modal with animation
                skillModal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
            });
        });
    }
    
    // Close modal functionality
    if (closeModal && skillModal) {
        closeModal.addEventListener('click', () => {
            skillModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        });
        
        // Close modal when clicking outside content
        skillModal.addEventListener('click', (e) => {
            if (e.target === skillModal) {
                skillModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && skillModal.style.display === 'flex') {
                skillModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Animation for honeycomb cells on scroll
    const animateHoneycombOnScroll = () => {
        const honeycombGrids = document.querySelectorAll('.honeycomb-grid');
        
        if (honeycombGrids.length) {
            honeycombGrids.forEach(grid => {
                const cells = grid.querySelectorAll('.honeycomb-cell');
                
                cells.forEach((cell, index) => {
                    // Check if cell is in viewport
                    const rect = cell.getBoundingClientRect();
                    const isInViewport = rect.top <= window.innerHeight * 0.8;
                    
                    if (isInViewport) {
                        // Add animation with delay based on index
                        setTimeout(() => {
                            cell.style.opacity = '1';
                            cell.style.transform = 'translateY(0)';
                        }, index * 100);
                    }
                });
            });
        }
    };
    
    // Set initial styles for animation
    if (honeycombCells.length) {
        honeycombCells.forEach(cell => {
            cell.style.opacity = '0';
            cell.style.transform = 'translateY(50px)';
            cell.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        
        // Run animation on scroll
        window.addEventListener('scroll', animateHoneycombOnScroll);
        // Initial check for elements in viewport
        setTimeout(animateHoneycombOnScroll, 300);
    }
}

function setupCertificatesSection() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const certificatesContent = document.querySelector('.certificates-content');
    const achievementsContent = document.querySelector('.achievements-content');
    
    // Function to handle toggle between certificates and achievements
    const toggleContent = (contentType) => {
        // Update active class on toggle buttons
        toggleBtns.forEach(btn => {
            if (btn.getAttribute('data-type') === contentType) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Show the selected content
        if (contentType === 'certificates') {
            certificatesContent.classList.add('active');
            achievementsContent.classList.remove('active');
        } else if (contentType === 'achievements') {
            certificatesContent.classList.remove('active');
            achievementsContent.classList.add('active');
        }
    };
    
    // Add click event listeners to toggle buttons
    if (toggleBtns.length) {
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const contentType = btn.getAttribute('data-type');
                toggleContent(contentType);
            });
        });
    }
    
    // Add animation to certificate items on scroll
    const animateCertificateItems = () => {
        const certificateItems = document.querySelectorAll('.certificate-item');
        const achievementItems = document.querySelectorAll('.achievement-item');
        
        const animateItems = (items, delay = 100) => {
            items.forEach((item, index) => {
                // Check if item is in viewport
                const rect = item.getBoundingClientRect();
                const isInViewport = rect.top <= window.innerHeight * 0.8;
                
                if (isInViewport) {
                    // Add animation with delay based on index
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * delay);
                }
            });
        };
        
        // Set initial styles for animation
        const setInitialStyles = (items) => {
            items.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            });
        };
        
        // Initialize animations
        setInitialStyles(certificateItems);
        setInitialStyles(achievementItems);
        
        // Run animation on scroll
        window.addEventListener('scroll', () => {
            animateItems(certificateItems);
            animateItems(achievementItems, 150);
        });
        
        // Initial check for elements in viewport
        setTimeout(() => {
            animateItems(certificateItems);
            animateItems(achievementItems, 150);
        }, 300);
    };
    
    // Initialize animations
    animateCertificateItems();
    
    // Add lightbox effect for certificate images
    const certificateImages = document.querySelectorAll('.certificate-image img');
    certificateImages.forEach(img => {
        img.addEventListener('click', (e) => {
            // Prevent default if there's a parent anchor
            if (e.target.parentElement.tagName !== 'A') {
                const viewBtn = e.target.closest('.certificate-image').querySelector('.view-btn');
                if (viewBtn) {
                    viewBtn.click();
                }
            }
        });
    });
}

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Basic form validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // For demonstration purposes - in a real implementation, you would send this data to a server
            console.log('Form submitted:', { name, email, subject, message });
            
            // Show success message
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #28a745, #218838)';
            
            // Reset form
            contactForm.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.style.background = '';
            }, 3000);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    typeWriter();
    setupSmoothScrolling();
    setupMobileMenu();
    setupSkillsSection(); // Call the skills section setup function
    setupProjectsSection(); // Call the projects section setup function
    setupCertificatesSection(); // Call the certificates section setup function
    setupContactForm(); // Call the contact form setup function
    
    // Update active section on scroll
    window.addEventListener('scroll', updateActiveSection);
    // Initial call to set active section
    updateActiveSection();
    
    // Sticky header
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('sticky', window.scrollY > 0);
        });
    }
});
