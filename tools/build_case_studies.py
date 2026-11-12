"""Generate the case study pages in both languages.

Usage: python tools/build_case_studies.py
Writes work/<slug>.html (EN) and fr/realisations/<slug>.html (FR).

A project with `shots` uses real screenshots of the live site (assets/img/<slug>/);
otherwise it uses the concept mockups made by tools/build_mockups.py.
"""
import os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")

EMAIL = "ian.bedard@hotmail.com"
LINKEDIN = "https://www.linkedin.com/in/ianbedard/"


# Zoom windows (400x300) on the 1200x716 concept mockups, as left/top percentages.
def zoom(x0, y0):
    return f"left:{-(x0 / 1200) * 300:.1f}%;top:{-(y0 / 1200) * 400:.1f}%"


ZOOMS = [zoom(780, 0), zoom(30, 110), zoom(40, 416)]

P = [
  dict(slug="cafe-brume", name="Café Brume", url="cafe-brume.myshopify.com",
    demo="https://cafe-brume.myshopify.com/", password="cafebrume",
    figma="https://www.figma.com/design/1NcVyYHfctXZY5UNMz49RK",
    shots=dict(full="home-full.jpg", mobile_full="home-mobile-full.jpg",
               details=["product-desktop.jpg", "subscriptions-desktop.jpg", "collection-desktop.jpg"]),
    en=dict(type="Shopify store", client="Coffee roaster, Outaouais", scope="Shop Launch + Subscriptions add-on",
      intro="An online coffee shop for a small-batch roaster, built around subscribe-and-save, with a custom theme designed in Figma.",
      goal=["Café Brume roasts seasonal single origins and house blends in small batches every Tuesday. It needed an online store that felt as calm and considered as its coffee, and that turned one-time buyers into regulars.",
            "The store had to make subscriptions effortless, help new customers pick the right roast, and be usable by everyone, on any device."],
      built=["<b>Subscribe and save 10%</b>, delivered every 2, 3 or 4 weeks, with free shipping. Customers can pause, skip or cancel from their account",
             "<b>Product pages</b> with tasting notes, origin and process, size and grind options, and a subscribe-or-buy-once choice",
             "<b>“Find your roast”</b> paths (light, medium, dark, decaf) for customers who aren’t sure where to start",
             "<b>Brew guides</b> for pour-over, French press and moka pot",
             "<b>Accessibility</b>: built to WCAG 2.2 AA, with an accessibility statement and a way to ask for help",
             "<b>Bilingual touches</b> in the announcement bar and section labels (FR/EN)",
             "<b>Custom theme</b> designed in Figma, then built in Shopify"],
      cap=["Product page: tasting notes, size and grind, and subscribe-and-save", "Subscriptions page: three simple steps", "Collection page with roast filters"]),
    fr=dict(type="Boutique Shopify", client="Torréfacteur, Outaouais", scope="Lancement de boutique + option Abonnements",
      intro="Une boutique de café en ligne pour un torréfacteur artisanal, bâtie autour des abonnements à rabais, avec un thème sur mesure conçu dans Figma.",
      goal=["Café Brume torréfie chaque mardi, en petits lots, des cafés d’origine unique et des mélanges maison. L’entreprise avait besoin d’une boutique en ligne aussi calme et soignée que son café, qui transforme les acheteurs ponctuels en habitués.",
            "La boutique devait simplifier les abonnements, aider les nouveaux clients à choisir la bonne torréfaction et être utilisable par tout le monde, sur tous les appareils."],
      built=["<b>Abonnement avec 10 % de rabais</b>, livré aux 2, 3 ou 4 semaines, livraison gratuite. Les clients peuvent mettre en pause, sauter ou annuler depuis leur compte",
             "<b>Pages produits</b> avec notes de dégustation, origine et procédé, choix de format et de mouture, et option abonnement ou achat unique",
             "Parcours <b>« Trouvez votre torréfaction »</b> (légère, moyenne, foncée, décaféiné) pour ceux qui ne savent pas par où commencer",
             "<b>Guides d’infusion</b> : filtre, piston et cafetière italienne",
             "<b>Accessibilité</b> : conforme aux WCAG 2.2 AA, avec un énoncé d’accessibilité et un moyen de demander de l’aide",
             "<b>Touches bilingues</b> dans la bannière d’annonce et les titres de section (FR/EN)",
             "<b>Thème sur mesure</b> conçu dans Figma, puis bâti dans Shopify"],
      cap=["Page produit : notes de dégustation, format, mouture et abonnement", "Page abonnements : trois étapes simples", "Page de collection avec filtres par torréfaction"])),
  dict(slug="atelier-argile", name="Atelier Argile", url="atelierargile.ca",
    en=dict(type="Shopify store", client="Ceramics studio, Chelsea", scope="Shop Launch",
      intro="An online shop for handmade ceramics that also sells seats in wheel-throwing classes.",
      goal=["Atelier Argile is a one-person ceramics studio. Pieces sold out at craft fairs, but the studio had no way to sell between events, and class bookings were handled by email.",
            "The owner needed a store that showcased each one-of-a-kind piece and let people book classes and buy gift cards without back-and-forth emails."],
      built=["<b>Bilingual store (FR/EN)</b> designed around large, clear product photos",
             "<b>Class bookings</b> sold as products with dates and limited seats",
             "<b>Gift cards</b> for classes and pieces",
             "<b>Accessible product pages</b>: descriptive image text, sizes and care instructions in plain language",
             "Automatic “sold out” handling for one-of-a-kind pieces",
             "Local pickup at the studio and shipping with fragile-item packaging fees"],
      cap=["Simple navigation separating the shop from classes", "Hero highlighting the new class offering", "Collection cards with clear names and prices"]),
    fr=dict(type="Boutique Shopify", client="Atelier de céramique, Chelsea", scope="Lancement de boutique",
      intro="Une boutique en ligne de céramiques faites à la main, qui vend aussi des places dans des cours de tournage.",
      goal=["Atelier Argile est un atelier de céramique tenu par une seule personne. Les pièces s’envolaient dans les salons d’artisans, mais l’atelier ne pouvait rien vendre entre les événements, et les inscriptions aux cours se faisaient par courriel.",
            "La propriétaire avait besoin d’une boutique qui met en valeur chaque pièce unique et qui permet de réserver un cours ou d’acheter une carte-cadeau sans échanger des courriels."],
      built=["<b>Boutique bilingue (FR/EN)</b> conçue autour de grandes photos claires",
             "<b>Réservation de cours</b> vendus comme produits, avec dates et places limitées",
             "<b>Cartes-cadeaux</b> pour les cours et les pièces",
             "<b>Pages produits accessibles</b> : texte descriptif des images, dimensions et entretien en langage clair",
             "Gestion automatique des pièces uniques vendues",
             "Cueillette à l’atelier et livraison avec frais d’emballage pour objets fragiles"],
      cap=["Navigation simple qui sépare la boutique et les cours", "Bannière qui met de l’avant les nouveaux cours", "Fiches de collection aux noms et prix clairs"])),
  dict(slug="physio-riviere", name="Physio Rivière", url="physioriviere.ca",
    en=dict(type="Brand site", client="Physiotherapy clinic, Ottawa", scope="Brand Site",
      intro="A clear, accessible bilingual site for a physiotherapy clinic, built to turn searches into booked appointments.",
      goal=["Physio Rivière’s old site was English-only, hard to use on phones, and didn’t show up well in local searches. Many patients have limited mobility or low vision, so accessibility mattered.",
            "The clinic wanted patients to find it on Google, understand its services and book an assessment in a few taps."],
      built=["<b>8-page bilingual site (FR/EN)</b>: services, team, pricing and direct billing, FAQ and contact",
             "<b>WCAG 2.2 AA</b>: large text, strong contrast, works fully with a keyboard and screen reader",
             "<b>Online booking</b> button connected to the clinic’s existing booking system",
             "<b>Google Business Profile</b> set up with hours, services, photos and both languages",
             "<b>Basic SEO</b>: page titles, descriptions and local business information",
             "Contact form that sends requests straight to the front desk"],
      cap=["Header with language toggle and a booking button that’s always visible", "Headline and key facts patients look for first", "Service cards with plain-language names"]),
    fr=dict(type="Site vitrine", client="Clinique de physiothérapie, Ottawa", scope="Site vitrine",
      intro="Un site bilingue, clair et accessible pour une clinique de physiothérapie, conçu pour transformer les recherches en rendez-vous.",
      goal=["L’ancien site de Physio Rivière était en anglais seulement, difficile à utiliser sur un téléphone, et peu visible dans les recherches locales. Beaucoup de patients ont une mobilité réduite ou une basse vision : l’accessibilité était essentielle.",
            "La clinique voulait que les patients la trouvent sur Google, comprennent ses services et réservent une évaluation en quelques clics."],
      built=["<b>Site bilingue de 8 pages (FR/EN)</b> : services, équipe, tarifs et facturation directe, FAQ et contact",
             "<b>WCAG 2.2 AA</b> : grand texte, fort contraste, entièrement utilisable au clavier et avec un lecteur d’écran",
             "Bouton de <b>réservation en ligne</b> relié au système de réservation de la clinique",
             "<b>Profil d’entreprise Google</b> configuré : heures, services, photos, dans les deux langues",
             "<b>Référencement de base</b> : titres, descriptions et renseignements d’entreprise locale",
             "Formulaire de contact qui envoie les demandes directement à la réception"],
      cap=["En-tête avec sélecteur de langue et bouton de réservation toujours visible", "Titre et informations clés que les patients cherchent en premier", "Fiches de services aux noms clairs"])),
]

