import nodemailer from "nodemailer";

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMail = async ({ to, subject, html }: SendMailOptions) => {
  await transporter.sendMail({
    from: `"Your App" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};

export const sendMagicLink = async (to: string, token: string) => {
  const frontendUrl = process.env.FRONTEND_URL;
  if (!frontendUrl) throw new Error("FRONTEND_URL not set in env");

  const magicLink = `${frontendUrl}/verify?token=${token}`;

  const html = `
    <p>Click the link below to verify your account:</p>
    <p><a href="${magicLink}">${magicLink}</a></p>
    <p>If you did not request this, you can ignore this email.</p>
  `;

  await sendMail({
    to,
    subject: "Your Magic Link",
    html,
  });

  return magicLink;
};
