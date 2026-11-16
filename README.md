# Hi, I'm Ian Bédard 👋

Web developer in Ottawa–Gatineau. I build bilingual (English/French), accessible websites and Shopify stores for small businesses.

- 🏛️ 5+ years building Government of Canada websites, where quality, security and accessibility are non-negotiable
- 🌐 Every site in both official languages, done properly
- ♿ Built to work with keyboards, screen readers and on every device
- 🛍️ Shopify stores for businesses ready to sell online

**Website:** [ianbedard.com](https://ianbedard.com) · **About me:** [ianbedard.com/about.html](https://ianbedard.com/about.html) · **CV:** [portfolio.ianbedard.com](https://portfolio.ianbedard.com) · **LinkedIn:** [linkedin.com/in/ianbedard](https://www.linkedin.com/in/ianbedard/)

## About this site

A static site in plain HTML, CSS and JavaScript, with no build step. Every page exists in English and French.

| Page | English | French |
| --- | --- | --- |
| Home: services, work, pricing, process, FAQ, contact | `index.html` | `fr/index.html` |
| About: experience timeline, toolkit, training, projects | `about.html` | `fr/a-propos.html` |
| Case studies | `work/*.html` | `fr/realisations/*.html` |

- `assets/css/style.css`: the whole design (monochrome editorial layout, one typeface, 12-column grid). Spacing follows the window height as well as its width, so each section fits on screen after an anchor jump.
- `assets/js/main.js`: small enhancements; the site works without it. Mobile menu, contact form, scroll reveals, the scroll scenes on the home page, the About page timeline and the toolkit globe.
- `assets/docs/`: case-study PDFs linked from the About page.
- `tools/`: Python scripts that generate the logo and favicon (`build_logo.py`), the case-study pages (`build_case_studies.py`) and the mockup images (`build_mockups.py`).

## Deploying

Pushing to `main` deploys to Hostinger through GitHub Actions (`.github/workflows/deploy.yml`). The workflow adds the commit hash to the stylesheet, script and logo URLs, so browsers and Cloudflare never serve an old cached copy.
