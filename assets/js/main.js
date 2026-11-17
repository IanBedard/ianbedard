// Ian Bédard — small progressive enhancements. The site works without JS.
(function () {
  var fr = document.documentElement.lang === "fr";

  // Mobile navigation toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && window.matchMedia("(max-width: 900px)").matches) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        toggle.focus();
      }
    });
  }

  // Pre-select the package in the contact form when a pricing card button is clicked
  document.querySelectorAll("[data-package]").forEach(function (link) {
    link.addEventListener("click", function () {
      var select = document.getElementById("package");
      if (select) select.value = link.getAttribute("data-package");
    });
  });

  // Contact form: submit to Formspree without leaving the page
  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("form-status");
    var loadedAt = Date.now();
    var thanks = fr
      ? "Merci! Je vous réponds d’ici un jour ouvrable."
      : "Thanks! I’ll reply within 1 business day.";
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // Bots submit instantly or fill the hidden honeypot: pretend it worked and send nothing
      if (Date.now() - loadedAt < 3000 || form.elements._gotcha.value) {
        form.reset();
        status.className = "form-status ok";
        status.textContent = thanks;
        return;
      }
      if (form.action.indexOf("YOUR_FORM_ID") !== -1) {
        status.className = "form-status err";
        status.textContent = fr
          ? "Le formulaire n’est pas encore configuré. Écrivez-moi directement par courriel."
          : "The form isn’t set up yet. Please email me directly.";
        return;
      }
      var button = form.querySelector("button[type=submit]");
      button.disabled = true;
      status.className = "form-status";
      status.textContent = fr ? "Envoi en cours…" : "Sending…";
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (!res.ok) throw new Error(res.status);
          form.reset();
          status.className = "form-status ok";
          status.textContent = thanks;
        })
        .catch(function () {
          status.className = "form-status err";
          status.textContent = fr
            ? "Oups, l’envoi a échoué. Réessayez ou écrivez-moi par courriel."
            : "Sorry, something went wrong. Try again or email me directly.";
        })
        .finally(function () { button.disabled = false; });
    });
  }

  // Fade sections up as they scroll into view (skipped for reduced motion; content is visible without JS)
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("js-reveal");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  // Scrollable demo frames stay locked until clicked, so scrolling the page over them doesn't scroll the demo
  document.querySelectorAll(".screen.scroll").forEach(function (frame) {
    var box = frame.parentNode;
    var hint = document.createElement("span");
    hint.className = "frame-hint";
    hint.setAttribute("aria-hidden", "true");
    hint.innerHTML = '<span class="frame-hint-inner"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M9 9l5 12 1.8-5.2L21 14 9 9z"/><path d="M7.2 2.2L8 5.1M5.1 8l-2.9-.8M14 4.1l-2.1 2.1M6.2 11.9l-2.1 2.1"/></svg>' +
      "<span>" + (fr ? "Cliquez pour parcourir" : "Click to scroll") + "</span></span>";
    box.appendChild(hint);
    var lock = function () { frame.classList.add("is-locked"); box.classList.remove("is-active"); };
    var unlock = function () { frame.classList.remove("is-locked"); box.classList.add("is-active"); };
    lock();
    box.addEventListener("click", function () { if (!box.classList.contains("is-active")) { unlock(); frame.focus({ preventScroll: true }); } });
    frame.addEventListener("focus", unlock);
    frame.addEventListener("blur", lock);
    box.addEventListener("mouseleave", function () { lock(); frame.blur(); });
    frame.addEventListener("keydown", function (e) { if (e.key === "Escape") lock(); });
  });

  // Scroll-driven scenes: the pinned philosophy sequence and the steps slider.
  // Skipped entirely for reduced motion; without JS the philosophy section stays hidden and the steps show as a list.
  var philo = document.querySelector(".philo");
  if ((philo || document.querySelector(".steps")) && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
    var range = function (p, a, b) { return clamp((p - a) / (b - a)); };
    var ease = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

    var stage, pieces, dark, rule, closing, closingWords, from = [], to = [];
    if (philo) {
      document.documentElement.classList.add("js-philo");
      stage = philo.querySelector(".philo-stage");
      pieces = philo.querySelectorAll(".philo-a span");
      dark = philo.querySelector(".philo-dark");
      rule = philo.querySelector(".philo-rule");
      closing = philo.querySelector(".philo-c");
      // Split the closing line into words so they can darken one after another
      closingWords = closing.textContent.trim().split(/\s+/);
      closing.innerHTML = closingWords.map(function (w) { return "<span>" + w + "</span>"; }).join(" ");
      closingWords = closing.querySelectorAll("span");

      // Start: the lead phrase at the first column, the other words at the last three columns.
      // End: one sentence, centred (on two lines if it doesn't fit).
      var layout = function () {
        var cols = philo.querySelectorAll(".philo-lines span");
        var sw = stage.offsetWidth, pad = 10;
        var space = parseFloat(getComputedStyle(pieces[0]).fontSize) * .26;
        var widths = Array.prototype.map.call(pieces, function (el) { return el.offsetWidth; });
        var total = widths.reduce(function (a, b) { return a + b; }) + space * (widths.length - 1);
        var lh = pieces[0].offsetHeight;
        var oneLine = total < sw - 2 * cols[0].offsetLeft;
        var narrow = sw < 640;
        var rest = total - widths[0] - space;
        var x = oneLine ? (sw - total) / 2 : (sw - rest) / 2;
        Array.prototype.forEach.call(pieces, function (el, i) {
          // Narrow screens: lead phrase on its own row, the other words on alternate columns below
          from[i] = narrow
            ? { x: cols[i === 0 ? 0 : (i - 1) * 2].offsetLeft + pad, y: i === 0 ? -lh * .8 : lh * .8 }
            : { x: i === 0 ? cols[0].offsetLeft + pad : cols[cols.length - 4 + i].offsetLeft + pad, y: 0 };
          if (i === 0 && !oneLine) {
            to[i] = { x: (sw - widths[0]) / 2, y: -lh / 2 };
          } else {
            to[i] = { x: x, y: oneLine ? 0 : lh / 2 };
            x += widths[i] + space;
          }
        });
      };
      layout();
      window.addEventListener("resize", layout);
      // Re-measure once the web font has loaded, since word widths change
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { layout(); onScroll(); });
    }

    // Steps slider: built from the real step list, which stays in the page for screen readers
    var stepList = document.querySelector(".steps");
    var pin, stepTitles, stepDescs, stepLayers, stepCount, stepSpacing = 0;
    if (stepList) {
      var items = stepList.querySelectorAll("li");
      var pad2 = function (n) { return (n < 10 ? "0" : "") + n; };
      var titles = "", descs = "", layers = "";
      Array.prototype.forEach.call(items, function (li, i) {
        titles += "<span>" + li.querySelector("h3").textContent + "</span>";
        descs += "<p>" + li.querySelector("p").textContent + "</p>";
        layers += '<div class="steps-layer"><span class="caption">' + li.querySelector("h3").textContent + "</span><b>" + pad2(i + 1) + "</b></div>";
      });
      pin = document.createElement("div");
      pin.className = "steps-pin";
      pin.setAttribute("aria-hidden", "true");
      pin.style.height = (items.length * 70 + 100) + "vh";
      pin.innerHTML = '<div class="steps-stage"><div class="steps-titles">' + titles + "</div>" +
        '<div class="steps-desc">' + descs + '</div><div class="steps-card">' + layers + "</div>" +
        '<div class="steps-count caption"><span>01</span> / ' + pad2(items.length) + "</div></div>";
      stepList.parentNode.insertBefore(pin, stepList.nextSibling);
      document.documentElement.classList.add("js-steps");
      stepTitles = pin.querySelectorAll(".steps-titles span");
      stepDescs = pin.querySelectorAll(".steps-desc p");
      stepLayers = pin.querySelectorAll(".steps-layer");
      stepCount = pin.querySelector(".steps-count span");
      var measure = function () {
        var widest = 0;
        Array.prototype.forEach.call(stepTitles, function (el) { widest = Math.max(widest, el.offsetWidth); });
        stepSpacing = Math.max(widest, pin.querySelector(".steps-card").offsetWidth) + 56;
      };
      measure();
      window.addEventListener("resize", measure);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); onScroll(); });
    }

    var ticking = false;
    var update = function () {
      ticking = false;
      var vh = window.innerHeight;

      if (philo) {
        var r = philo.getBoundingClientRect();
        var p = clamp(-r.top / (r.height - stage.offsetHeight));
        // 1. The words slide together into one sentence
        var k = ease(range(p, .1, .32));
        Array.prototype.forEach.call(pieces, function (el, i) {
          var x = from[i].x + (to[i].x - from[i].x) * k, y = from[i].y + (to[i].y - from[i].y) * k;
          el.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px) translateY(-50%)";
          el.style.visibility = p < .47 ? "visible" : "hidden";
        });
        // 2. Black opens from the centre line, then 3. squeezes back into a line and disappears
        var inset = 50 * (1 - ease(range(p, .34, .46))) + 50 * ease(range(p, .58, .7));
        dark.style.clipPath = "inset(" + inset.toFixed(2) + "% 0)";
        dark.firstElementChild.style.opacity = range(p, .42, .48).toFixed(3);
        rule.style.opacity = (range(p, .66, .7) * (1 - range(p, .72, .78))).toFixed(3);
        rule.style.transform = "scaleX(" + (1 - .6 * range(p, .72, .78)).toFixed(3) + ")";
        // 4. The closing line fades in word by word, grey to black
        closing.style.opacity = range(p, .74, .78).toFixed(3);
        var n = closingWords.length;
        Array.prototype.forEach.call(closingWords, function (el, i) {
          var a = .76 + .18 * i / n;
          el.style.opacity = (.16 + .84 * range(p, a, a + .06)).toFixed(3);
        });
      }

      if (pin) {
        var pr = pin.getBoundingClientRect();
        var sp = clamp(-pr.top / (pr.height - pin.firstChild.offsetHeight));
        // Hold on each step, then move to the next one
        var raw = sp * (stepTitles.length - 1), idx = Math.min(Math.floor(raw), stepTitles.length - 2);
        var f = idx + ease(range(raw - idx, .2, .8));
        Array.prototype.forEach.call(stepTitles, function (el, k) {
          var d = k - f;
          el.style.transform = "translateX(" + (d * stepSpacing).toFixed(1) + "px)";
          el.style.opacity = (1 - Math.min(1, Math.abs(d)) * .74).toFixed(3);
        });
        Array.prototype.forEach.call(stepDescs, function (el, k) {
          var d = k - f;
          el.style.opacity = Math.max(0, 1 - Math.abs(d) * 2.2).toFixed(3);
          el.style.transform = "translateY(" + (d * 14).toFixed(1) + "px)";
        });
        // Each new card wipes in from the right over the previous one
        Array.prototype.forEach.call(stepLayers, function (el, k) {
          if (k) el.style.clipPath = "inset(0 0 0 " + ((1 - clamp(f - k + 1)) * 100).toFixed(2) + "%)";
        });
        var cur = pad2(Math.round(f) + 1);
        if (stepCount.textContent !== cur) stepCount.textContent = cur;
      }
    };
    var onScroll = function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Home and About intros: white wavy lines, like the logo, drifting slowly behind the heading.
  // Faint on the left where the text sits, brighter to the right; one still frame for reduced motion.
  var hero = document.querySelector(".hero, .about-hero");
  if (hero) {
    var waves = document.createElement("canvas");
    waves.className = "hero-waves";
    waves.setAttribute("aria-hidden", "true");
    hero.insertBefore(waves, hero.firstChild);
    var wctx = waves.getContext("2d");
    var LINES = 14, ww, wh, wavesLive = true;
    // Mouse hover: the lines part around the pointer, easing in on enter and settling back on leave
    var hx = 0, hy = 0, hxTarget = 0, hyTarget = 0, push = 0, pushTarget = 0;
    hero.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      var box = hero.getBoundingClientRect();
      hxTarget = e.clientX - box.left; hyTarget = e.clientY - box.top;
      if (!pushTarget) { hx = hxTarget; hy = hyTarget; }
      pushTarget = 1;
    });
    hero.addEventListener("pointerleave", function () { pushTarget = 0; });
    var sizeWaves = function () {
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      ww = hero.offsetWidth; wh = hero.offsetHeight;
      waves.width = Math.round(ww * ratio); waves.height = Math.round(wh * ratio);
      wctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    var drawWaves = function (ms) {
      var t = (ms || 0) / 1000, amp = Math.min(wh * .045, 36), k = Math.PI * 2 / Math.max(ww, 600);
      var fade = wctx.createLinearGradient(0, 0, ww, 0);
      fade.addColorStop(0, "rgba(240, 240, 240, .04)");
      fade.addColorStop(.55, "rgba(240, 240, 240, .14)");
      fade.addColorStop(1, "rgba(240, 240, 240, .3)");
      // One line in the accent colour, rgb(255, 25, 100)
      var accent = wctx.createLinearGradient(0, 0, ww, 0);
      accent.addColorStop(0, "rgba(255, 25, 100, .1)");
      accent.addColorStop(.55, "rgba(255, 25, 100, .4)");
      accent.addColorStop(1, "rgba(255, 25, 100, .75)");
      hx += (hxTarget - hx) * .12; hy += (hyTarget - hy) * .12;
      push += (pushTarget - push) * .06;
      var reach = Math.min(ww * .12, 150), lift = Math.min(wh * .06, 44);
      wctx.clearRect(0, 0, ww, wh);
      wctx.lineWidth = 1.25;
      wctx.lineCap = "round";
      for (var i = 0; i < LINES; i++) {
        var base = wh * (.08 + .86 * i / (LINES - 1));
        wctx.strokeStyle = i === LINES - 4 ? accent : fade;
        wctx.beginPath();
        for (var x = 0; x <= ww + 8; x += 8) {
          // Two slow waves travelling in opposite directions; neighbouring lines are slightly out of phase
          var y = base + amp * (.65 * Math.sin(x * k * 1.1 + t * .35 + i * .32) + .35 * Math.sin(x * k * 2.3 - t * .22 + i * .55));
          if (push > .001) {
            // Bend away from the pointer: strongest right under it, fading out sideways and between lines
            var dx = (x - hx) / reach, dy = (y - hy) / (reach * .8);
            y += (dy < 0 ? -1 : 1) * lift * push * Math.exp(-dx * dx - dy * dy) * Math.min(1, Math.abs(dy) * 4 + .15);
          }
          if (x) wctx.lineTo(x, y); else wctx.moveTo(x, y);
        }
        wctx.stroke();
      }
    };
    var loopWaves = function (ms) {
      drawWaves(ms);
      if (wavesLive) requestAnimationFrame(loopWaves);
    };
    sizeWaves();
    window.addEventListener("resize", function () { sizeWaves(); drawWaves(performance.now()); });
    if (reduceMotion) drawWaves(0);
    else {
      requestAnimationFrame(loopWaves);
      // Only animate while the intro is on screen
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          var was = wavesLive;
          wavesLive = entries[0].isIntersecting;
          if (wavesLive && !was) requestAnimationFrame(loopWaves);
        }).observe(hero);
      }
    }
  }

  // Home intro: a voxel maple leaf turning slowly on the right, in the accent colour.
  // The outline comes from the leaf on the flag of Canada, two cubes thick. It leans towards the pointer,
  // and the cubes near the cursor are pushed aside. One still frame for reduced motion. Home page only.
  if (hero && hero.classList.contains("hero")) {
    var LEAF = [
      ".............#", ".............#", "............###", "............###",
      "........#..#####..#", "........###########", "........###########", "........###########",
      ".........#########", ".....#...#########...#", "#...###..#########..###...#", "########.#########.########",
      "###########################", ".#########################", ".#########################", "###########################",
      "###########################", ".#########################", "..#######################", "....###################",
      ".....#################", "......###############", ".......#############", "......###############",
      "......#......#......#", ".............#", ".............#", ".............#",
      ".............#", ".............#", ".............#"
    ];
    var leaf = document.createElement("canvas");
    leaf.className = "hero-leaf";
    leaf.setAttribute("aria-hidden", "true");
    hero.insertBefore(leaf, waves.nextSibling);
    var lctx = leaf.getContext("2d");

    // Six face directions; each cube keeps only the faces that touch empty space
    var DIRS = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
    var filled = function (c, r) { return !!(LEAF[r] && LEAF[r].charAt(c) === "#"); };
    var voxels = [];
    LEAF.forEach(function (row, r) {
      for (var c = 0; c < row.length; c++) {
        if (row.charAt(c) !== "#") continue;
        for (var z = 0; z < 2; z++) {
          var faces = [];
          DIRS.forEach(function (d, f) {
            var hidden = d[2] ? (z + d[2] === 0 || z + d[2] === 1) : filled(c + d[0], r + d[1]);
            if (!hidden) faces.push(f);
          });
          voxels.push({ x: c - 13, y: r - 15, z: z - .5, faces: faces });
        }
      }
    });

    var lw, lh, unit, lcx, lcy, leafLive = true;
    var lmx = .5, lmy = .5, lmxT = .5, lmyT = .5, lpx = 0, lpy = 0, lpxT = 0, lpyT = 0, scatter = 0, scatterT = 0;
    var LIGHT = [-.35, -.55, .76];
    var sizeLeaf = function () {
      var ratio = Math.min(window.devicePixelRatio || 1, 2), narrow = hero.offsetWidth < 860;
      lw = hero.offsetWidth; lh = hero.offsetHeight;
      leaf.width = Math.round(lw * ratio); leaf.height = Math.round(lh * ratio);
      lctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      unit = Math.min(lh * .476, lw * (narrow ? .64 : .255)) / 31;
      lcx = lw * (narrow ? .5 : .8); lcy = lh * (narrow ? .47 : .42);
    };
    hero.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      var box = hero.getBoundingClientRect();
      lpxT = e.clientX - box.left; lpyT = e.clientY - box.top;
      if (!scatterT) { lpx = lpxT; lpy = lpyT; }
      lmxT = lpxT / lw; lmyT = lpyT / lh; scatterT = 1;
    });
    hero.addEventListener("pointerleave", function () { lmxT = lmyT = .5; scatterT = 0; });

    var drawLeaf = function (ms) {
      var t = (ms || 0) / 1000;
      lmx += (lmxT - lmx) * .05; lmy += (lmyT - lmy) * .05;
      lpx += (lpxT - lpx) * .15; lpy += (lpyT - lpy) * .15;
      scatter += (scatterT - scatter) * .07;
      // Turn slowly about the vertical axis; the pointer adds yaw and pitch
      var yaw = t * .35 + (lmx - .5) * 1.4, pitch = .15 - (lmy - .5) * 1.1;
      var cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      var rot = function (v) {
        var x = v[0] * cyw + v[2] * syw, z = -v[0] * syw + v[2] * cyw;
        return [x, v[1] * cp - z * sp, v[1] * sp + z * cp];
      };
      var axes = [rot([1, 0, 0]), rot([0, 1, 0]), rot([0, 0, 1])];
      // Per face direction: its normal on screen, whether it faces us, and its shade
      var looks = DIRS.map(function (d, f) {
        var a = axes[f >> 1], s = d[0] + d[1] + d[2];
        var n = [a[0] * s, a[1] * s, a[2] * s];
        var light = Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]);
        var k = .38 + .62 * light;
        return { n: n, show: n[2] > .01, u: axes[(f >> 1) === 0 ? 1 : 0], v: axes[(f >> 1) === 2 ? 1 : 2],
          fill: "rgb(" + Math.round(255 * k) + "," + Math.round(25 * k) + "," + Math.round(100 * k) + ")" };
      });
      var bob = Math.sin(t * .8) * unit * .8, h = unit / 2, reach = unit * 7;
      voxels.forEach(function (p) {
        p.depth = p.x * axes[0][2] + p.y * axes[1][2] + p.z * axes[2][2];
        var sx = lcx + (p.x * axes[0][0] + p.y * axes[1][0] + p.z * axes[2][0]) * unit;
        var sy = lcy + bob + (p.x * axes[0][1] + p.y * axes[1][1] + p.z * axes[2][1]) * unit;
        if (scatter > .001) {
          // Push cubes away from the cursor, strongest right under it
          var dx = sx - lpx, dy = sy - lpy, dist = Math.sqrt(dx * dx + dy * dy) + .001;
          var f = scatter * Math.exp(-dist * dist / (reach * reach)) * unit * 2.4;
          sx += dx / dist * f; sy += dy / dist * f;
          p.depth += f / unit;
        }
        p.sx = sx; p.sy = sy;
      });
      voxels.sort(function (a, b) { return a.depth - b.depth; });

      lctx.clearRect(0, 0, lw, lh);
      lctx.lineWidth = .6;
      lctx.strokeStyle = "rgba(15, 15, 15, .45)";
      lctx.lineJoin = "round";
      voxels.forEach(function (p) {
        for (var i = 0; i < p.faces.length; i++) {
          var L = looks[p.faces[i]];
          if (!L.show) continue;
          var fx = p.sx + L.n[0] * h, fy = p.sy + L.n[1] * h;
          var ux = L.u[0] * h, uy = L.u[1] * h, vx = L.v[0] * h, vy = L.v[1] * h;
          lctx.beginPath();
          lctx.moveTo(fx + ux + vx, fy + uy + vy);
          lctx.lineTo(fx + ux - vx, fy + uy - vy);
          lctx.lineTo(fx - ux - vx, fy - uy - vy);
          lctx.lineTo(fx - ux + vx, fy - uy + vy);
          lctx.closePath();
          lctx.fillStyle = L.fill;
          lctx.fill();
          lctx.stroke();
        }
      });
    };
    var loopLeaf = function (ms) {
      drawLeaf(ms);
      if (leafLive) requestAnimationFrame(loopLeaf);
    };
    sizeLeaf();
    window.addEventListener("resize", function () { sizeLeaf(); drawLeaf(reduceMotion ? 0 : performance.now()); });
    if (reduceMotion) drawLeaf(0);
    else {
      requestAnimationFrame(loopLeaf);
      // Only animate while the intro is on screen
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          var was = leafLive;
          leafLive = entries[0].isIntersecting;
          if (leafLive && !was) requestAnimationFrame(loopLeaf);
        }).observe(hero);
      }
    }
  }
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // Smooth wheel scrolling: the page eases towards where the wheel says it should be.
  // Keyboard, scrollbar, anchors and touch stay native; anything scrollable under the mouse scrolls itself.
  if (!reduceMotion && finePointer) {
    var root = document.scrollingElement || document.documentElement;
    var target = window.scrollY, current = target, frame = null;
    var canScroll = function (el, dy) {
      for (; el && el !== document.body && el !== root; el = el.parentElement) {
        var oy = getComputedStyle(el).overflowY;
        if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 1) {
          if (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true;
        }
      }
      return false;
    };
    var step = function () {
      current += (target - current) * .1;
      if (Math.abs(target - current) < .5) { current = target; frame = null; } else { frame = requestAnimationFrame(step); }
      window.scrollTo({ top: current, behavior: "instant" });
    };
    window.addEventListener("wheel", function (e) {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY) || canScroll(e.target, e.deltaY)) return;
      e.preventDefault();
      var dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
      if (!frame) current = target = window.scrollY;
      target = Math.max(0, Math.min(root.scrollHeight - window.innerHeight, target + dy));
      if (!frame) frame = requestAnimationFrame(step);
    }, { passive: false });
    // Keep in step with scrolling we didn't cause (keyboard, anchor links, scrollbar)
    window.addEventListener("scroll", function () { if (!frame) current = target = window.scrollY; }, { passive: true });
  }

  // Subtle custom cursor: a small dot that inverts what's under it and grows over things you can click
  if (finePointer) {
    var dot = document.createElement("div");
    dot.className = "cursor";
    dot.setAttribute("aria-hidden", "true");
    document.body.appendChild(dot);
    document.documentElement.classList.add("has-cursor");
    var mx = -100, my = -100, cx = mx, cy = my, moving = false;
    var hoverables = "a, button, summary, label, select, [role='button'], .mockup-browser, .mockup-phone";
    var render = function () {
      cx += (mx - cx) * (reduceMotion ? 1 : .3);
      cy += (my - cy) * (reduceMotion ? 1 : .3);
      dot.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)";
      moving = Math.abs(mx - cx) > .1 || Math.abs(my - cy) > .1;
      if (moving) requestAnimationFrame(render);
    };
    document.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.classList.add("is-visible");
      var t = e.target;
      dot.classList.toggle("is-text", !!t.closest("input, textarea"));
      dot.classList.toggle("is-link", !t.closest("input, textarea") && !!t.closest(hoverables) &&
        !t.closest(".is-active"));
      if (!moving) { moving = true; requestAnimationFrame(render); }
    });
    document.addEventListener("mouseleave", function () { dot.classList.remove("is-visible"); });
    document.addEventListener("mousedown", function () { dot.classList.add("is-down"); });
    document.addEventListener("mouseup", function () { dot.classList.remove("is-down"); });
  }

  // About page timeline: the rail fills and each role lights up as it passes 60% of the viewport
  var timeline = document.querySelector(".timeline");
  if (timeline) {
    var fill = document.createElement("span");
    fill.className = "timeline-fill";
    fill.setAttribute("aria-hidden", "true");
    timeline.appendChild(fill);
    var roles = timeline.querySelectorAll(".tl-item");
    var tlTicking = false;
    var paint = function () {
      tlTicking = false;
      var line = window.innerHeight * .6, box = timeline.getBoundingClientRect();
      fill.style.transform = "scaleY(" + Math.max(0, Math.min(1, (line - box.top) / box.height)).toFixed(4) + ")";
      roles.forEach(function (li) { li.classList.toggle("is-active", li.getBoundingClientRect().top < line); });
    };
    window.addEventListener("scroll", function () {
      if (!tlTicking) { tlTicking = true; requestAnimationFrame(paint); }
    }, { passive: true });
    window.addEventListener("resize", paint);
    paint();
  }

  // About page toolkit: every tool sits on a faint panel inside a 3D lattice, like words pinned to the walls of a set of rooms.
  // As the section scrolls by, the camera swings from a near-flat view into a tilted one; the pointer leans it further.
  // Panels further away fade out. Without JS the tools stay a plain list; with reduced motion the lattice holds still.
  var kit = document.querySelector(".toolkit");
  if (kit) {
    var field = kit.querySelector(".toolkit-globe");
    var world = document.createElement("div");
    world.className = "tk-world";
    var words = [];
    kit.querySelectorAll(".toolkit-list > li").forEach(function (group) {
      words.push({ text: group.querySelector("h3").textContent, group: true });
      group.querySelectorAll("li").forEach(function (li) { words.push({ text: li.textContent }); });
    });
    // Every cell of a 5 × 3 × 4 lattice, shuffled with a fixed seed so the layout is the same on every visit
    var seed = 11, cells = [];
    var rand = function () { seed = seed * 16807 % 2147483647; return (seed - 1) / 2147483646; };
    for (var gx = -2; gx <= 2; gx++) for (var gy = -1; gy <= 1; gy++) for (var gz = -2; gz <= 1; gz++) cells.push([gx, gy, gz]);
    for (var ci = cells.length - 1; ci > 0; ci--) { var cj = Math.floor(rand() * (ci + 1)), swap = cells[ci]; cells[ci] = cells[cj]; cells[cj] = swap; }
    words.forEach(function (w, i) {
      w.cell = cells[i % cells.length];
      // Most panels face the viewer; some stand side-on like walls, a few lie flat like floors
      var r = rand();
      w.turn = r < .55 ? "" : r < .85 ? " rotateY(90deg)" : " rotateX(-90deg)";
      w.el = document.createElement("span");
      w.el.className = "tk-word" + (w.group ? " is-group" : "");
      w.el.textContent = w.text;
      world.appendChild(w.el);
    });
    field.appendChild(world);
    kit.classList.add("has-globe");

    var C, live = false, px = 0, py = 0, tx = 0, ty = 0;
    var layout = function () {
      C = Math.min(field.offsetWidth / 4, field.offsetHeight / 2.4, 260);
      field.style.setProperty("--c", C.toFixed(1) + "px");
      words.forEach(function (w) {
        w.x = w.cell[0] * C; w.y = w.cell[1] * C * .8; w.z = w.cell[2] * C;
        w.el.style.transform = "translate(-50%, -50%) translate3d(" + w.x.toFixed(1) + "px," + w.y.toFixed(1) + "px," + w.z.toFixed(1) + "px)" + w.turn;
      });
    };
    // How far the section has travelled through the window, 0 as it enters and 1 as it leaves
    var progress = function () {
      var box = field.getBoundingClientRect();
      return Math.max(0, Math.min(1, (window.innerHeight - box.top) / (window.innerHeight + box.height)));
    };
    var rad = Math.PI / 180;
    var draw = function (ms) {
      var t = (ms || 0) / 1000, p = reduceMotion ? .6 : progress();
      px += (tx - px) * .06; py += (ty - py) * .06;
      var k = p * p * (3 - 2 * p);
      var drift = reduceMotion ? 0 : 1;
      var ax = 8 + 26 * k - py * 10 + drift * Math.sin(t * .2) * 2;
      var ay = -12 - 30 * k + px * 16 + drift * Math.sin(t * .13) * 4;
      var az = -10 * k;
      world.style.transform = "rotateX(" + ax.toFixed(2) + "deg) rotateY(" + ay.toFixed(2) + "deg) rotateZ(" + az.toFixed(2) + "deg)";
      // Depth of each panel after the same rotations (CSS applies rotateZ first, then Y, then X)
      var cx = Math.cos(ax * rad), sx = Math.sin(ax * rad), cy = Math.cos(ay * rad), sy = Math.sin(ay * rad), cz = Math.cos(az * rad), sz = Math.sin(az * rad);
      words.forEach(function (w) {
        var x1 = w.x * cz - w.y * sz, y1 = w.x * sz + w.y * cz;
        var z2 = -x1 * sy + w.z * cy;
        var z3 = y1 * sx + z2 * cx;
        var d = Math.max(0, Math.min(1, (z3 + C * 2.4) / (C * 4.8)));
        w.el.style.opacity = (.08 + d * .92).toFixed(3);
      });
      if (live) requestAnimationFrame(draw);
    };
    layout();
    draw(0);
    window.addEventListener("resize", function () { layout(); draw(0); });
    if (!reduceMotion) {
      kit.addEventListener("pointermove", function (e) {
        var box = field.getBoundingClientRect();
        tx = Math.max(-1, Math.min(1, (e.clientX - box.left) / box.width * 2 - 1));
        ty = Math.max(-1, Math.min(1, (e.clientY - box.top) / box.height * 2 - 1));
      });
      kit.addEventListener("pointerleave", function () { tx = ty = 0; });
      // Only animate while the lattice is on screen
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          var was = live;
          live = entries[0].isIntersecting;
          if (live && !was) requestAnimationFrame(draw);
        }).observe(field);
      }
    }
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
