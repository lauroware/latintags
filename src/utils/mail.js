import nodemailer from "nodemailer";

console.log("BREVO_SMTP_USER:", process.env.BREVO_SMTP_USER ? "OK" : "FALTA");
console.log("BREVO_SMTP_KEY:", process.env.BREVO_SMTP_KEY ? "OK" : "FALTA");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

export default transporter;