T = dict(
  en=dict(lang="en", other="fr", home="../index.html", work_anchor="#work", nav="Main",
    other_label="FR", skip="Skip to main content", crumbs_home="home", crumbs_work="work",
    concept="Concept project", live="Live demo", type_l="type", client_l="business", scope_l="package",
    explore_h="Explore the live store", explore_p="This is the real site, captured from the live demo. Scroll inside the frames to browse it.",
    scroll_hint="↕ scroll inside the frame", desk="Desktop", mob="Mobile",
    shots_h="Screenshots", shots_p="Desktop and mobile views of the concept design.",
    goal_h="The goal", built_h="What I built", details_h="Details",
    results_h="Results",
    results="This is a concept project, so there are no client results yet. When I work with real clients, this section will include their testimonial and measurable results, such as more online orders or bookings.",
    demo_open="Open the live store", figma_btn="View the design in Figma", pw_l="Store password",
    demo_h="Want to see it live?", demo_p="The demo is password-protected. Contact me and I’ll send you the link and password.",
    demo_btn="Request demo access",
    cta_h="Want a store like this?", cta_p="Founding-client pricing is open now. I reply within 1 business day.",
    start="Start a project like this", next="Next project",
    newtab=" (opens in a new tab)", scroll_label="scrollable preview",
    footer="Bilingual, accessible websites and Shopify stores<br>for small businesses in Ottawa–Gatineau.",
    title_suffix="Case study | Ian Bédard"),
  fr=dict(lang="fr", other="en", home="../index.html", work_anchor="#realisations", nav="Principal",
    other_label="EN", skip="Passer au contenu principal", crumbs_home="accueil", crumbs_work="réalisations",
    concept="Projet conceptuel", live="Démo en ligne", type_l="type", client_l="entreprise", scope_l="forfait",
    explore_h="Explorez la boutique en ligne", explore_p="Voici le vrai site, capturé à partir de la démo en ligne. Faites défiler l’intérieur des cadres pour le parcourir.",
    scroll_hint="↕ faites défiler dans le cadre", desk="Ordinateur", mob="Mobile",
    shots_h="Captures d’écran", shots_p="Vues ordinateur et mobile de la maquette conceptuelle.",
    goal_h="L’objectif", built_h="Ce que j’ai réalisé", details_h="Détails",
    results_h="Résultats",
    results="Il s’agit d’un projet conceptuel, donc il n’y a pas encore de résultats client. Avec de vrais clients, cette section présentera leur témoignage et des résultats mesurables, comme une hausse des commandes ou des réservations en ligne.",
    demo_open="Ouvrir la boutique en ligne", figma_btn="Voir la maquette dans Figma", pw_l="Mot de passe de la boutique",
    demo_h="Envie de la voir en ligne?", demo_p="La démo est protégée par un mot de passe. Écrivez-moi et je vous enverrai le lien et le mot de passe.",
    demo_btn="Demander l’accès à la démo",
    cta_h="Une boutique comme celle-ci?", cta_p="Les prix « premiers clients » sont offerts dès maintenant. Je réponds en moins d’un jour ouvrable.",
    start="Démarrer un projet comme celui-ci", next="Projet suivant",
    newtab=" (s’ouvre dans un nouvel onglet)", scroll_label="aperçu défilant",
    footer="Sites Web et boutiques Shopify bilingues et accessibles<br>pour les petites entreprises d’Ottawa–Gatineau.",
    title_suffix="Étude de cas | Ian Bédard"),
)

FAVICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E"
           "%3Cstop offset='0' stop-color='%2310b981'/%3E%3Cstop offset='1' stop-color='%236d28d9'/%3E%3C/linearGradient%3E%3C/defs%3E"
           "%3Crect width='32' height='32' rx='9' fill='url(%23g)'/%3E%3Ctext x='16' y='21.5' font-family='Arial' font-size='14' font-weight='800' fill='white' text-anchor='middle'%3EIB%3C/text%3E%3C/svg%3E")


def ext(href, label, t, cls="btn btn-outline"):
    return (f'<a class="{cls}" href="{href}" target="_blank" rel="noopener">{label}'
            f'<span class="visually-hidden">{t["newtab"]}</span></a>')


def browser(url, inner, dark=False):
    return (f'<div class="mockup-browser{" dark" if dark else ""}">'
            f'<div class="toolbar"><span class="url">{url}</span></div>{inner}</div>')


def hero(p, t, c):
    badges = f'<span class="badge">{c["type"]}</span>'
    if p.get("demo"):
        badges += f'<span class="badge badge-live">{t["live"]}</span>'
    badges += f'<span class="badge">{t["concept"]}</span>'
    if p.get("demo"):
        actions = ext(p["demo"], t["demo_open"], t, "btn btn-primary")
        if p.get("figma"):
            actions += "\n            " + ext(p["figma"], t["figma_btn"], t)
        actions += f'\n          </div>\n          <p class="demo-pass">{t["pw_l"]}: <code>{p["password"]}</code></p>'
    else:
        actions = (f'<a class="btn btn-primary" href="{t["home"]}#contact">{t["demo_btn"]}</a>\n'
                   f'          </div>\n          <p class="demo-pass">{t["demo_p"]}</p>')
    return f"""    <section class="case-hero deep glow grid-lines" aria-labelledby="case-title">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <a href="{t['home']}">{t['crumbs_home']}</a> / <a href="{t['home']}{t['work_anchor']}">{t['crumbs_work']}</a> / <span aria-current="page">{p['slug']}</span>
        </nav>
        <div class="badges">{badges}</div>
        <h1 id="case-title">{p['name']}</h1>
        <p class="lead">{c['intro']}</p>
        <dl class="case-meta">
          <div><dt>{t['type_l']}</dt><dd>{c['type']}</dd></div>
          <div><dt>{t['client_l']}</dt><dd>{c['client']}</dd></div>
          <div><dt>{t['scope_l']}</dt><dd>{c['scope']}</dd></div>
        </dl>
        <div class="btn-row">
          {actions}
      </div>
    </section>"""


