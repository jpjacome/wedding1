// Loading screen handler
window.addEventListener('load', function() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const pageContent = document.getElementById('page-content');
    
    // Wait for everything to load
    setTimeout(() => {
        // First: Fade out loading overlay
        loadingOverlay.classList.add('fade-out');
        
        // Then: After loading overlay fades out, show page content
        setTimeout(() => {
            pageContent.classList.add('loaded');
            
            // Remove loading overlay from DOM after content is shown
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 100);
        }, 500); // Wait for loading overlay to fade out (0.5s)
        
    }, 500); // Initial delay
});

// Intersection Observer to add fade-in animation to wrapper content
document.addEventListener('DOMContentLoaded', function() {
    // Get all wrapper elements except wrapper-1
    const wrappers = document.querySelectorAll('.wrapper:not(.wrapper-1)');
    
    // Options for the Intersection Observer
    const options = {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before the element comes into view
    };
    
    // Create the observer
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Find all direct children of the wrapper and add fade-in-1 class
                const children = entry.target.children;
                Array.from(children).forEach(child => {
                    child.classList.add('fade-in-1');
                });
                
                // Optional: Stop observing this element once it's animated
                // observer.unobserve(entry.target);
            }
        });
    }, options);
    
    // Start observing all wrapper elements (except wrapper-1)
    wrappers.forEach(wrapper => {
        observer.observe(wrapper);
    });
    
    // Force video to play on mobile
    const video = document.querySelector('.wrapper-1 video');
    if (video) {
        // Try to play the video
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Auto-play was prevented:', error);
                // If autoplay fails, we can add a play button or other fallback
            });
        }
        
        // Handle visibility change to restart video
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden && video.paused) {
                video.play().catch(e => console.log('Play failed:', e));
            }
        });
        
        // Ensure video loops properly on mobile
        video.addEventListener('ended', function() {
            video.currentTime = 0;
            video.play().catch(e => console.log('Loop failed:', e));
        });
    }
});

// EmailJS configuration
emailjs.init("kgZlrpJKfDpOhLkvX"); // Replace with your EmailJS public key

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('rsvp-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check honeypot for spam
            const honeypot = form.querySelector('input[name="honeypot"]');
            if (honeypot && honeypot.value !== '') {
                console.log('Spam detected');
                return;
            }
            
            // Get form data
            const formData = new FormData(form);
            const currentDate = new Date().toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                attendance: formData.get('attendance'),
                guests: formData.get('guests'),
                message: formData.get('message') || 'Sin mensaje',
                date: currentDate,
                from_name: formData.get('name'),
                from_email: formData.get('email')
            };
            
            // Show loading state
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            // Send email using EmailJS
            emailjs.send('service_skzxxs6', 'template_fv1upvn', data)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    // Redirect to thank you page
                    window.location.href = '/thank-you.html';
                }, function(error) {
                    console.log('FAILED...', error);
                    alert('Error al enviar el mensaje. Por favor, intenta de nuevo.');
                    
                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
});