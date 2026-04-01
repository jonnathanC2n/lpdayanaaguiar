/* ============================================
   VivaMov Fisioterapia — script.js
   Bootstrap 5 + Custom Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── 1. NAVBAR: shrink on scroll ── */
  const navbar = document.getElementById('mainNav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
    toggleBackToTop();
  }, { passive: true });


  /* ── 2. ACTIVE NAV LINK on scroll ── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link-custom');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }


  /* ── 3. SCROLL REVEAL (IntersectionObserver) ── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ── 4. BACK TO TOP BUTTON ── */
  const backToTop = document.getElementById('backToTop');

  function toggleBackToTop() {
    if (window.scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ── 5. CONTACT FORM — WhatsApp redirect ── */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Bootstrap validation
      if (!contactForm.checkValidity()) {
        contactForm.classList.add('was-validated');
        return;
      }

      const nome     = document.getElementById('inputNome').value.trim();
      const telefone = document.getElementById('inputTelefone').value.trim();
      const email    = document.getElementById('inputEmail').value.trim();
      const servico  = document.getElementById('inputServico').value;
      const mensagem = document.getElementById('inputMensagem').value.trim();

      const servicoMap = {
        ortopedica: 'Fisioterapia Ortopédica',
        cirurgica:  'Reabilitação Pós-Cirúrgica',
        pilates:    'Pilates Terapêutico',
        outros:     'Outros',
        '':         'Não especificado'
      };

      const texto = `Olá, Dayana! 👋\n\n` +
        `Meu nome é *${nome}*.\n` +
        `📞 Telefone: ${telefone}\n` +
        `📧 E-mail: ${email}\n` +
        `💆 Serviço de interesse: *${servicoMap[servico] || servico}*\n\n` +
        `Mensagem:\n${mensagem}\n\n` +
        `Gostaria de agendar uma avaliação!`;

      const encodedText = encodeURIComponent(texto);
      const whatsappUrl = `https://wa.me/5511999999999?text=${encodedText}`;

      // Visual feedback before redirect
      const btn = document.getElementById('submitFormBtn');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Redirecionando...';
      btn.disabled = true;
      btn.style.background = '#25d366';

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        // Reset form
        contactForm.reset();
        contactForm.classList.remove('was-validated');
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        btn.style.background = '';
      }, 1000);
    });
  }


  /* ── 6. SMOOTH SCROLL for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ── 7. PHONE MASK for input ── */
  const phoneInput = document.getElementById('inputTelefone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      let v = this.value.replace(/\D/g, '');
      if (v.length <= 10) {
        v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      } else {
        v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      }
      this.value = v;
    });
  }


  /* ── 8. COUNTER ANIMATION for hero stats ── */
  const counters = document.querySelectorAll('.hero-stat-value');
  let counted    = false;

  function startCounters() {
    if (counted) return;
    counted = true;
    counters.forEach(counter => {
      const raw    = counter.textContent.replace(/[^0-9]/g, '');
      const target = parseInt(raw, 10);
      if (isNaN(target)) return;
      const prefix = counter.textContent.match(/^\+/) ? '+' : '';
      const suffix = counter.textContent.match(/\%$/) ? '%' : '';
      let current  = 0;
      const step   = Math.ceil(target / 60);
      const timer  = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = prefix + current + suffix;
      }, 25);
    });
  }

  // Start counter when hero stats are visible
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(startCounters, 800);
      }
    }, { threshold: 0.5 });
    heroObserver.observe(heroSection);
  }

});
