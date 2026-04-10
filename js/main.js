/**
 * Lynear Solutions — main.js
 * Handles: smooth scroll, mobile nav toggle, active nav highlight on scroll.
 * Vanilla JS only — no framework dependencies.
 */

(function () {
  "use strict";

  /* ── Elements ── */
  const navToggle   = document.getElementById("nav-toggle");
  const mobileMenu  = document.getElementById("mobile-menu");
  const navLinks    = document.querySelectorAll(".nav-link");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");
  const sections    = document.querySelectorAll("main section[id]");

  /* ════════════════════════════════════════════
   * 1. Smooth scroll for all anchor links
   * ════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return; // plain "#" — do nothing

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({ behavior: "smooth", block: "start" });

      // Close mobile menu if open
      closeMobileMenu();

      // Move focus to section for accessibility
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      target.addEventListener("blur", function () {
        target.removeAttribute("tabindex");
      }, { once: true });
    });
  });

  /* ════════════════════════════════════════════
   * 2. Mobile nav toggle (hamburger ↔ X)
   * ════════════════════════════════════════════ */
  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      toggleMobileMenu(!isOpen);
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (
        mobileMenu.classList.contains("hidden") === false &&
        !mobileMenu.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileMenu.classList.contains("hidden") === false) {
        closeMobileMenu();
        navToggle.focus();
      }
    });
  }

  function toggleMobileMenu(open) {
    navToggle.setAttribute("aria-expanded", String(open));
    mobileMenu.setAttribute("aria-hidden",  String(!open));
    mobileMenu.classList.toggle("hidden", !open);
  }

  function closeMobileMenu() {
    toggleMobileMenu(false);
  }

  /* ════════════════════════════════════════════
   * 3. Active nav link highlight on scroll
   *    Uses IntersectionObserver for efficiency.
   * ════════════════════════════════════════════ */
  if (sections.length > 0 && "IntersectionObserver" in window) {
    const observerOptions = {
      rootMargin: "-30% 0px -60% 0px", // trigger when section is roughly in the upper third of viewport
      threshold: 0
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          setActiveLink(id);
        }
      });
    }, observerOptions);

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  function setActiveLink(sectionId) {
    const allLinks = [...navLinks, ...mobileLinks];
    allLinks.forEach(function (link) {
      const href = link.getAttribute("href");
      if (href === "#" + sectionId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

})();
