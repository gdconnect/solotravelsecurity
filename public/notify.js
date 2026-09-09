// Vanilla submit handler for [data-form=notify] forms.
// Bound once per form via data-bound flag. ~500 bytes.
(function () {
  var forms = document.querySelectorAll("form[data-form=notify]");
  for (var i = 0; i < forms.length; i++) {
    bind(forms[i]);
  }
  function bind(form) {
    if (form.__bound) return;
    form.__bound = 1;
    var input = form.querySelector("input[name=email]");
    var btn = form.querySelector("button[type=submit]");
    var msg = form.querySelector("[data-status]");
    var iconIdle = form.querySelector("[data-icon=idle]");
    var iconLoad = form.querySelector("[data-icon=loading]");
    var iconDone = form.querySelector("[data-icon=done]");
    var label = btn && btn.querySelector("[data-label]");
    var endpoint = form.getAttribute("action") || "/api/notify";
    var ok = msg && iconIdle && iconLoad && iconDone && label;
    function setStatus(s, t) {
      if (!msg) return;
      msg.dataset.status = s;
      msg.textContent = t;
      msg.className =
        "text-sm font-semibold " +
        (s === "error"
          ? "text-rose-600 dark:text-rose-400"
          : s === "success"
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-slate-700 dark:text-amber-50/75");
    }
    function setState(s) {
      if (!btn || !label || !ok) return;
      btn.disabled = s === "loading";
      label.textContent =
        s === "loading" ? "Signing up…" : s === "success" ? "Subscribed" : "Notify me";
      iconIdle.hidden = s !== "idle";
      iconLoad.hidden = s !== "loading";
      iconDone.hidden = s !== "success";
      if (s === "loading") iconLoad.classList.add("animate-spin");
    }
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (!ok) return;
      var v = (input.value || "").trim();
      if (!v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        setStatus("error", "Enter a valid email address.");
        return;
      }
      setState("loading");
      setStatus("idle", "");
      try {
        var r = await fetch(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email: v }),
        });
        if (!r.ok) throw 0;
        setState("success");
        setStatus("success", "You're on the list. We'll be in touch.");
        input.value = "";
      } catch (_) {
        setState("idle");
        setStatus("error", "Couldn't sign you up right now. Try again later.");
      }
    });
  }
})();
