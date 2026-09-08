# ADA Construction Group Pty Ltd — Draft Website

A conversion-focused marketing website for a residential house-building and
construction company, built to the **House-Building and Construction Website
PRD v1.0** (reference: Superior Building Group Australia, inspiration only —
no content, wording, imagery or design copied).

**Stack:** static HTML/CSS/JS. No build tools, no dependencies. Open
`index.html` in a browser, or host the folder on any static host
(Netlify, Vercel, S3, Apache/Nginx).

---

## What's in the box

| Area | Files |
|---|---|
| Core pages | `index.html`, `about.html`, `services.html`, `process.html`, `projects.html`, `gallery.html`, `faqs.html`, `insights.html`, `contact.html`, `thank-you.html` |
| Service detail (6) | `services/*.html` |
| Project case studies (8) | `projects/*.html` |
| Insights articles (3) | `insights/*.html` |
| Legal | `privacy.html`, `terms.html`, `accessibility.html` |
| SEO | `robots.txt`, `sitemap.xml` (update domain), per-page meta + Open Graph + JSON-LD |
| Assets | `assets/css/styles.css`, `assets/js/site.js`, `assets/img/*.svg` |

### Features implemented (PRD refs)

- **Responsive** 320px → desktop, sticky header, mobile menu with CTA
  (FR-001, FR-002, 8.1, 10.4)
- **Project filtering** by service + region with empty state (9.5)
- **Enquiry form**: required + progressive-disclosure optional fields,
  client-side validation with per-field error messages and preserved input,
  honeypot anti-spam, consent checkbox (FR-004, FR-005, 9.6)
- **Analytics event shim**: `window.track()` fires `primary_cta_click`,
  `phone_click`, `email_click`, `enquiry_start`, `enquiry_submit`,
  `project_filter_use` per PRD §13 — no message content sent
- **Accessibility**: skip links, keyboard-operable FAQ accordions and filter
  chips with `aria-pressed`, visible focus, semantic landmarks, reduced-motion
  support, 44px tap targets (10.3)
- **SEO**: one H1 per page, meta descriptions, OG tags, breadcrumbs,
  JSON-LD (LocalBusiness on home, FAQPage on FAQs, Article on insights)
  (12.1)

---

## ⚠️ Before launch — required client actions

This is a **draft with sample content**. The PRD forbids publishing
unverified claims, so everything below must be confirmed before going live
(PRD §11.1, §18, §21). Placeholder values are marked in the pages with
`[brackets]` or `draft` notices.

### 1. Content checklist (PRD 11.1)

- [ ] Business name / logo / brand palette (swap "Meridian Building Co.")
- [ ] Phone, email, address, hours — replace all `(02) 0000 0000` /
      `meridianbuilding.example` placeholders
- [ ] **Service area** — replace every `[service area]` mention (search the
      folder for `[service`)
- [ ] Licence / registration / insurance / warranty details — About page
      credentials table
- [ ] Credibility strip numbers (years, project count, warranty) — **home
      page proof strip; verify or remove**
- [ ] Company history + leadership bios (About)
- [ ] Response-time promise — contact page, FAQs, thank-you page (**only
      publish one the team can consistently meet**)
- [ ] Testimonials — replace drafts with approved, attributable quotes
- [ ] Project records — 8 case studies are illustrative placeholders;
      PRD §21 minimum is 6 *verified* records
- [ ] FAQ answers marked `[to be confirmed]` (fees, response time, warranty)
- [ ] Privacy policy, terms, cookie/consent behaviour — legal review per
      jurisdiction

### 2. Replace placeholder imagery

All imagery is original SVG illustration standing in for photography
(chosen so nothing is copied and nothing needs a licence). Replace
`assets/img/*.svg` with client-owned/licensed photos before launch; keep the
same filenames and `alt` text discipline.

### 3. Wire up the form backend

`assets/js/site.js` currently logs the `enquiry_submit` event and redirects to
`thank-you.html`. To go live, connect a form handler (Netlify Forms, Formspree,
 Basin, or your own endpoint) that:

1. notifies the approved business inbox,
2. stores the lead in the CRM / lead store,
3. sends the visitor an acknowledgement email,
4. enforces server-side validation + rate limiting (honeypot is already in
   the markup),
5. restricts file uploads (type + size) server-side.

### 4. Analytics

Replace the `window.track` shim in `assets/js/site.js` with the client's
approved analytics wrapper (GA4 `gtag`, Plausible, or Matomo) per PRD §13,
and add consent tooling if required by jurisdiction.

### 5. SEO housekeeping

- Update the domain in `sitemap.xml` + uncomment the `Sitemap:` line in
  `robots.txt`
- Add the site to Google Search Console
- Set up redirects if replacing an existing site (PRD 12.1)

### 6. QA

Run the launch checklist in PRD §18 (responsive passes at 320px/tablet/
desktop, keyboard-only walkthrough, screen-reader pass on home → enquiry
flow, link check, analytics verification with test leads).

---

## Editing notes

- **Global styles**: all design tokens are CSS custom properties at the top
  of `assets/css/styles.css` — rebrand by editing `--clay`, `--ink`, etc.
- **Nav/footer**: duplicated per page (static site). A find-and-replace of a
  link change across `*.html` is the workflow, or introduce templating when
  the site moves to a CMS (PRD 9.8 maps the required content types).
- **Structured data**: keep JSON-LD in sync with visible content when editing
  FAQs or business details (PRD 12.1).
