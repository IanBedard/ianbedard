import os, sys

# Usage: python tools/build_case_studies.py   (writes work/*.html and fr/realisations/*.html)
ROOT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")

# Zoom regions on the 1200x760 desktop mockup (400x300 windows), as left/top percentages.
def zoom(x0, y0):
    return f"left:{-(x0/1200)*300:.1f}%;top:{-(y0/1200)*400:.1f}%"

Z_NAV, Z_HERO, Z_CARDS = zoom(780, 30), zoom(30, 150), zoom(40, 460)

P = [
  dict(slug="cafe-brume", name="Café Brume",
    demo="https://cafe-brume.myshopify.com/", password="cafebrume",
    figma="https://www.figma.com/design/1NcVyYHfctXZY5UNMz49RK",
    en=dict(type="Shopify store", client="Coffee roaster, Gatineau", scope="Shop Launch + Subscriptions add-on",
      intro="A bilingual online shop for a small-batch coffee roaster, with recurring subscriptions and local pickup.",
      goal=["Café Brume roasts coffee in small batches and sells it at its café and at weekend markets. It wanted to sell online to customers on both sides of the river, without hiring staff to manage a store.",
            "The store had to work equally well in French and English, make subscriptions simple, and stay easy for the owners to update themselves."],
      built=["<strong>Bilingual store (FR/EN)</strong> with translated products, checkout, emails and policies",
             "<strong>Coffee subscriptions</strong>: every 2 or 4 weeks, at 10% off, which customers can pause or skip",
             "<strong>Accessible checkout</strong>: keyboard-friendly, clear error messages, good colour contrast",
             "<strong>Local pickup</strong> at the café, plus shipping across Canada with taxes set up for QC and ON",
             "Product filters by roast, origin and grind",
             "A 1-hour training session so the owners can add new coffees themselves"],
      cap=["Navigation with an EN/FR language toggle and cart", "Clear headline with subscription offer and a large, high-contrast button", "Product cards with readable prices"]),
    fr=dict(type="Boutique Shopify", client="Torréfacteur, Gatineau", scope="Lancement de boutique + option Abonnements",
      intro="Une boutique en ligne bilingue pour un torréfacteur artisanal, avec abonnements récurrents et cueillette sur place.",
      goal=["Café Brume torréfie son café en petits lots et le vend à son café et dans les marchés de fin de semaine. L’entreprise voulait vendre en ligne aux clients des deux côtés de la rivière, sans embaucher quelqu’un pour gérer une boutique.",
            "La boutique devait fonctionner aussi bien en français qu’en anglais, simplifier les abonnements et rester facile à mettre à jour par les propriétaires."],
      built=["<strong>Boutique bilingue (FR/EN)</strong> : produits, paiement, courriels et politiques traduits",
             "<strong>Abonnements au café</strong> : aux 2 ou 4 semaines, 10 % de rabais, et les clients peuvent mettre une livraison en pause ou la sauter",
             "<strong>Paiement accessible</strong> : utilisable au clavier, messages d’erreur clairs, bon contraste",
             "<strong>Cueillette au café</strong> et livraison partout au Canada, taxes configurées pour le Québec et l’Ontario",
             "Filtres par torréfaction, origine et mouture",
             "Une formation d’une heure pour que les propriétaires ajoutent eux-mêmes leurs nouveaux cafés"],
      cap=["Navigation avec sélecteur de langue FR/EN et panier", "Titre clair, offre d’abonnement et gros bouton à fort contraste", "Fiches produits aux prix lisibles"])),
  dict(slug="atelier-argile", name="Atelier Argile",
    en=dict(type="Shopify store", client="Ceramics studio, Chelsea", scope="Shop Launch",
      intro="An online shop for handmade ceramics that also sells seats in wheel-throwing classes.",
      goal=["Atelier Argile is a one-person ceramics studio. Pieces sold out at craft fairs, but the studio had no way to sell between events, and class bookings were handled by email.",
            "The owner needed a store that showcased each one-of-a-kind piece and let people book classes and buy gift cards without back-and-forth emails."],
      built=["<strong>Bilingual store (FR/EN)</strong> designed around large, clear product photos",
             "<strong>Class bookings</strong> sold as products with dates and limited seats",
             "<strong>Gift cards</strong> for classes and pieces",
             "<strong>Accessible product pages</strong>: descriptive image text, sizes and care instructions in plain language",
             "Automatic “sold out” handling for one-of-a-kind pieces",
             "Local pickup at the studio and shipping with fragile-item packaging fees"],
      cap=["Simple navigation separating the shop from classes", "Hero highlighting the new class offering", "Collection cards with clear names and prices"]),
    fr=dict(type="Boutique Shopify", client="Atelier de céramique, Chelsea", scope="Lancement de boutique",
      intro="Une boutique en ligne de céramiques faites à la main, qui vend aussi des places dans des cours de tournage.",
      goal=["Atelier Argile est un atelier de céramique tenu par une seule personne. Les pièces s’envolaient dans les salons d’artisans, mais l’atelier ne pouvait rien vendre entre les événements, et les inscriptions aux cours se faisaient par courriel.",
            "La propriétaire avait besoin d’une boutique qui met en valeur chaque pièce unique et qui permet de réserver un cours ou d’acheter une carte-cadeau sans échanger des courriels."],
      built=["<strong>Boutique bilingue (FR/EN)</strong> conçue autour de grandes photos claires",
             "<strong>Réservation de cours</strong> vendus comme produits, avec dates et places limitées",
             "<strong>Cartes-cadeaux</strong> pour les cours et les pièces",
             "<strong>Pages produits accessibles</strong> : texte descriptif des images, dimensions et entretien en langage clair",
             "Gestion automatique des pièces uniques vendues",
             "Cueillette à l’atelier et livraison avec frais d’emballage pour objets fragiles"],
      cap=["Navigation simple qui sépare la boutique et les cours", "Bannière qui met de l’avant les nouveaux cours", "Fiches de collection aux noms et prix clairs"])),
  dict(slug="physio-riviere", name="Physio Rivière",
    en=dict(type="Brand site", client="Physiotherapy clinic, Ottawa", scope="Brand Site",
      intro="A clear, accessible bilingual site for a physiotherapy clinic, built to turn searches into booked appointments.",
      goal=["Physio Rivière’s old site was English-only, hard to use on phones, and didn’t show up well in local searches. Many patients have limited mobility or low vision, so accessibility mattered.",
            "The clinic wanted patients to find it on Google, understand its services and book an assessment in a few taps."],
      built=["<strong>8-page bilingual site (FR/EN)</strong>: services, team, pricing and direct billing, FAQ and contact",
             "<strong>WCAG 2.2 AA</strong>: large text, strong contrast, works fully with a keyboard and screen reader",
             "<strong>Online booking</strong> button connected to the clinic’s existing booking system",
             "<strong>Google Business Profile</strong> set up with hours, services, photos and both languages",
             "<strong>Basic SEO</strong>: page titles, descriptions and local business information",
             "Contact form that sends requests straight to the front desk"],
      cap=["Header with language toggle and a booking button that’s always visible", "Headline and key facts patients look for first", "Service cards with plain-language names"]),
    fr=dict(type="Site vitrine", client="Clinique de physiothérapie, Ottawa", scope="Site vitrine",
      intro="Un site bilingue, clair et accessible pour une clinique de physiothérapie, conçu pour transformer les recherches en rendez-vous.",
      goal=["L’ancien site de Physio Rivière était en anglais seulement, difficile à utiliser sur un téléphone, et peu visible dans les recherches locales. Beaucoup de patients ont une mobilité réduite ou une basse vision : l’accessibilité était essentielle.",
            "La clinique voulait que les patients la trouvent sur Google, comprennent ses services et réservent une évaluation en quelques clics."],
      built=["<strong>Site bilingue de 8 pages (FR/EN)</strong> : services, équipe, tarifs et facturation directe, FAQ et contact",
             "<strong>WCAG 2.2 AA</strong> : grand texte, fort contraste, entièrement utilisable au clavier et avec un lecteur d’écran",
             "Bouton de <strong>réservation en ligne</strong> relié au système de réservation de la clinique",
             "<strong>Profil d’entreprise Google</strong> configuré : heures, services, photos, dans les deux langues",
             "<strong>Référencement de base</strong> : titres, descriptions et renseignements d’entreprise locale",
             "Formulaire de contact qui envoie les demandes directement à la réception"],
      cap=["En-tête avec sélecteur de langue et bouton de réservation toujours visible", "Titre et informations clés que les patients cherchent en premier", "Fiches de services aux noms clairs"])),
]

