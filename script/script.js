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

const galleryItems = Array.from(document.querySelectorAll('.phoneimage-item'));
const lightbox = document.querySelector('#phoneimageLightbox');
const lightboxImg = lightbox?.querySelector('.image-lightbox-img');
const lightboxClose = lightbox?.querySelector('.image-lightbox-close');
const lightboxPrev = lightbox?.querySelector('.image-lightbox-prev');
const lightboxNext = lightbox?.querySelector('.image-lightbox-next');
let lastFocusedElement = null;
let currentLightboxIndex = 0;

function openLightboxByIndex(index) {
    if (!lightbox || !lightboxImg || !galleryItems.length) return;
    const clampedIndex = Math.max(0, Math.min(index, galleryItems.length - 1));
    const img = galleryItems[clampedIndex]?.querySelector('img');
    const fullSrc = galleryItems[clampedIndex]?.getAttribute('data-full') || img?.src;
    if (!fullSrc) return;
    currentLightboxIndex = clampedIndex;
    lastFocusedElement = document.activeElement;
    lightboxImg.src = fullSrc;
    lightboxImg.alt = img?.alt || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    lightboxClose?.focus();
}

function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    lightboxImg.alt = '';
    document.body.classList.remove('no-scroll');
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
    }
    lastFocusedElement = null;
}

galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        openLightboxByIndex(index);
    });
});

lightbox?.addEventListener('click', event => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

lightboxClose?.addEventListener('click', closeLightbox);

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && lightbox?.classList.contains('is-open')) {
        closeLightbox();
    }
    if (lightbox?.classList.contains('is-open') && event.key === 'ArrowRight') {
        openLightboxByIndex(currentLightboxIndex + 1);
    }
    if (lightbox?.classList.contains('is-open') && event.key === 'ArrowLeft') {
        openLightboxByIndex(currentLightboxIndex - 1);
    }
});

lightboxPrev?.addEventListener('click', () => {
    openLightboxByIndex(currentLightboxIndex - 1);
});

lightboxNext?.addEventListener('click', () => {
    openLightboxByIndex(currentLightboxIndex + 1);
});

const phoneGallery = document.querySelector('.phoneimage');
const phoneGalleryWrap = document.querySelector('.phoneimage-wrap');
if (phoneGallery && phoneGalleryWrap) {
    const prevButton = phoneGalleryWrap.querySelector('.phoneimage-prev');
    const nextButton = phoneGalleryWrap.querySelector('.phoneimage-next');

    function scrollToIndex(index) {
        const clampedIndex = Math.max(0, Math.min(index, galleryItems.length - 1));
        const target = galleryItems[clampedIndex];
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }

    function getCurrentIndex() {
        if (!galleryItems.length) return 0;
        let closestIndex = 0;
        let closestDistance = Number.POSITIVE_INFINITY;
        const scrollLeft = phoneGallery.scrollLeft;
        galleryItems.forEach((item, index) => {
            const distance = Math.abs(item.offsetLeft - scrollLeft);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });
        return closestIndex;
    }

    prevButton?.addEventListener('click', () => {
        const currentIndex = getCurrentIndex();
        scrollToIndex(currentIndex - 1);
    });

    nextButton?.addEventListener('click', () => {
        const currentIndex = getCurrentIndex();
        scrollToIndex(currentIndex + 1);
    });
}