def showcase(p, t, a):
    if p.get("shots"):
        img = f"{a}assets/img/{p['slug']}/"
        s = p["shots"]
        desk = browser(p["url"], f'<div class="screen scroll" tabindex="0" role="region" aria-label="{p["name"]}: {t["desk"]}, {t["scroll_label"]}">'
                                 f'<img src="{img}{s["full"]}" alt="" width="2880" loading="lazy"></div>')
        phone = (f'<div class="mockup-phone"><div class="screen scroll" tabindex="0" role="region" aria-label="{p["name"]}: {t["mob"]}, {t["scroll_label"]}">'
                 f'<img src="{img}{s["mobile_full"]}" alt="" width="780" loading="lazy"></div></div>')
        head, sub, hint = t["explore_h"], t["explore_p"], f'<p class="scroll-hint" aria-hidden="true">{t["scroll_hint"]}</p>'
    else:
        img = f"{a}assets/img/{p['slug']}"
        desk = browser(p["url"], f'<div class="screen"><img src="{img}-desktop.svg" alt="" width="1200" height="716"></div>')
        phone = f'<div class="mockup-phone"><div class="screen"><img src="{img}-mobile.svg" alt="" width="366" height="776"></div></div>'
        head, sub, hint = t["shots_h"], t["shots_p"], ""
    return f"""    <section class="bg-base-200 section-tight" aria-labelledby="explore-title">
      <div class="container">
        <div class="section-head">
          <h2 id="explore-title">{head}</h2>
          <p>{sub}</p>
        </div>
        <div class="showcase">
          <figure>
            {desk}
            <figcaption>{t['desk']}</figcaption>
          </figure>
          <figure class="phone-col">
            {phone}
            <figcaption>{t['mob']}</figcaption>
          </figure>
        </div>
        {hint}
      </div>
    </section>"""


