const express = require("express");
const Joi = require("joi");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas solicitudes. Intenta nuevamente en unos minutos." },
});

const contactSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  email: Joi.string().trim().email().required(),
  message: Joi.string().trim().min(10).max(2000).required(),
  website: Joi.string().allow("").optional(),
});

router.post("/send", contactLimiter, async (req, res) => {
  const { error, value } = contactSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({ error: "Datos inválidos en el formulario." });
  }

  if (value.website) {
    return res.status(200).json({ message: "Mensaje recibido." });
  }

  const emailUser = process.env.CONTACT_EMAIL_USER;
  const emailPass = process.env.CONTACT_EMAIL_APP_PASSWORD;
  const emailTo = process.env.CONTACT_EMAIL_TO || "brecciamarmol@gmail.com";

  if (!emailUser || !emailPass) {
    return res.status(500).json({ error: "Servicio de contacto no configurado." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    await transporter.sendMail({
      from: `"Formulario Breccia" <${emailUser}>`,
      to: emailTo,
      replyTo: value.email,
      subject: `Nuevo mensaje de contacto: ${value.name}`,
      text: `Nombre: ${value.name}\nCorreo: ${value.email}\n\nMensaje:\n${value.message}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${value.name}</p>
        <p><strong>Correo:</strong> ${value.email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${value.message.replace(/\n/g, "<br />")}</p>
      `,
    });

    return res.status(200).json({ message: "Mensaje enviado correctamente." });
  } catch (mailError) {
    return res.status(500).json({ error: "No se pudo enviar el mensaje." });
  }
});

module.exports = router;