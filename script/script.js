const animatedItems = document.querySelectorAll('.group-5, .why_techaven_card');

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.2 }
);

animatedItems.forEach(item => observer.observe(item));

function initCarouselDots(rowSelector, dotContainerSelector, itemSelector) {
    const row = document.querySelector(rowSelector);
    const dotsContainer = document.querySelector(dotContainerSelector);

    if (!row || !dotsContainer) return;
    if (window.innerWidth > 576) return;

    const items = row.querySelectorAll(itemSelector);
    if (!items.length) return;

    // Create dots
    dotsContainer.innerHTML = '';
    items.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'carousel-dot';
        if (i === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    row.addEventListener('scroll', () => {
        const scrollLeft = row.scrollLeft;
        const itemWidth = items[0].offsetWidth;
        const index = Math.round(scrollLeft / itemWidth);

        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');
    });
}

/* INIT */
initCarouselDots(
    '.first_categories .row',
    '.carousel-dots[data-for="categories"]',
    '.group-5'
);

initCarouselDots(
    '.about_techaven .container > .row',
    '.carousel-dots[data-for="about"]',
    '.why_techaven_card'
);

initCarouselDots(
    '.why_techaven .container .row',
    '.carousel-dots[data-for="why"]',
    '.why_techaven_card'
);

document.querySelectorAll('.mobile-nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();

        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (!target) return;

        // Close offcanvas
        const offcanvasEl = document.querySelector('.offcanvas.show');
        if (offcanvasEl) {
            const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
            offcanvas.hide();
        }

        // Delay scroll until offcanvas closes
        setTimeout(() => {
            const headerOffset = document.querySelector('.group')?.offsetHeight || 80;
            const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;

            window.scrollTo({
                top: elementPosition - headerOffset - 10,
                behavior: 'smooth'
            });
        }, 300);
    });
});