T = dict(
  en=dict(lang="en", other="fr", dir="work", other_dir="realisations", home="../index.html", other_home="../fr/index.html",
    other_label="Français", skip="Skip to main content", nav="Main", back="← All projects", work_anchor="#work",
    concept="Concept project", type_l="Type", client_l="Business", scope_l="Package",
    goal_h="The goal", built_h="What I built", shots_h="Screenshots", desk="Desktop view", mob="Mobile view",
    details_h="Details", results_h="Results",
    results="This is a concept project, so there are no client results yet. When I work with real clients, this section will include their testimonial and measurable results, such as more online orders or bookings.",
    demo_h="See the live demo", demo_p="The demo is password-protected. Contact me and I’ll send you the link and password.",
    demo_btn="Request demo access", start="Start a project like this",
    demo_open="Open the live store", figma_btn="View the design in Figma", pw_l="Store password:", next="Next project:",
    newtab=" (opens in a new tab)", footer="Bilingual, accessible websites and Shopify stores for small businesses in Ottawa–Gatineau.",
    title_suffix="Case study | Ian Bédard"),
  fr=dict(lang="fr", other="en", dir="realisations", other_dir="work", home="../index.html", other_home="../../index.html",
    other_label="English", skip="Passer au contenu principal", nav="Principal", back="← Toutes les réalisations", work_anchor="#realisations",
    concept="Projet conceptuel", type_l="Type", client_l="Entreprise", scope_l="Forfait",
    goal_h="L’objectif", built_h="Ce que j’ai réalisé", shots_h="Captures d’écran", desk="Vue ordinateur", mob="Vue mobile",
    details_h="Détails", results_h="Résultats",
    results="Il s’agit d’un projet conceptuel, donc il n’y a pas encore de résultats client. Avec de vrais clients, cette section présentera leur témoignage et des résultats mesurables, comme une hausse des commandes ou des réservations en ligne.",
    demo_h="Voir la démo en ligne", demo_p="La démo est protégée par un mot de passe. Écrivez-moi et je vous enverrai le lien et le mot de passe.",
    demo_btn="Demander l’accès à la démo", start="Démarrer un projet comme celui-ci",
    demo_open="Ouvrir la boutique en ligne", figma_btn="Voir la maquette dans Figma", pw_l="Mot de passe de la boutique :", next="Projet suivant :",
    newtab=" (s’ouvre dans un nouvel onglet)", footer="Sites Web et boutiques Shopify bilingues et accessibles pour les petites entreprises d’Ottawa–Gatineau.",
    title_suffix="Étude de cas | Ian Bédard"),
)

FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%230f5c63'/%3E%3Ctext x='16' y='22' font-family='Georgia' font-size='17' font-weight='700' fill='white' text-anchor='middle'%3EIB%3C/text%3E%3C/svg%3E"


def demo_box(p, t):
    if p.get("demo"):
        figma = (f'\n            <a class="btn btn-secondary" href="{p["figma"]}" target="_blank" rel="noopener">'
                 f'{t["figma_btn"]}<span class="visually-hidden">{t["newtab"]}</span></a>') if p.get("figma") else ""
        return f"""        <div class="demo-box">
          <div>
            <h2>{t['demo_h']}</h2>
            <p>{t['pw_l']} <code>{p['password']}</code></p>
          </div>
          <div class="btn-row">
            <a class="btn btn-secondary" href="{p['demo']}" target="_blank" rel="noopener">{t['demo_open']}<span class="visually-hidden">{t['newtab']}</span></a>{figma}
            <a class="btn btn-primary" href="{t['home']}#contact">{t['start']}</a>
          </div>
        </div>"""
    return f"""        <!-- TODO: when the demo is ready, add demo/password (and figma) to this project in the generator data. -->
        <div class="demo-box">
          <div>
            <h2>{t['demo_h']}</h2>
            <p>{t['demo_p']}</p>
          </div>
          <div class="btn-row">
            <a class="btn btn-secondary" href="{t['home']}#contact">{t['demo_btn']}</a>
            <a class="btn btn-primary" href="{t['home']}#contact">{t['start']}</a>
          </div>
        </div>"""


