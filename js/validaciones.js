"use strict";

document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();
    var name = document.getElementById("contact-name").value;
    var email = document.getElementById("contact-email").value;
    var message = document.getElementById("contact-message").value;

    if (validateContactForm(name, email, message)) {
        sendEmail(name, email, message);
    }
});

function validateContactForm(name, email, message) {
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (name.length < 3) {
        alert("El nombre debe tener al menos 3 letras.");
        return false;
    }
    if (!emailPattern.test(email)) {
        alert("Por favor, ingresa un email válido.");
        return false;
    }
    if (message.length < 5) {
        alert("El mensaje debe tener al menos 5 caracteres.");
        return false;
    }
    return true;
}

function sendEmail(name, email, message) {
    var subject = "Mensaje de contacto desde la página web";
    var body = "Nombre: " + name + "\nEmail: " + email + "\n\nMensaje:\n" + message;
    var mailtoUrl = "mailto:sebafebre5@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

    window.location.href = mailtoUrl;
}
