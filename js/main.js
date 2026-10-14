
/**
 * ANIKANT SURVE — PORTFOLIO JAVASCRIPT
 * Interactivity: Nav, Lightbox Modal, Video Player, Filters, Toast & Form Handling
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. STICKY NAVBAR & ACTIVE NAV TRACKING
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.navbar__link');
  const sections = document.querySelectorAll('section[id]');
  const mobileMenu = document.querySelector('.navbar__mobile');
  const navToggle = document.querySelector('.navbar__toggle');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let currentSection = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // Mobile menu toggle
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        navToggle.classList.remove('open');
      });
    });
  }

  // 2. SCROLL REVEAL ANIMATIONS
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // 3. GRAPHIC DESIGN FILTER TABS
  const filterTabs = document.querySelectorAll('.filter-tab');
  const graphicGroups = document.querySelectorAll('.graphic-group');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      graphicGroups.forEach(group => {
        const category = group.getAttribute('data-category');
        if (filter === 'all' || filter === category) {
          group.style.display = 'block';
        } else {
          group.style.display = 'none';
        }
      });
    });
  });

  // 4. LIGHTBOX & MODAL SYSTEM (Image & Video)
  const modal = document.getElementById('portfolioModal');
  const modalImg = document.getElementById('modalImage');
  const modalVideo = document.getElementById('modalVideo');
  const modalClose = document.getElementById('modalClose');

  function openImageModal(src, alt = '') {
    if (!modal) return;
    modalVideo.style.display = 'none';
    modalVideo.pause();
    modalImg.style.display = 'block';
    modalImg.src = src;
    modalImg.alt = alt;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function openVideoModal(videoSrc) {
    if (!modal) return;
    modalImg.style.display = 'none';
    modalVideo.style.display = 'block';
    modalVideo.src = videoSrc;
    modal.classList.add('active');
    modalVideo.play().catch(() => {});
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modalVideo.pause();
    modalVideo.src = '';
    document.body.style.overflow = '';
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal__content')) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Attach Lightbox triggers to image cards
  document.querySelectorAll('[data-lightbox]').forEach(card => {
    card.addEventListener('click', (e) => {
      const explicitSrc = card.getAttribute('data-lightbox');
      const img = card.querySelector('img');
      const src = (explicitSrc && explicitSrc !== 'true' && explicitSrc !== '') ? explicitSrc : (img ? img.src : '');
      const alt = img ? img.alt : '';
      if (src) {
        openImageModal(src, alt);
      }
    });
  });

  // Attach Video triggers to modal video cards if any
  document.querySelectorAll('[data-video]').forEach(card => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-video') || 'assets/videos/motion-graphics.mp4';
      openVideoModal(src);
    });
  });

  // YouTube Interactive Inline Players (Instant native playback)
  const ytCards = document.querySelectorAll('.video-card--yt');
  ytCards.forEach(card => {
    card.addEventListener('click', () => {
      const ytId = card.getAttribute('data-yt-id');
      if (!ytId) return;

      // If already playing, keep playing
      if (card.classList.contains('is-playing')) return;

      // Stop/reset any other playing YouTube cards
      ytCards.forEach(otherCard => {
        if (otherCard !== card && otherCard.classList.contains('is-playing')) {
          otherCard.classList.remove('is-playing');
          const otherPlayer = otherCard.querySelector('.video-card__player');
          if (otherPlayer) otherPlayer.innerHTML = '';
        }
      });

      // Stop any playing HTML5 native video
      document.querySelectorAll('.native-video-player').forEach(vid => {
        if (!vid.paused) vid.pause();
      });

      // Inject iframe and mark active
      const playerContainer = card.querySelector('.video-card__player');
      if (playerContainer) {
        playerContainer.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&playsinline=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
        card.classList.add('is-playing');
      }
    });
  });

  // Native inline video players auto-pause other playing videos
  const nativeVideos = document.querySelectorAll('.native-video-player');
  nativeVideos.forEach(vid => {
    vid.addEventListener('play', () => {
      // Also stop any playing YouTube card
      ytCards.forEach(ytCard => {
        if (ytCard.classList.contains('is-playing')) {
          ytCard.classList.remove('is-playing');
          const p = ytCard.querySelector('.video-card__player');
          if (p) p.innerHTML = '';
        }
      });
      nativeVideos.forEach(otherVid => {
        if (otherVid !== vid && !otherVid.paused) {
          otherVid.pause();
        }
      });
    });
  });

  // Horizontal Scroll Track Navigation for Specialty Videos
  const scrollTrack = document.getElementById('specialtyVideoTrack');
  const scrollPrevBtn = document.getElementById('scrollPrevBtn');
  const scrollNextBtn = document.getElementById('scrollNextBtn');
  if (scrollTrack && scrollPrevBtn && scrollNextBtn) {
    function updateArrowStates() {
      const maxScroll = scrollTrack.scrollWidth - scrollTrack.clientWidth - 5;
      scrollPrevBtn.disabled = scrollTrack.scrollLeft <= 5;
      scrollNextBtn.disabled = scrollTrack.scrollLeft >= maxScroll;
    }

    scrollTrack.addEventListener('scroll', updateArrowStates, { passive: true });
    updateArrowStates();

    scrollPrevBtn.addEventListener('click', () => {
      scrollTrack.scrollBy({ left: -scrollTrack.clientWidth * 0.75, behavior: 'smooth' });
    });
    scrollNextBtn.addEventListener('click', () => {
      scrollTrack.scrollBy({ left: scrollTrack.clientWidth * 0.75, behavior: 'smooth' });
    });

    // Mouse drag-to-scroll for desktop
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let dragged = false;

    scrollTrack.addEventListener('mousedown', (e) => {
      if (e.target.closest('.video-play-btn') || e.target.closest('.video-card__player')) return;
      isDown = true;
      dragged = false;
      scrollTrack.classList.add('is-dragging');
      startX = e.pageX - scrollTrack.offsetLeft;
      scrollStart = scrollTrack.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      scrollTrack.classList.remove('is-dragging');
    });

    scrollTrack.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      dragged = true;
      const x = e.pageX - scrollTrack.offsetLeft;
      const walk = (x - startX) * 1.4;
      scrollTrack.scrollLeft = scrollStart - walk;
    });

    // Prevent accidental video click when user was dragging
    scrollTrack.addEventListener('click', (e) => {
      if (dragged) {
        e.stopPropagation();
        dragged = false;
      }
    }, true);
  }

  // 5. EMAIL COPY-TO-CLIPBOARD WITH TOAST
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      const email = 'anikantsurve@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email copied to clipboard: ' + email);
      }).catch(() => {
        window.location.href = 'mailto:' + email;
      });
    });
  }

  // Simple Toast Helper
  function showToast(message) {
    let toast = document.getElementById('toastNotification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotification';
      toast.style.position = 'fixed';
      toast.style.bottom = '2rem';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      toast.style.background = '#00e5ff';
      toast.style.color = '#000';
      toast.style.padding = '0.75rem 1.75rem';
      toast.style.borderRadius = '9999px';
      toast.style.fontFamily = 'Plus Jakarta Sans, sans-serif';
      toast.style.fontWeight = '700';
      toast.style.fontSize = '0.9rem';
      toast.style.boxShadow = '0 10px 30px rgba(0, 229, 255, 0.4)';
      toast.style.zIndex = '3000';
      toast.style.opacity = '0';
      toast.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      toast.style.pointerEvents = 'none';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2500);
  }

  // 6. CONTACT FORM HANDLING (Live FormSubmit Integration)
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('userName').value.trim();
      const email = document.getElementById('userEmail').value.trim();
      const type = document.getElementById('projectType') ? document.getElementById('projectType').value : 'General';
      const subject = document.getElementById('projectSubject') ? document.getElementById('projectSubject').value.trim() : '';
      const message = document.getElementById('userMessage').value.trim();

      if (!name || !email || !message) {
        formStatus.style.color = '#ff2a85';
        formStatus.textContent = 'Please fill in all required fields.';
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        formStatus.style.color = '#ff2a85';
        formStatus.textContent = 'Please provide a valid email address.';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Message...';
      formStatus.style.color = '#00e5ff';
      formStatus.textContent = 'Sending your message to Anikant...';

      try {
        const response = await fetch('https://formsubmit.co/ajax/anikantsurve@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            'Enquiry Type': type,
            subject: subject || 'Portfolio Inquiry',
            message: message,
            _subject: `New Portfolio Inquiry from ${name} [${subject || type}]`
          })
        });

        const data = await response.json();

        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <span>→</span>';

        if (response.ok && (data.success === 'true' || data.success === true)) {
          formStatus.style.color = '#82e024';
          formStatus.textContent = `Thank you, ${name}! Your message has been sent directly to anikantsurve@gmail.com. I'll get back to you shortly.`;
          contactForm.reset();
          showToast('Message sent successfully!');
        } else if (data.message && data.message.toLowerCase().includes('activation')) {
          formStatus.style.color = '#00e5ff';
          formStatus.textContent = 'Almost done! FormSubmit sent a 1-time activation email to anikantsurve@gmail.com. Click "Activate Form" in your email inbox to start receiving all submissions.';
          contactForm.reset();
          showToast('Activation email sent to your inbox!');
        } else {
          formStatus.style.color = '#82e024';
          formStatus.textContent = `Thank you, ${name}! Your message has been recorded.`;
          contactForm.reset();
          showToast('Message sent!');
        }
      } catch (err) {
        console.error('Form submission error:', err);
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <span>→</span>';
        formStatus.style.color = '#ff2a85';
        formStatus.textContent = 'Failed to send message. Please write directly to anikantsurve@gmail.com.';
      }
    });
  }

  // 7. HERO SECTION CINEMATIC CHOREOGRAPHED ANIMATIONS (5-ACT HIERARCHY)
  initHeroCinematics();

  function initHeroCinematics() {
    // ACT 1: Mid 3D Accent shoots up from below (0.2s - 1.05s) - CSS handles entrance on #heroGlassBox

    // ACT 2: Typewriter Effect for Hero Philosophy Label (Starts at 1.15s after 3D accent locks)
    const heroLabel = document.getElementById('heroLabel');
    if (heroLabel) {
      const labelTextSpan = heroLabel.querySelector('.hero__label-text');
      const labelCursor = heroLabel.querySelector('.hero__label-cursor');
      const fullText = heroLabel.getAttribute('data-text') || 'Design is in the Details';
      let charIdx = 0;

      setTimeout(() => {
        if (labelCursor) labelCursor.classList.add('active');

        function typeNext() {
          if (charIdx < fullText.length) {
            labelTextSpan.textContent += fullText.charAt(charIdx);
            charIdx++;
            const delay = 26 + Math.random() * 14; // Crisp, rhythmic typing
            setTimeout(typeNext, delay);
          } else {
            // Typing complete: remove continuous blinking and cleanly remove cursor
            setTimeout(() => {
              if (labelCursor) {
                labelCursor.classList.remove('active');
                labelCursor.classList.add('finished');
              }
            }, 300);
          }
        }
        typeNext();
      }, 1150);
    }

    // ACT 3 & 5: Mid Glass Accent Transition to Continuous Floating + Subtle Parallax
    const glassBox = document.getElementById('heroGlassBox');
    const glassAccent = document.getElementById('heroGlassAccent');
    const heroSection = document.getElementById('hero');
    let parallaxEnabled = false;

    if (glassAccent) {
      // ACT 5: Once all elements (Title, Signature, Underline) finish at 4.10s, initiate smooth float
      setTimeout(() => {
        glassAccent.classList.add('is-floating');
        parallaxEnabled = true;
      }, 4100);

      // Interactive 3D Cursor Parallax on the container box (never interrupts CSS float on image)
      if (heroSection && glassBox) {
        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;

        heroSection.addEventListener('mousemove', (e) => {
          if (!parallaxEnabled) return;
          const rect = heroSection.getBoundingClientRect();
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          mouseX = (e.clientX - rect.left - centerX) / centerX;
          mouseY = (e.clientY - rect.top - centerY) / centerY;
        }, { passive: true });

        heroSection.addEventListener('mouseleave', () => {
          mouseX = 0;
          mouseY = 0;
        });

        function updateParallax() {
          if (parallaxEnabled) {
            currentX += (mouseX - currentX) * 0.05;
            currentY += (mouseY - currentY) * 0.05;
            const shiftX = currentX * 12;
            const shiftY = currentY * 10;
            const tilt = currentX * 2.5;
            glassBox.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 0) rotate(${tilt}deg)`;
          }
          requestAnimationFrame(updateParallax);
        }
        requestAnimationFrame(updateParallax);
      }
    }

    // ACT 3: Ethereal Ambient Canvas Particles (Activates at 2.05s as PORTFOLIO blooms)
    const canvas = document.getElementById('heroParticles');
    if (canvas && heroSection) {
      const ctx = canvas.getContext('2d');
      let isVisible = true;
      let animationFrameId;

      function resizeCanvas() {
        canvas.width = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;
      }
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas, { passive: true });

      // Generate particles
      const particleCount = 42;
      const particles = [];
      const colors = ['rgba(0, 229, 255, ', 'rgba(255, 214, 10, ', 'rgba(255, 255, 255, '];

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * (canvas.width || window.innerWidth),
          y: Math.random() * (canvas.height || window.innerHeight),
          size: Math.random() * 2.2 + 0.6,
          speedY: Math.random() * 0.45 + 0.15,
          speedX: (Math.random() - 0.5) * 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
          baseAlpha: Math.random() * 0.6 + 0.2,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulseVal: Math.random() * Math.PI,
        });
      }

      // Fade canvas particles in at Act 3 (2.05s)
      setTimeout(() => {
        canvas.classList.add('active');
      }, 2050);

      function renderParticles() {
        if (!isVisible) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
          p.y -= p.speedY;
          p.x += p.speedX;
          p.pulseVal += p.pulseSpeed;

          const alpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(p.pulseVal));

          if (p.y < -10) {
            p.y = canvas.height + 10;
            p.x = Math.random() * canvas.width;
          }
          if (p.x < -10) p.x = canvas.width + 10;
          if (p.x > canvas.width + 10) p.x = -10;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color + alpha + ')';
          ctx.shadowBlur = p.size * 5;
          ctx.shadowColor = p.color + '0.8)';
          ctx.fill();
        });

        animationFrameId = requestAnimationFrame(renderParticles);
      }

      const observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          cancelAnimationFrame(animationFrameId);
          renderParticles();
        }
      }, { threshold: 0.1 });
      observer.observe(heroSection);
    }
  }

  // 7. DISCIPLINES SCROLL REVEAL (Sequential slide up from below as user scrolls)
  const disciplinesSection = document.getElementById('disciplines') || document.querySelector('.disciplines');
  const disciplineItems = document.querySelectorAll('.disciplines__item');

  if (disciplinesSection && disciplineItems.length > 0) {
    if ('IntersectionObserver' in window) {
      const disciplinesObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            // Reset when scrolled back above viewport so it replays seamlessly
            if (entry.boundingClientRect.top > window.innerHeight) {
              entry.target.classList.remove('is-visible');
            }
          }
        });
      }, {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
      });

      disciplineItems.forEach(item => disciplinesObserver.observe(item));
    } else {
      disciplineItems.forEach(item => item.classList.add('is-visible'));
    }
  }
});
