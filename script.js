document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple Intersection Observer for scroll animations (fade in / slide up)
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.05
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation starting state to specific elements
    const animateElements = document.querySelectorAll('.glass-card, .glass-image, .section-title, .offer-card');
    
    animateElements.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // --- HERO CAROUSEL ---
    function initCarousel(trackId, wrapperClass) {
        const track = document.getElementById(trackId);
        if (track) {
            let index = 0;
            const slides = track.querySelectorAll('.carousel-slide');
            
            function moveCarousel() {
                const slideWidth = slides[0].offsetWidth + 15; // + gap
                const containerWidth = document.querySelector('.' + wrapperClass).offsetWidth;
                
                const maxIndex = Math.max(0, slides.length - Math.floor(containerWidth / slideWidth));

                index++;
                if (index > maxIndex) {
                    index = 0; // go back to start
                }

                track.style.transform = `translateX(-${index * slideWidth}px)`;
            }

            setInterval(moveCarousel, 3000); // Mudar a cada 3 segundos
        }
    }

    initCarousel('hero-carousel', 'hero-carousel-wrapper');
    initCarousel('bonus-carousel', 'bonus-carousel-wrapper');

    // --- COUNTDOWN TIMER ---
    // Timer starts at 10 minutes for real urgency
    let totalSeconds = 10 * 60;
    const hoursEl = document.getElementById('timer-hours');
    const minutesEl = document.getElementById('timer-minutes');
    const secondsEl = document.getElementById('timer-seconds');

    if (hoursEl && minutesEl && secondsEl) {
        setInterval(() => {
            if (totalSeconds <= 0) return; // Stop at zero
            totalSeconds--;
            
            const h = Math.floor(totalSeconds / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);
            const s = totalSeconds % 60;
            
            hoursEl.textContent = h.toString().padStart(2, '0');
            minutesEl.textContent = m.toString().padStart(2, '0');
            secondsEl.textContent = s.toString().padStart(2, '0');
        }, 1000);
    }

    // --- FAKE SALES NOTIFICATIONS ---
    const names = [
        "Ana Clara", "Beatriz S.", "Camila", "Juliana M.", 
        "Mariana", "Fernanda Costa", "Letícia", "Amanda F.", 
        "Isabela", "Bruna", "Gabriela", "Luana"
    ];

    const toastContainer = document.getElementById('toast-container');

    function createToast() {
        if (!toastContainer) return;

        const randomName = names[Math.floor(Math.random() * names.length)];
        const minutesAgo = Math.floor(Math.random() * 15) + 1; // 1 to 15 minutes ago

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="ph-fill ph-shopping-bag"></i>
            </div>
            <div class="toast-content">
                <p><strong>${randomName}</strong> acabou de garantir o Super Kit! 💖</p>
                <span class="toast-time">Há ${minutesAgo} minuto${minutesAgo > 1 ? 's' : ''}</span>
            </div>
        `;

        toastContainer.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Animate out and remove after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 600); // Wait for transition to finish
        }, 5000);
    }

    // Trigger first notification quickly, then randomly every 12 to 25 seconds
    setTimeout(createToast, 3000);
    
    function triggerRandomToast() {
        const nextTime = Math.floor(Math.random() * (25000 - 12000 + 1)) + 12000;
        setTimeout(() => {
            createToast();
            triggerRandomToast();
        }, nextTime);
    }
    triggerRandomToast();

    // --- GEO LOCATION ---
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            if (data && data.city) {
                const locationSpan = document.getElementById('user-location');
                if (locationSpan) {
                    locationSpan.textContent = data.city;
                }
            }
        })
        .catch(err => console.log('Location fetch failed, fallback used.'));

    // --- TESTIMONIAL CAROUSEL (Mobile only) ---
    const testimonialCarousel = document.getElementById('testimonial-carousel');
    if (testimonialCarousel) {
        setInterval(() => {
            // Only auto-scroll if it's currently scrollable (like on mobile)
            if (testimonialCarousel.scrollWidth > testimonialCarousel.clientWidth) {
                const cardWidth = testimonialCarousel.querySelector('.testimonial-card').offsetWidth + 15; // 15 is margin
                if (testimonialCarousel.scrollLeft + testimonialCarousel.clientWidth >= testimonialCarousel.scrollWidth - 10) {
                    // Reached the end, scroll back to start
                    testimonialCarousel.scrollLeft = 0;
                } else {
                    // Scroll to next
                    testimonialCarousel.scrollLeft += cardWidth;
                }
            }
        }, 4000); // 4 seconds interval
    }
});
