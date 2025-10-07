   // Preloader functionality
        const preloader = document.getElementById('preloader');
        const loadingBarFill = document.getElementById('loadingBarFill');
        const preloaderPercentage = document.getElementById('preloaderPercentage');
        
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                
                // Hide preloader after a short delay
                setTimeout(() => {
                    preloader.classList.add('hidden');
                    document.body.style.overflow = 'auto';
                }, 500);
            }
            
            loadingBarFill.style.width = progress + '%';
            preloaderPercentage.textContent = Math.floor(progress) + '%';
        }, 150);

        // Disable scrolling while loading
        document.body.style.overflow = 'hidden';

        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Animate logo
        gsap.to('.logo', {
            opacity: 1,
            duration: 1,
            delay: 0.3
        });

        // Animate navigation
        gsap.to('.nav li', {
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            delay: 0.5
        });

        // Animate CTA button
        gsap.to('.cta-button', {
            opacity: 1,
            duration: 0.8,
            delay: 0.7,
            ease: 'power2.out'
        });

        // Hero animations
        const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

        heroTimeline
            .to('.hero-content h1', {
                opacity: 1,
                y: 0,
                duration: 1
            })
            .to('.hero-content p', {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1
            }, '-=0.6')
            .to('.hero-image', {
                opacity: 1,
                scale: 1,
                duration: 1.2
            }, '-=0.8');

        // Portfolio images for random selection
        const portfolioImages = [
            'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?w=400&q=80',
            'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400&q=80',
            'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80',
            'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&q=80',
            'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=400&q=80',
            'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&q=80',
            'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80',
            'https://images.unsplash.com/photo-1545235617-7a424c1a60cc?w=400&q=80'
        ];

        // Image sizes for variety
        const imageSizes = [
            { width: 180, height: 180 },
            { width: 200, height: 150 },
            { width: 160, height: 200 },
            { width: 220, height: 160 },
            { width: 190, height: 190 }
        ];

        // Hero section floating images
        const heroSection = document.querySelector('.hero');
        const floatingContainer = document.querySelector('.floating-images-container');
        let isMouseInHero = false;
        let lastMouseMoveTime = 0;
        const mouseMoveThrottle = 150; // Trigger every 150ms
        const activeImages = new Map(); // Track active images
        let imageIdCounter = 0;

        // Create and animate floating image at cursor position
        function createFloatingImage(mouseX, mouseY) {
            const now = Date.now();
            
            // Throttle creation
            if (now - lastMouseMoveTime < mouseMoveThrottle) {
                return;
            }
            lastMouseMoveTime = now;

            // Random image and size
            const randomImage = portfolioImages[Math.floor(Math.random() * portfolioImages.length)];
            const randomSize = imageSizes[Math.floor(Math.random() * imageSizes.length)];
            const randomRotation = Math.random() * 20 - 10;

            // Create image element
            const imageId = `img-${imageIdCounter++}`;
            const imgElement = document.createElement('div');
            imgElement.className = 'floating-image';
            imgElement.id = imageId;
            imgElement.style.width = `${randomSize.width}px`;
            imgElement.style.height = `${randomSize.height}px`;
            imgElement.style.left = `${mouseX}px`;
            imgElement.style.top = `${mouseY}px`;
            
            const img = document.createElement('img');
            img.src = randomImage;
            img.alt = 'Portfolio work';
            imgElement.appendChild(img);
            
            floatingContainer.appendChild(imgElement);

            // Track this image
            activeImages.set(imageId, imgElement);

            // Animate in
            gsap.fromTo(imgElement, 
                {
                    opacity: 0,
                    scale: 0.8,
                    rotation: randomRotation
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    ease: 'power2.out'
                }
            );

            // Animate out and remove after 2 seconds
            gsap.to(imgElement, {
                opacity: 0,
                scale: 0.9,
                duration: 0.5,
                delay: 1.5,
                ease: 'power2.in',
                onComplete: () => {
                    if (imgElement.parentNode) {
                        imgElement.parentNode.removeChild(imgElement);
                    }
                    activeImages.delete(imageId);
                }
            });
        }

        // Mouse move within hero section
        heroSection.addEventListener('mousemove', (e) => {
            if (!isMouseInHero) {
                isMouseInHero = true;
            }

            const rect = heroSection.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            createFloatingImage(mouseX, mouseY);
        });

        // Mouse leave hero section
        heroSection.addEventListener('mouseleave', () => {
            isMouseInHero = false;
            lastMouseMoveTime = 0;
            
            // Fade out all active images
            activeImages.forEach((imgElement, id) => {
                gsap.to(imgElement, {
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.4,
                    ease: 'power2.in',
                    onComplete: () => {
                        if (imgElement.parentNode) {
                            imgElement.parentNode.removeChild(imgElement);
                        }
                        activeImages.delete(id);
                    }
                });
            });
        });

        // Mission section animations
        gsap.to('.heart-icon', {
            scrollTrigger: {
                trigger: '.mission',
                start: 'top center',
                toggleActions: 'play none none reverse'
            },
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.7)'
        });

        gsap.to('.mission-text', {
            scrollTrigger: {
                trigger: '.mission',
                start: 'top center',
                toggleActions: 'play none none reverse'
            },
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.3
        });

        // Portfolio header animation
        gsap.to('.portfolio-header', {
            scrollTrigger: {
                trigger: '.portfolio-section',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 1,
            y: 0,
            duration: 0.8
        });

        // Project cards animations
        gsap.utils.toArray('.project').forEach((project, index) => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: project,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });

            tl.to(project, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out'
            });
        });

        // Work Experience animations
        gsap.to('.work-experience-header', {
            scrollTrigger: {
                trigger: '.work-experience',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            opacity: 1,
            duration: 0.8
        });

        gsap.utils.toArray('.experience-item').forEach((item, index) => {
            gsap.to(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: index * 0.2
            });
        });

        gsap.to('.experience-icon', {
            scrollTrigger: {
                trigger: '.experience-icon',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.7)'
        });

        gsap.to('.download-cv', {
            scrollTrigger: {
                trigger: '.download-cv',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 1,
            y: 0,
            duration: 0.8
        });

        // Folder interaction for Design Concepts
        const folderItems = document.querySelectorAll('.folder-item');
        const conceptsGallery = document.getElementById('conceptsGallery');
        let currentActiveFolder = null;

        folderItems.forEach(folder => {
            folder.addEventListener('click', () => {
                const folderId = folder.dataset.folder;
                
                // If clicking the same folder, close it
                if (currentActiveFolder === folder) {
                    folder.classList.remove('active');
                    conceptsGallery.classList.remove('active');
                    currentActiveFolder = null;
                    
                    gsap.to(conceptsGallery, {
                        opacity: 0,
                        duration: 0.4,
                        onComplete: () => {
                            conceptsGallery.style.maxHeight = '0';
                        }
                    });
                } else {
                    // Remove active from all folders
                    folderItems.forEach(f => f.classList.remove('active'));
                    
                    // Add active to clicked folder
                    folder.classList.add('active');
                    currentActiveFolder = folder;
                    
                    // Show gallery
                    conceptsGallery.classList.add('active');
                    conceptsGallery.style.maxHeight = '5000px';
                    
                    gsap.to(conceptsGallery, {
                        opacity: 1,
                        duration: 0.5,
                        ease: 'power2.out'
                    });

                    // Animate gallery items
                    gsap.from(conceptsGallery.querySelectorAll('.concept-image'), {
                        opacity: 0,
                        y: 30,
                        duration: 0.6,
                        stagger: 0.1,
                        ease: 'power2.out'
                    });
                }
            });
        });

        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Hover animation for project cards with blur and depth effect
        const allProjects = document.querySelectorAll('.project');
        
        allProjects.forEach(project => {
            project.addEventListener('mouseenter', () => {
                // Add active class to hovered project (moves forward)
                project.classList.add('active');
                
                // Blur and scale down all other projects (moves backward)
                allProjects.forEach(otherProject => {
                    if (otherProject !== project) {
                        otherProject.classList.add('blur');
                        // Move other projects backward
                        gsap.to(otherProject, {
                            scale: 0.95,
                            duration: 0.5,
                            ease: 'power2.out'
                        });
                    }
                });

                // Animate the hovered project forward with GSAP
                gsap.to(project, {
                    scale: 1.05,
                    y: -10,
                    duration: 0.5,
                    ease: 'power2.out'
                });

                // Enhance shadow on the image wrapper
                gsap.to(project.querySelector('.project-image-wrapper'), {
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });

            project.addEventListener('mouseleave', () => {
                // Remove active class
                project.classList.remove('active');
                
                // Remove blur from all projects and reset scale
                allProjects.forEach(otherProject => {
                    otherProject.classList.remove('blur');
                    gsap.to(otherProject, {
                        scale: 1,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                });

                // Reset the project position
                gsap.to(project, {
                    scale: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });

                // Reset shadow
                gsap.to(project.querySelector('.project-image-wrapper'), {
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });
        });

        // Hamburger Menu Functionality
const hamburgerMenu = document.getElementById('hamburgerMenu');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

// Toggle mobile menu
hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('active');
    mobileNavOverlay.classList.toggle('active');
    document.body.style.overflow = mobileNavOverlay.classList.contains('active') ? 'hidden' : 'auto';
});

// Close menu when clicking on a link
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburgerMenu.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Close menu when clicking outside
mobileNavOverlay.addEventListener('click', (e) => {
    if (e.target === mobileNavOverlay) {
        hamburgerMenu.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});


// Dark Mode Functionality - Default to Light Mode
const themeToggle = document.getElementById('themeToggle');
const sunIcon = themeToggle.querySelector('.sun-icon');
const moonIcon = themeToggle.querySelector('.moon-icon');

// Initialize theme with light mode as default
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    // Default to light mode unless user explicitly chose dark
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    } else {
        // Set light mode as default
        document.documentElement.setAttribute('data-theme', 'light');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        // Ensure light mode is saved if not already set
        if (!savedTheme) {
            localStorage.setItem('theme', 'light');
        }
    }
}

// Toggle theme function
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
}

// Initialize theme on page load
initializeTheme();

// Add event listener to theme toggle
themeToggle.addEventListener('click', toggleTheme);

// Listen for system theme changes (optional - comment out if you don't want this)
// window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
//     if (!localStorage.getItem('theme')) { // Only auto-switch if no manual preference
//         initializeTheme();
//     }
// });