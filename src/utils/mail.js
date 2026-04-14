import * as Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.authentications["apiKey"].apiKey = process.env.BREVO_API_KEY;

/**
 * Envía un email transaccional via Brevo.
 * Interfaz compatible con el uso anterior de nodemailer:
 *   await sendMail({ to, subject, html })
 */
const sendMail = async ({ to, subject, html }) => {
  const email = new Brevo.SendSmtpEmail();
  email.sender = { email: process.env.EMAIL_FROM, name: "Nexo Tags" };
  email.to = [{ email: to }];
  email.subject = subject;
  email.htmlContent = html;
  return apiInstance.sendTransacEmail(email);
};

// Exportamos un objeto con la misma interfaz que nodemailer
const transporter = { sendMail };

export default transporter;