// Contour-line waves drawn behind any element with a data-waves attribute.
//   data-waves="top" | "bottom" | "both"   which edges get waves (default "both")
//   data-waves-lines="18"                  how many lines per band
// The waves sit in the element's top/bottom padding. They are still until the
// pointer moves over the element, then animate and swell toward the pointer.
// With prefers-reduced-motion they stay still.
(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var COLORS = ["#fb923c", "#f472b6", "#fb7185"]; // sunset: orange, pink, rose

  document.querySelectorAll("[data-waves]").forEach(function (host) {
    var mode = host.getAttribute("data-waves") || "both";
    var lines = parseInt(host.getAttribute("data-waves-lines"), 10) || 18;
    var canvas = document.createElement("canvas");
    canvas.className = "waves";
    canvas.setAttribute("aria-hidden", "true");
    host.insertBefore(canvas, host.firstChild);
    var ctx = canvas.getContext("2d");

    var w = 0, h = 0, padTop = 0, padBottom = 0;
    var t = Math.random() * 100;   // time
    var energy = 0, target = 0;    // 0 = resting, 1 = fully excited
    var mx = 0.5, smx = 0.5;       // pointer x (0..1), and its smoothed value
    var raf = null, last = 0;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var r = host.getBoundingClientRect();
      var cs = getComputedStyle(host);
      w = r.width; h = r.height;
      padTop = parseFloat(cs.paddingTop) || 0;
      padBottom = parseFloat(cs.paddingBottom) || 0;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    // How deep the wave dips at horizontal position u (0..1), from 0 (hidden at the edge) to 1 (full depth).
    // Layered sines give slowly drifting hills; the pointer pulls a swell toward it.
    function profile(u, seed) {
      var a = Math.sin(u * 5.2 + t * 0.55 + seed) * 0.5 + 0.5;
      var b = Math.sin(u * 11.3 - t * 0.9 + seed * 2.1) * 0.5 + 0.5;
      var c = Math.sin(u * 2.4 + t * 0.3 + seed * 0.7) * 0.5 + 0.5;
      var hills = Math.pow(0.5 * a + 0.3 * b + 0.2 * c, 1.15);
      var d = u - smx;
      var swell = energy * 0.6 * Math.exp(-(d * d) / 0.012);
      var x = hills * (1 + 0.15 * energy) + swell;
      return x < 0.8 ? x : 0.8 + 0.2 * Math.tanh((x - 0.8) / 0.2); // round off near full depth instead of flattening
    }

    // A thick ribbon of evenly spaced lines whose centre line rises and dips across the width.
    function band(fromTop, depth, seed) {
      if (depth < 24) return;
      var grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, COLORS[0]);
      grad.addColorStop(0.55, COLORS[1]);
      grad.addColorStop(1, COLORS[2]);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      var thick = depth * 0.5;
      var step = Math.max(3, w / 300);
      for (var i = 0; i < lines; i++) {
        var k = i / (lines - 1) - 0.5;            // -0.5 .. 0.5 across the ribbon
        ctx.globalAlpha = 0.95 - Math.abs(k) * 0.5;
        ctx.beginPath();
        for (var x = 0; x <= w + step; x += step) {
          var u = x / w;
          var p = profile(u, seed);
          var spread = 0.75 + 0.5 * p;            // lines fan out where the wave dips deepest
          var centre = -thick * 0.6 + p * (depth - thick * 0.45 + thick * 0.6);
          var ripple = Math.sin(u * 26 + t * 1.8 + i * 0.4) * (1.5 + 4 * energy) * (0.5 + k);
          var y = centre + k * thick * spread + ripple;
          if (!fromTop) y = h - y;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      if (mode !== "bottom") band(true, padTop * 0.92, 0.4);
      if (mode !== "top") band(false, padBottom * 0.92, 2.7);
    }

    function frame(now) {
      var dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      energy += (target - energy) * 0.05;
      smx += (mx - smx) * 0.08;
      t += dt * (0.3 + 1.7 * energy);
      draw();
      if (target === 0 && energy < 0.01) { energy = 0; raf = null; last = 0; draw(); return; }
      raf = requestAnimationFrame(frame);
    }

    function wake() {
      if (!raf) raf = requestAnimationFrame(frame);
    }

    if (window.ResizeObserver) new ResizeObserver(resize).observe(host);
    else window.addEventListener("resize", resize);
    resize();

    if (reduceMotion) return;
    host.addEventListener("pointermove", function (e) {
      var r = host.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width;
      target = 1;
      wake();
    });
    host.addEventListener("pointerleave", function () { target = 0; wake(); });
  });
})();
