(function () {
  var root = document.documentElement;
  var toggle = document.querySelector(".theme-toggle");
  if (!toggle) return;

  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function syncToggle(theme) {
    var dark = theme === "dark";
    toggle.setAttribute("aria-pressed", dark ? "true" : "false");
    toggle.setAttribute(
      "aria-label",
      dark ? "Увімкнути світлу тему" : "Увімкнути темну тему"
    );
  }

  function applyTheme(theme, persist) {
    root.setAttribute("data-theme", theme);
    syncToggle(theme);
    if (!persist) return;
    try {
      localStorage.setItem("theme", theme);
    } catch (error) {}
  }

  syncToggle(currentTheme());

  toggle.addEventListener("click", function () {
    applyTheme(currentTheme() === "dark" ? "light" : "dark", true);
  });

  media.addEventListener("change", function (event) {
    try {
      if (localStorage.getItem("theme")) return;
    } catch (error) {
      return;
    }
    applyTheme(event.matches ? "dark" : "light", false);
  });
})();
