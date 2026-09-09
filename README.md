# ADA Construction Group Pty Ltd — Draft Website

A conversion-focused marketing website for a residential house-building and
construction company, built to the **House-Building and Construction Website
PRD v1.0** (reference: Superior Building Group Australia, inspiration only —
no content, wording, imagery or design copied).

**Stack:** static HTML/CSS/JS. No build tools, no dependencies. Open
`index.html` in a browser, or host the folder on any static host
(Netlify, Vercel, S3, Apache/Nginx).

---

## Site structure (3 pages + supporting pages)

| Area | Files |
|---|---|
| Main pages | `index.html` (Home), `projects.html` (Projects), `contact.html` (Contact) |
| Form completion | `thank-you.html` (conversion page, noindex) |
| Legal | `privacy.html`, `terms.html`, `accessibility.html` |
| SEO | `robots.txt`, `sitemap.xml` (update domain), per-page meta + Open Graph + JSON-LD |
| Assets | `assets/css/styles.css`, `assets/js/site.js`, `assets/img/*` |

The Projects page currently shows a "coming soon" state — no published
projects yet. When the first verified case studies are ready, add them to
`projects.html` (the card, filter and empty-state markup pattern from the
original build can be reintroduced at that point).

### Features implemented (PRD refs)

- **Responsive** 320px → desktop, sticky header, mobile menu with CTA
  (FR-001, FR-002, 8.1, 10.4)
- **Enquiry form**: required + progressive-disclosure optional fields,
  client-side validation with per-field error messages and preserved input,
  honeypot anti-spam, consent checkbox (FR-004, FR-005, 9.6)
- **Analytics event shim**: `window.track()` fires `primary_cta_click`,
  `phone_click`, `email_click`, `enquiry_start`, `enquiry_submit`
  per PRD §13 — no message content sent
- **Accessibility**: skip links, visible focus, semantic landmarks,
  reduced-motion support, 44px tap targets (10.3)
- **SEO**: one H1 per page, meta descriptions, OG tags, breadcrumbs,
  JSON-LD LocalBusiness on home (12.1)

---

## ⚠️ Before launch — required client actions

This is a **draft with sample content**. The PRD forbids publishing
unverified claims, so everything below must be confirmed before going live
(PRD §11.1, §18, §21). Placeholder values are marked in the pages with
`[brackets]` or `draft` notices.

### 1. Content checklist (PRD 11.1)

- [x] Service area — Sydney (applied site-wide)
- [x] Builder's Licence No. 494101C (applied site-wide)
- [ ] Phone, email, address, hours — replace all `(02) 0000 0000` /
      `adaconstruction.example` placeholders
- [x] Credibility strip numbers (years, project count, warranty) — removed
      at client request (unverified stats)
- [ ] Response-time promise — contact page, thank-you page (**only
      publish one the team can consistently meet**)
- [ ] Project records — none published yet; add verified case studies to
      `projects.html` when ready
- [ ] Privacy policy, terms, cookie/consent behaviour — legal review per
      jurisdiction
- [ ] Legal placeholders still in place: registered address (contact page
      side panel), governing law (terms), cookie/analytics and third-party
      sections (privacy), response timeframes (accessibility, thank-you)

### 2. Replace placeholder imagery

All photographic imagery is stock standing in for project photography.
Replace `assets/img/*` with client-owned/licensed photos before launch; keep
the same filenames and `alt` text discipline.

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
- Set up redirects if replacing an existing site (PRD 12.1) — note the old
  site had about/, services/, process/, insights/, gallery/ and faqs/ URLs
  that will now 404 without redirects

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
  business details (PRD 12.1).
