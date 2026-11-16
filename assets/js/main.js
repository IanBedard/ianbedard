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

  // About page toolkit: every tool sits on a slowly turning globe, tied to the hub by a hairline.
  // Nearer tags are larger and brighter; the pointer tilts the globe and nudges the hub.
  // Without JS the tools stay a plain list; with reduced motion the globe doesn't spin on its own.
  var kit = document.querySelector(".toolkit");
  if (kit) {
    var globe = kit.querySelector(".toolkit-globe");
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    var wires = [0, 1, 2, 3, 4].map(function () {
      var el = document.createElementNS(NS, "ellipse");
      el.setAttribute("class", "wire");
      svg.appendChild(el);
      return el;
    });
    var tags = [];
    kit.querySelectorAll(".toolkit-list > li").forEach(function (group) {
      tags.push({ text: group.querySelector("h3").textContent, group: true });
      group.querySelectorAll("li").forEach(function (li) { tags.push({ text: li.textContent }); });
    });
    var golden = Math.PI * (3 - Math.sqrt(5));
    tags.forEach(function (t, i) {
      // Spread the tags evenly over the sphere (Fibonacci lattice)
      var y = 1 - 2 * (i + .5) / tags.length, r = Math.sqrt(1 - y * y), a = i * golden;
      t.x = Math.cos(a) * r; t.y = y; t.z = Math.sin(a) * r;
      t.ray = document.createElementNS(NS, "line");
      t.ray.setAttribute("class", "ray");
      svg.appendChild(t.ray);
      t.el = document.createElement("span");
      t.el.className = "tag" + (t.group ? " is-group" : "");
      t.el.textContent = t.text;
    });
    globe.appendChild(svg);
    tags.forEach(function (t) { globe.appendChild(t.el); });
    kit.classList.add("has-globe");

    var W, H, R, FLAT = .66, spin = 0, px = 0, py = 0, tx = 0, ty = 0, live = false;
    var measure = function () {
      W = globe.offsetWidth; H = globe.offsetHeight;
      R = Math.min(W * (W < 640 ? .34 : .25), H * .5, 380);
      tags.forEach(function (t) { t.w = t.el.offsetWidth; t.h = t.el.offsetHeight; });
    };
    var draw = function () {
      px += (tx - px) * .06; py += (ty - py) * .06;
      if (!reduceMotion) spin += .0022 + px * .004;
      var gx = W / 2, gy = H / 2, hx = gx + px * 48, hy = gy + py * 32;
      var tilt = -.3 + py * .35, ct = Math.cos(tilt), st = Math.sin(tilt), cs = Math.cos(spin), ss = Math.sin(spin);
      tags.forEach(function (t) {
        var x = t.x * cs + t.z * ss, z = t.z * cs - t.x * ss;
        var y = t.y * ct - z * st;
        z = t.y * st + z * ct;
        var d = (z + 1) / 2, k = .7 + d * .45;
        var sx = gx + x * R, sy = gy + y * R * FLAT;
        t.el.style.transform = "translate(" + (sx - t.w * k / 2).toFixed(1) + "px," + (sy - t.h * k / 2).toFixed(1) + "px) scale(" + k.toFixed(3) + ")";
        t.el.style.opacity = (.18 + d * .82).toFixed(3);
        t.el.style.zIndex = Math.round(d * 100);
        t.ray.setAttribute("x1", hx.toFixed(1)); t.ray.setAttribute("y1", hy.toFixed(1));
        t.ray.setAttribute("x2", sx.toFixed(1)); t.ray.setAttribute("y2", sy.toFixed(1));
        t.ray.style.opacity = (.04 + d * .26).toFixed(3);
      });
      // Wireframe: the outline, the equator, and three meridians turning with the globe
      var shapes = [[R, R * FLAT], [R, R * FLAT * Math.abs(st)]];
      for (var m = 0; m < 3; m++) shapes.push([R * Math.abs(Math.cos(spin + m * Math.PI / 3)), R * FLAT]);
      wires.forEach(function (el, i) {
        el.setAttribute("cx", gx); el.setAttribute("cy", gy);
        el.setAttribute("rx", shapes[i][0].toFixed(1)); el.setAttribute("ry", shapes[i][1].toFixed(1));
      });
      if (live) requestAnimationFrame(draw);
    };
    measure();
    draw();
    window.addEventListener("resize", function () { measure(); draw(); });
    kit.addEventListener("pointermove", function (e) {
      var box = globe.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - box.left) / box.width * 2 - 1));
      ty = Math.max(-1, Math.min(1, (e.clientY - box.top) / box.height * 2 - 1));
    });
    kit.addEventListener("pointerleave", function () { tx = ty = 0; });
    // Only animate while the globe is on screen
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        var was = live;
        live = entries[0].isIntersecting;
        if (live && !was) requestAnimationFrame(draw);
      }).observe(globe);
    }
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
