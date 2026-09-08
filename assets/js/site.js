/* ==========================================================================
   ADA Construction Group Pty Ltd — shared site behaviour
   PRD refs: FR-002 (mobile nav), FR-004 (form validation), FR-005 (honeypot),
   9.5 (project filtering), 13 (analytics events).
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     0. Glassmorphic navbar scroll state — all pages
     ------------------------------------------------------------------ */
  var masthead = document.querySelector('.masthead');
  if (masthead) {
    function updateNavStyle() {
      if (window.scrollY > 40) {
        masthead.classList.add('is-scrolled');
      } else {
        masthead.classList.remove('is-scrolled');
      }
    }
    updateNavStyle();
    window.addEventListener('scroll', updateNavStyle, { passive: true });
  }

  /* ------------------------------------------------------------------
     1. Sticky-header mobile navigation (FR-002: CTA reachable in one tap)
     ------------------------------------------------------------------ */
  var toggle = document.querySelector(".nav__toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
    });
    // Close the menu when a link inside it is chosen.
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ------------------------------------------------------------------
     2. FAQ accordions — keyboard-operable, content present when JS is off
     ------------------------------------------------------------------ */
  document.querySelectorAll(".faq__q").forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      // Toggle this item; collapse others in the same group (one-open pattern).
      btn.closest(".faq").querySelectorAll(".faq__q").forEach(function (other) {
        other.setAttribute("aria-expanded", "false");
        document.getElementById(other.getAttribute("aria-controls")).hidden = true;
      });
      if (!expanded) {
        btn.setAttribute("aria-expanded", "true");
        panel.hidden = false;
      }
    });
  });

  /* ------------------------------------------------------------------
     3. Project filtering — PRD 9.5 (category + location, empty state)
     ------------------------------------------------------------------ */
  var filterbar = document.querySelector("[data-filterbar]");
  if (filterbar) {
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-project-card]"));
    var empty = document.querySelector("[data-empty-state]");
    var chips = Array.prototype.slice.call(filterbar.querySelectorAll(".chip"));

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var group = chip.getAttribute("data-filter-group");
        var wasPressed = chip.getAttribute("aria-pressed") === "true";

        // Toggle within the group; "all" clears the group.
        chips.forEach(function (c) {
          if (c.getAttribute("data-filter-group") === group) {
            c.setAttribute("aria-pressed", "false");
          }
        });
        if (!wasPressed) chip.setAttribute("aria-pressed", "true");

        // Active filter values per group.
        var active = {};
        chips.forEach(function (c) {
          if (c.getAttribute("aria-pressed") !== "true") return;
          var g = c.getAttribute("data-filter-group");
          var v = c.getAttribute("data-filter-value");
          if (v !== "all") active[g] = v; // "all" leaves group unfiltered
        });

        var shown = 0;
        cards.forEach(function (card) {
          var data = card.dataset;
          var match = true;
          Object.keys(active).forEach(function (g) {
            var key = g === "service" ? "service" : g;
            var values = (data[key] || "").split("|").map(function (s) { return s.trim(); });
            if (values.indexOf(active[g]) === -1) match = false;
          });
          card.hidden = !match;
          if (match) shown++;
        });

        if (empty) empty.hidden = shown !== 0;
        track("project_filter_use", { filter_group: group, filter_value: chip.getAttribute("data-filter-value") });
      });
    });
  }

  /* ------------------------------------------------------------------
     4. Analytics event shim — PRD 13.
     Replace `track` with the client's approved analytics wrapper.
     ------------------------------------------------------------------ */
  window.track = function (name, params) {
    // Example only: wire to GA4 gtag / Plausible / Matomo once approved.
    if (window.gtag) {
      window.gtag("event", name, params || {});
    } else if (window.console) {
      console.log("[analytics]", name, params || {});
    }
  };

  // Auto-tag primary CTA / phone / email clicks from data attributes.
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-cta]");
    if (el) track("primary_cta_click", { cta_label: el.getAttribute("data-cta"), page: location.pathname });
    var tel = e.target.closest('a[href^="tel:"]');
    if (tel) track("phone_click", { page: location.pathname, device: deviceType() });
    var mail = e.target.closest('a[href^="mailto:"]');
    if (mail) track("email_click", { page: location.pathname, device: deviceType() });
  });

  function deviceType() {
    return window.matchMedia("(max-width: 620px)").matches ? "mobile" : "desktop";
  }

  // enquiry_start / enquiry_submit are fired from the form module below.
  // guide_download is wired on the insights pages.

  /* ------------------------------------------------------------------
     5. Enquiry form validation & submission — PRD FR-004 & 9.6
     Progressive disclosure: optional detail fields live behind a toggle.
     ------------------------------------------------------------------ */
  var form = document.getElementById("enquiry-form");
  if (form) {
    var started = false;
    var detail = document.getElementById("more-detail");
    var detailToggle = document.getElementById("more-detail-toggle");

    if (detailToggle && detail) {
      detailToggle.addEventListener("click", function () {
        var open = detail.hidden;
        detail.hidden = !open;
        detailToggle.setAttribute("aria-expanded", String(open));
        detailToggle.textContent = open ? "Hide optional details" : "Add optional details";
      });
    }

    form.addEventListener("input", function () {
      if (!started) {
        started = true;
        track("enquiry_start", { form_name: form.getAttribute("data-form-name") || "enquiry", page: location.pathname });
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot: bots fill every field; humans never see this one (FR-005).
      if (form.company_website && form.company_website.value) {
        return;
      }

      var valid = true;
      var fieldsToCheck = [
        { el: form.full_name, test: function (v) { return v.trim().length > 1; }, msg: "Please enter your full name." },
        { el: form.email, test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, msg: "Please enter a valid email address." },
        { el: form.phone, test: function (v) { return v.trim().length >= 8; }, msg: "Please enter a phone number we can reach you on." },
        { el: form.project_type, test: function (v) { return v !== ""; }, msg: "Please choose a project type." },
        { el: form.location, test: function (v) { return v.trim().length > 1; }, msg: "Please tell us where the project is located." },
        { el: form.description, test: function (v) { return v.trim().length >= 10; }, msg: "Please describe your project in a sentence or two." },
        { el: form.consent, test: function (v) { return v === true; }, msg: "We need your permission to contact you." }
      ];

      fieldsToCheck.forEach(function (f) {
        if (!f.el) return;
        var wrapper = f.el.closest(".field");
        var msgEl = wrapper ? wrapper.querySelector(".err-msg") : null;
        var ok = f.test(f.el.type === "checkbox" ? f.el.checked : f.el.value);
        if (wrapper) wrapper.setAttribute("data-invalid", String(!ok));
        if (msgEl) msgEl.textContent = f.msg;
        if (!ok) valid = false;
      });

      if (!valid) {
        var firstBad = form.querySelector('.field[data-invalid="true"] input, .field[data-invalid="true"] select, .field[data-invalid="true"] textarea, .field[data-invalid="true"] .check-row input');
        if (firstBad) firstBad.focus();
        return;
      }

      // Demo submission: no backend is attached to this draft build, so we
      // log the analytics event and route to the thank-you page. The README
      // documents where to connect a real handler (CRM / email service).
      track("enquiry_submit", {
        form_name: form.getAttribute("data-form-name") || "enquiry",
        project_type: form.project_type.value
      });
      window.location.href = form.getAttribute("action") || "thank-you.html";
    });
  }
})();
