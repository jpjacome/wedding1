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