def page(i, lang):
    p, t, c = P[i], T[lang], P[i][lang]
    nxt = P[(i + 1) % len(P)]
    a = "../" if lang == "en" else "../../"   # path to site root (for assets)
    other_href = (f"../fr/realisations/{p['slug']}.html" if lang == "en" else f"../../work/{p['slug']}.html")
    img = f"{a}assets/img/{p['slug']}"
    goal = "\n".join(f"          <p>{g}</p>" for g in c["goal"])
    built = "\n".join(f"            <li>{b}</li>" for b in c["built"])
    zooms = [Z_NAV, Z_HERO, Z_CARDS]
    details = "\n".join(
        f'          <figure>\n            <div class="zoom"><img src="{img}-desktop.svg" alt="" style="{z}" loading="lazy"></div>\n'
        f'            <figcaption>{cap}</figcaption>\n          </figure>' for z, cap in zip(zooms, c["cap"]))
    return f"""<!doctype html>
<html lang="{t['lang']}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{p['name']}: {t['title_suffix']}</title>
  <meta name="description" content="{c['intro']}">
  <link rel="alternate" hreflang="{t['lang']}" href="{p['slug']}.html">
  <link rel="alternate" hreflang="{t['other']}" href="{other_href}">
  <link rel="icon" href="{FAVICON}">
  <link rel="stylesheet" href="{a}assets/css/style.css">
</head>
<body>
  <a class="skip-link" href="#main">{t['skip']}</a>

  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="{t['home']}">Ian <span>Bédard</span></a>
      <nav class="case-nav" aria-label="{t['nav']}">
        <a href="{t['home']}{t['work_anchor']}">{t['back']}</a>
        <a class="lang-switch" href="{other_href}" lang="{t['other']}" hreflang="{t['other']}">{t['other_label']}</a>
      </nav>
    </div>
  </header>

  <main id="main">
    <section class="case-hero section-alt" aria-labelledby="case-title">
      <div class="container">
        <div class="tags"><span class="tag">{c['type']}</span><span class="tag tag-concept">{t['concept']}</span></div>
        <h1 id="case-title">{p['name']}</h1>
        <p class="lead">{c['intro']}</p>
        <dl class="case-meta">
          <div><dt>{t['type_l']}</dt><dd>{c['type']}</dd></div>
          <div><dt>{t['client_l']}</dt><dd>{c['client']}</dd></div>
          <div><dt>{t['scope_l']}</dt><dd>{c['scope']}</dd></div>
        </dl>
      </div>
    </section>

    <section class="case-body">
      <div class="container">
        <div class="case-section">
          <h2>{t['goal_h']}</h2>
{goal}
        </div>

        <div class="case-section">
          <h2>{t['built_h']}</h2>
          <ul>
{built}
          </ul>
        </div>

        <h2>{t['shots_h']}</h2>
        <div class="shots">
          <figure>
            <img src="{img}-desktop.svg" alt="" width="1200" height="760">
            <figcaption>{t['desk']}</figcaption>
          </figure>
          <figure>
            <img src="{img}-mobile.svg" alt="" width="390" height="800">
            <figcaption>{t['mob']}</figcaption>
          </figure>
        </div>

        <h3>{t['details_h']}</h3>
        <div class="details">
{details}
        </div>

        <div class="case-section">
          <h2>{t['results_h']}</h2>
          <p class="results-placeholder">{t['results']}</p>
        </div>

{demo_box(p, t)}

        <p class="next-project">{t['next']} <a href="{nxt['slug']}.html">{nxt['name']} →</a></p>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">Ian Bédard</div>
          <p>{t['footer']}</p>
        </div>
        <ul aria-label="Contact">
          <li><a href="mailto:YOUR-EMAIL@example.com">YOUR-EMAIL@example.com</a></li>
          <li><a href="https://www.linkedin.com/in/YOUR-LINKEDIN/" target="_blank" rel="noopener">LinkedIn<span class="visually-hidden">{t['newtab']}</span></a></li>
        </ul>
      </div>
      <div class="footer-bottom">© <span id="year">2026</span> Ian Bédard. Ottawa–Gatineau.</div>
    </div>
  </footer>

  <script src="{a}assets/js/main.js"></script>
</body>
</html>
"""


for lang in ("en", "fr"):
    d = os.path.join(ROOT, "work") if lang == "en" else os.path.join(ROOT, "fr", "realisations")
    os.makedirs(d, exist_ok=True)
    for i, p in enumerate(P):
        with open(os.path.join(d, p["slug"] + ".html"), "w", encoding="utf-8", newline="\n") as f:
            f.write(page(i, lang))
print("ok")