def details(p, t, c, a):
    figs = []
    if p.get("shots"):
        for f, cap in zip(p["shots"]["details"], c["cap"]):
            inner = f'<div class="screen"><img src="{a}assets/img/{p["slug"]}/{f}" alt="" width="2880" height="1800" loading="lazy"></div>'
            figs.append(f'<figure>{browser(p["url"], inner)}<figcaption>{cap}</figcaption></figure>')
    else:
        for z, cap in zip(ZOOMS, c["cap"]):
            inner = f'<div class="zoom"><img src="{a}assets/img/{p["slug"]}-desktop.svg" alt="" style="{z}" loading="lazy"></div>'
            figs.append(f'<figure>{browser(p["url"], inner)}<figcaption>{cap}</figcaption></figure>')
    return "\n          ".join(figs)


def page(i, lang):
    p, t, c = P[i], T[lang], P[i][lang]
    nxt = P[(i + 1) % len(P)]
    a = "../" if lang == "en" else "../../"
    other_href = f"../fr/realisations/{p['slug']}.html" if lang == "en" else f"../../work/{p['slug']}.html"
    goal = "\n".join(f"              <p>{g}</p>" for g in c["goal"])
    built = "\n".join(f"                <li><span>{b}</span></li>" for b in c["built"])
    cta_btns = f'<a class="btn btn-primary" href="{t["home"]}#contact">{t["start"]}</a>'
    if p.get("demo"):
        cta_btns += "\n            " + ext(p["demo"], t["demo_open"], t)
    return f"""<!doctype html>
<html lang="{t['lang']}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{p['name']}: {t['title_suffix']}</title>
  <meta name="description" content="{c['intro']}">
  <meta name="theme-color" content="#070b14">
  <link rel="alternate" hreflang="{t['lang']}" href="{p['slug']}.html">
  <link rel="alternate" hreflang="{t['other']}" href="{other_href}">
  <link rel="icon" href="{FAVICON}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap">
  <link rel="stylesheet" href="{a}assets/css/style.css">
</head>
<body>
  <a class="skip-link" href="#main">{t['skip']}</a>

  <header class="navbar">
    <div class="container navbar-inner">
      <a class="logo" href="{t['home']}"><span class="logo-mark" aria-hidden="true">IB</span>Ian Bédard</a>
      <nav class="site-nav case-nav" aria-label="{t['nav']}">
        <ul>
          <li><a class="lang-switch" href="{other_href}" lang="{t['other']}" hreflang="{t['other']}">{t['other_label']}</a></li>
          <li><a class="nav-cta" href="{t['home']}#contact">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main id="main">
{hero(p, t, c)}

{showcase(p, t, a)}

    <section class="section-tight">
      <div class="container">
        <div class="split">
          <div class="card"><div class="card-body">
            <span class="eyebrow">01</span>
            <h2>{t['goal_h']}</h2>
{goal}
          </div></div>
          <div class="card"><div class="card-body">
            <span class="eyebrow">02</span>
            <h2>{t['built_h']}</h2>
            <ul class="feature-list">
{built}
            </ul>
          </div></div>
        </div>
      </div>
    </section>

    <section class="bg-base-200 section-tight" aria-labelledby="details-title">
      <div class="container">
        <div class="section-head"><h2 id="details-title">{t['details_h']}</h2></div>
        <div class="shots">
          {details(p, t, c, a)}
        </div>
      </div>
    </section>

    <section class="section-tight" aria-labelledby="results-title">
      <div class="container">
        <div class="section-head"><h2 id="results-title">{t['results_h']}</h2></div>
        <p class="results-placeholder">{t['results']}</p>

        <div class="cta-box deep glow">
          <div>
            <h2>{t['cta_h']}</h2>
            <p>{t['cta_p']}</p>
          </div>
          <div class="btn-row">
            {cta_btns}
          </div>
        </div>

        <p class="next-project"><a href="{nxt['slug']}.html">{t['next']}: {nxt['name']} →</a></p>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <a class="logo" href="{t['home']}"><span class="logo-mark" aria-hidden="true">IB</span>Ian Bédard</a>
          <p>{t['footer']}</p>
        </div>
        <div>
          <div class="footer-title">contact</div>
          <ul>
            <li><a href="mailto:{EMAIL}">{EMAIL}</a></li>
            <li><a href="{LINKEDIN}" target="_blank" rel="noopener">LinkedIn<span class="visually-hidden">{t['newtab']}</span></a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom"><span>© <span id="year">2026</span> Ian Bédard</span><span>Ottawa–Gatineau</span></div>
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
