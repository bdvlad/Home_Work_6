(function () {
  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = document.getElementById("contact-status");
  var fields = [
    { name: "name", errorId: "contact-name-error", validate: validateName },
    { name: "email", errorId: "contact-email-error", validate: validateEmail },
    { name: "phone", errorId: "contact-phone-error", validate: validatePhone },
    { name: "message", errorId: "contact-message-error", validate: validateMessage },
  ];

  fields.forEach(function (field) {
    var input = form.elements[field.name];
    input.addEventListener("input", function () {
      if (input.getAttribute("aria-invalid") === "true") showError(field, field.validate(input.value));
      if (status && !status.hidden) status.hidden = true;
    });
    input.addEventListener("blur", function () {
      input.dataset.touched = "true";
      showError(field, field.validate(input.value));
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var firstInvalid = null;

    fields.forEach(function (field) {
      var input = form.elements[field.name];
      input.dataset.touched = "true";
      var message = field.validate(input.value);
      showError(field, message);
      if (message && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
      if (status) status.hidden = true;
      firstInvalid.focus();
      return;
    }

    form.reset();
    fields.forEach(function (field) {
      var input = form.elements[field.name];
      delete input.dataset.touched;
      showError(field, "");
    });

    if (!status) return;
    status.hidden = false;
    status.textContent =
      "Приймальня записала лист. Василь прочитає його, щойно кава дозволить.";
    status.focus();
  });

  function showError(field, message) {
    var input = form.elements[field.name];
    var error = document.getElementById(field.errorId);
    if (!error) return;
    if (message) {
      input.setAttribute("aria-invalid", "true");
      error.hidden = false;
      error.textContent = message;
      return;
    }
    input.removeAttribute("aria-invalid");
    error.hidden = true;
    error.textContent = "";
  }

  function validateName(value) {
    var name = value.trim();
    if (!name) return "Вкажіть ім’я.";
    if (name.length < 2) return "Ім’я має містити щонайменше 2 символи.";
    if (!/^[\p{L}][\p{L}\s'’.-]{1,59}$/u.test(name)) {
      return "Ім’я може містити лише літери, пробіл, апостроф або дефіс.";
    }
    return "";
  }

  function validateEmail(value) {
    var email = value.trim();
    if (!email) return "Вкажіть електронну пошту.";
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      return "Схоже, у адресі пропущено @ або домен.";
    }
    return "";
  }

  function validatePhone(value) {
    var phone = value.trim();
    if (!phone) return "";
    if (!/^[+()\d\s-]+$/.test(phone)) {
      return "Телефон може містити цифри, пробіли, дужки та +.";
    }
    var digits = phone.replace(/\D/g, "");
    var valid =
      (digits.length === 10 && digits.charAt(0) === "0") ||
      (digits.length === 12 && digits.indexOf("380") === 0) ||
      (digits.length >= 10 && digits.length <= 15 && phone.charAt(0) === "+");
    if (!valid) return "Вкажіть телефон у форматі +380 XX XXX XX XX.";
    return "";
  }

  function validateMessage(value) {
    var message = value.trim();
    if (!message) return "Напишіть, з чим звернутися.";
    if (message.length < 10) return "Повідомлення має містити щонайменше 10 символів.";
    return "";
  }
})();
