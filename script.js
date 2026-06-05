/**
 * UNMUKT Website Interactions & Functions
 * Pure Vanilla JavaScript (ES6)
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- GOOGLE SHEETS INTEGRATION CONFIG ---
  // Replace this placeholder with your deployed Google Apps Script URL.
  // Example: 'https://script.google.com/macros/s/AKfycbz.../exec'
  const GOOGLE_SCRIPT_URL = 'YOUR_SCRIPT_URL_HERE';

  /* 
   * GOOGLE APPS SCRIPT CODE (Paste this inside script.google.com project):
   * 
   * function doPost(e) {
   *   var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
   *   var data;
   *   try {
   *     data = JSON.parse(e.postData.contents);
   *   } catch(err) {
   *     return ContentService.createTextOutput(JSON.stringify({result: "error", message: "Invalid JSON"}))
   *       .setMimeType(ContentService.MimeType.JSON);
   *   }
   *   
   *   if (sheet.getLastRow() === 0) {
   *     sheet.appendRow(["Timestamp", "Form Type", "Name", "Email", "Phone", "Key Detail (Subject/Company/Interest)", "Message or Requirement Details"]);
   *   }
   *   
   *   sheet.appendRow([
   *     new Date(),
   *     data.formType || "General Inquiry",
   *     data.name || "",
   *     data.email || "",
   *     data.phone || "",
   *     data.detail1 || "",
   *     data.detail2 || ""
   *   ]);
   *   
   *   return ContentService.createTextOutput(JSON.stringify({result: "success"}))
   *     .setMimeType(ContentService.MimeType.JSON)
   *     .setHeader("Access-Control-Allow-Origin", "*");
   * }
   * 
   * function doOptions(e) {
   *   return ContentService.createTextOutput("")
   *     .setHeader("Access-Control-Allow-Origin", "*")
   *     .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
   *     .setHeader("Access-Control-Allow-Headers", "Content-Type");
   * }
   */


  // --- STICKY NAVBAR & NAVIGATION SCROLL HIGHLIGHT ---
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

 // --- ACTIVE LINK BASED ON CURRENT PAGE ---
  const setActiveLinkByPage = () => {
    const path = window.location.pathname.split('/')
      .filter(Boolean)
      .pop() || 'index.html';
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      // Ignore hash links
      if (href.startsWith('#')) return;
      // Normalize href (could be relative like 'index.html' or './index.html')
      const hrefFile = href.split('/').pop();
      if (hrefFile === path) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };
  // Run initially to highlight the correct nav link on page load
  setActiveLinkByPage();

  
  const sections = document.querySelectorAll('section');

  const handleScroll = () => {
    // Toggle sticky class on navbar
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Update active nav-link on scroll only if we have anchor links in navbar
    const hasAnchors = Array.from(navLinks).some(link => {
      const href = link.getAttribute('href');
      return href && href.startsWith('#');
    });

    if (hasAnchors) {
      let currentSectionId = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
          currentSectionId = section.getAttribute('id');
        }
      });

      if (currentSectionId) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
          }
        });
      }
    }
  };

  window.addEventListener('scroll', handleScroll);


  // --- MOBILE HAMBURGER MENU ---
  const hamburger = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('nav-menu');

  const toggleMobileMenu = () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    
    // Trap focus inside menu when open (for accessibility)
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  hamburger.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when nav-links are clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });


  // --- REVEAL ON SCROLL ANIMATIONS ---
  const reveals = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target); // Animate once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(reveal => {
    revealObserver.observe(reveal);
  });


  // --- IMPACT COUNTER INCREMENT ANIMATION ---
  const counters = document.querySelectorAll('.counter-number');
  const impactSection = document.getElementById('impact');
  let countersAnimated = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const suffix = counter.getAttribute('data-suffix') || '+';
      const duration = 2000; // 2 seconds total animation time
      const startTime = performance.now();

      const updateCount = (timestamp) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out quadratic
        const easeProgress = progress * (2 - progress);
        const currentCount = Math.floor(easeProgress * target);
        
        counter.textContent = currentCount + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target + suffix;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        animateCounters();
        countersAnimated = true;
      }
    });
  }, {
    threshold: 0.3
  });

  if (impactSection) {
    counterObserver.observe(impactSection);
  }


  // --- PRODUCT TAB FILTERING ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states on buttons
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');

      // Filter product cards with smooth transition
      productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
          const productCat = card.getAttribute('data-cat');
          if (category === 'all' || productCat === category) {
            card.classList.remove('hidden');
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.classList.add('hidden');
          }
        }, 300);
      });
    });
  });

  // Pre-fill Product in Bulk Order Request on Inquiry click
  const productInquiryButtons = document.querySelectorAll('.btn-product-inquiry');
  const bulkInterestSelect = document.getElementById('bulk-interest');

  productInquiryButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productName = btn.getAttribute('data-product');
      if (bulkInterestSelect && productName) {
        bulkInterestSelect.value = productName;
      }
    });
  });


  // --- TESTIMONIAL SLIDER ---
  const slider = document.getElementById('testimonialSlider');
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('slidePrev');
  const nextBtn = document.getElementById('slideNext');
  let currentSlide = 0;
  let slideInterval;

  const updateSliderPosition = () => {
    if (!slider) return;
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update dots
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSliderPosition();
  };

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSliderPosition();
  };

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetSlideTimer();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetSlideTimer();
    });
  }

  // Dots click handler
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      currentSlide = parseInt(dot.getAttribute('data-index'), 10);
      updateSliderPosition();
      resetSlideTimer();
    });
  });

  const startSlideTimer = () => {
    slideInterval = setInterval(nextSlide, 5000); // Auto-slide every 5 seconds
  };

  const resetSlideTimer = () => {
    clearInterval(slideInterval);
    startSlideTimer();
  };

  if (slider) {
    startSlideTimer();
    
    // Pause slider on hover
    slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slider.addEventListener('mouseleave', startSlideTimer);
  }


  // --- TOAST ALERTS SYSTEM ---
  const toastContainer = document.getElementById('toastContainer');

  const showToast = (title, message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Choose icon based on type
    const successIcon = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
    const errorIcon = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
    const iconMarkup = type === 'success' ? successIcon : errorIcon;

    toast.innerHTML = `
      <div class="toast-icon">${iconMarkup}</div>
      <div class="toast-content">
        <h4>${title}</h4>
        <p>${message}</p>
      </div>
    `;

    toastContainer.appendChild(toast);
    
    // Smooth intro
    setTimeout(() => {
      toast.classList.add('show');
    }, 50);

    // Auto-remove after 4.5 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 4500);
  };


  // --- FORM VALIDATION & GOOGLE SHEETS INTEGRATION ---
  const forms = {
    bulk: {
      el: document.getElementById('bulkOrderForm'),
      type: 'Bulk Order Inquiry'
    },
    partner: {
      el: document.getElementById('partnerForm'),
      type: 'Partnership Inquiry'
    },
    contact: {
      el: document.getElementById('contactForm'),
      type: 'General Contact'
    }
  };

  const validateInput = (input) => {
    if (!input.required) return true;
    
    let isValid = true;
    
    if (input.value.trim() === '') {
      isValid = false;
    } else if (input.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(input.value);
    } else if (input.type === 'number') {
      const min = parseInt(input.getAttribute('min'), 10);
      const val = parseInt(input.value, 10);
      if (!isNaN(min) && val < min) {
        isValid = false;
      }
    }

    const errorMsg = input.nextElementSibling;
    if (!isValid) {
      input.classList.add('error');
      if (errorMsg && errorMsg.classList.contains('form-error-msg')) {
        errorMsg.style.display = 'block';
      }
    } else {
      input.classList.remove('error');
      if (errorMsg && errorMsg.classList.contains('form-error-msg')) {
        errorMsg.style.display = 'none';
      }
    }

    return isValid;
  };

  // Real-time input checking on blur
  Object.values(forms).forEach(formObj => {
    if (!formObj.el) return;

    const inputs = formObj.el.querySelectorAll('.form-control');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateInput(input));
      input.addEventListener('input', () => {
        // Clear error as user corrects the field
        if (input.classList.contains('error')) {
          validateInput(input);
        }
      });
    });

    formObj.el.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      let isFormValid = true;
      inputs.forEach(input => {
        if (!validateInput(input)) {
          isFormValid = false;
        }
      });

      if (!isFormValid) {
        showToast('Submission Failed', 'Please correct the highlighted errors before submitting.', 'error');
        return;
      }

      // Gather form values
      const submitBtn = formObj.el.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      // Mapping custom field values depending on form types
      let payload = {
        formType: formObj.type,
        name: '',
        email: '',
        phone: '',
        detail1: '',
        detail2: ''
      };

      if (formObj.type === 'Bulk Order Inquiry') {
        payload.name = document.getElementById('bulk-name').value;
        payload.email = document.getElementById('bulk-email').value;
        payload.phone = document.getElementById('bulk-phone').value;
        payload.detail1 = `Company: ${document.getElementById('bulk-company').value || 'N/A'} | Product: ${document.getElementById('bulk-interest').value}`;
        payload.detail2 = `Qty: ${document.getElementById('bulk-qty').value} | Details: ${document.getElementById('bulk-details').value}`;
      } else if (formObj.type === 'Partnership Inquiry') {
        payload.name = document.getElementById('partner-name').value;
        payload.email = document.getElementById('partner-email').value;
        payload.phone = document.getElementById('partner-phone').value;
        payload.detail1 = `Company: ${document.getElementById('partner-company').value}`;
        payload.detail2 = document.getElementById('partner-msg').value;
      } else if (formObj.type === 'General Contact') {
        payload.name = document.getElementById('contact-name').value;
        payload.email = document.getElementById('contact-email').value;
        payload.phone = document.getElementById('contact-phone').value || 'N/A';
        payload.detail1 = `Subject: ${document.getElementById('contact-subject').value}`;
        payload.detail2 = document.getElementById('contact-message').value;
      }

      // Try hitting App Script url
      try {
        if (GOOGLE_SCRIPT_URL === 'YOUR_SCRIPT_URL_HERE') {
          // Simulation mode when placeholder is not replaced
          console.log("Submit Payload Simulated:", payload);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Mock network lag
          showToast('Query Sent (Demo)', 'Form was verified. To enable real Google Sheet saves, replace YOUR_SCRIPT_URL_HERE in script.js.', 'success');
          formObj.el.reset();
        } else {
          // Active production send
          const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'text/plain' // Use text/plain to bypass CORS preflight restrictions in Apps Script POSTs
            },
            body: JSON.stringify(payload)
          });
          
          const result = await response.json();
          if (result.result === 'success') {
            showToast('Success!', 'Your inquiry has been successfully registered. We will contact you soon.', 'success');
            formObj.el.reset();
          } else {
            throw new Error(result.message || 'Apps script error response');
          }
        }
      } catch (err) {
        console.error(err);
        showToast('Submission Error', 'Could not transmit form data. Please try again later.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  });


  // --- MULTI-PURPOSE LIGHTBOX & MEDIA HANDLERS ---
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const galleryItems = document.querySelectorAll('.gallery-item');

  // Artisan details data for read-more previews
  const artisanStories = {
    kamla: {
      name: "Kamla Devi",
      village: "Sikra Village",
      title: "How Stitching Unleashed Independence",
      story: "Kamla Devi's journey started four years ago. A mother of three, she depended entirely on her husband's dry crop harvesting. After joining the introductory stitching batches, she showed a quick eye for clean fabric lines and edge trims. Today, Kamla acts as the lead inspector at our Sikra hub, certifying B2B packaging and earning a reliable monthly salary that pays for her daughter's higher classes. 'I used to ask for pennies; today I manage family accounts,' she says proudly."
    },
    radha: {
      name: "Radha Bai",
      village: "Guda Village",
      title: "Preserving Ancestral Suf Embroidery",
      story: "Radha Bai spent years believing her grandmother's hand needle patterns were just house decorations. Unmukt helped her translate these geometric Suf shapes into contemporary cushion covers. Her first design batch sold out within weeks at a city craft show. Through her embroidery income, Radha bought solar panel sets for her home, enabling her children to study safely under clean lights and protecting her eyesight from smoke during evening stitch works."
    },
    rukmani: {
      name: "Rukmani Devi",
      village: "Nayla Cluster",
      title: "From Home Artisan to Regional Coordinator",
      story: "Rukmani Devi joined Unmukt as a raw fabric cutter. Nurtured by our capacity building courses in active leadership and digital payments, she gained massive confidence. Today, she functions as the regional coordinator of the Nayla training hub, managing batch materials, tracking artisan payroll sheets on her smartphone, and addressing cluster issues at monthly block council meetings."
    }
  };

  const openLightbox = (contentHTML, captionText) => {
    // Clear and swap lightbox image content
    lightboxImage.innerHTML = contentHTML;
    lightboxCaption.textContent = captionText;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Listen for Escape key to close modal
    document.addEventListener('keydown', onEscKey);
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    // Stop any video playbacks in modal
    lightboxImage.innerHTML = '';
    document.removeEventListener('keydown', onEscKey);
  };

  const onEscKey = (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      // Close only if click is on backdrop
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Gallery Click Event
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const caption = item.getAttribute('data-caption');
      const itemNum = item.getAttribute('data-index');
      
      const customHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width: 80px; height: 80px; stroke: #888; margin-bottom: 20px;">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        <span style="color: #bbb; text-transform: uppercase; font-size: 0.9rem; font-weight: 700; letter-spacing: 2px;">Gallery Photo ${itemNum} Preview Placeholder</span>
        <span style="color: #666; font-size: 0.8rem; margin-top: 10px;">(In production, this area loads the full resolution image asset)</span>
      `;
      openLightbox(customHTML, caption);
    });
  });

  // Artisan Read-More Click Event
  const readStoryButtons = document.querySelectorAll('.btn-read-story');
  readStoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const artisanKey = btn.getAttribute('data-artisan');
      const data = artisanStories[artisanKey];
      if (data) {
        const customHTML = `
          <div style="background-color: var(--color-pure-white); color: var(--color-charcoal); padding: 40px; border-radius: var(--radius-lg); text-align: left; max-width: 600px; border: 1px solid rgba(0,0,0,0.1);">
            <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-terracotta); text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 5px;">${data.village}</span>
            <h3 style="font-size: 2rem; margin-bottom: 5px; color: var(--color-earth-brown); font-family: var(--font-heading);">${data.name}</h3>
            <h4 style="font-size: 1.1rem; font-family: var(--font-body); font-weight: 600; color: var(--color-natural-green); margin-bottom: 20px;">${data.title}</h4>
            <p style="font-size: 0.98rem; line-height: 1.6; color: var(--color-text-muted); margin-bottom: 0;">${data.story}</p>
          </div>
        `;
        openLightbox(customHTML, `${data.name}'s Transformation Journey`);
      }
    });
  });


  // --- VIDEO TRANSFORMATION IFRAME EMBEDS ---
  const mainVideoPlayer = document.getElementById('mainVideoPlayer');

  const playVideo = (videoURL, title) => {
    // Generate YouTube iframe format or simulator placeholder
    let mediaHTML = '';
    
    if (videoURL.includes('youtube.com') || videoURL.includes('youtu.be')) {
      // In live production, load actual Youtube Player
      mediaHTML = `<iframe class="video-iframe" src="${videoURL}?autoplay=1" title="${title}" style="width:100%; height:100%; border:none; border-radius: var(--radius-lg);" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    } else {
      // Demo fallback placeholder
      mediaHTML = `
        <div class="placeholder-image" style="width: 100%; height: 100%; background-color: #111; border: none; padding: 0;">
          <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" style="width: 50px; height: 50px; stroke: var(--color-terracotta); margin-bottom: 10px;"><polygon points="10 8 16 12 10 16 10 8"/></svg>
          <p style="color: #bbb; text-transform: uppercase; font-size: 0.8rem; margin-bottom: 6px;">Simulated Video Playback Mode</p>
          <span style="color: #777; font-size: 0.72rem; max-width: 280px; display: inline-block;">To embed a live video, replace the URL placeholder in index.html with your active YouTube Embed link.</span>
        </div>
      `;
    }

    if (mainVideoPlayer) {
      mainVideoPlayer.innerHTML = mediaHTML;
    }
  };

  if (mainVideoPlayer) {
    mainVideoPlayer.addEventListener('click', () => {
      const url = mainVideoPlayer.getAttribute('data-video-url');
      playVideo(url, 'Unmukt Documentary');
    });
  }

});
