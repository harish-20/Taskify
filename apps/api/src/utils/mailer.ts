import {
  FROM_EMAIL,
  FRONTEND_URL,
  GMAIL_APP_PASSWORD,
  GMAIL_EMAIL,
} from "../configs/index.js";

import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "node:path";

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_EMAIL,
    pass: GMAIL_APP_PASSWORD,
  },
});

export const sendMail = async ({
  to,
  subject,
  html,
  text,
}: SendMailOptions) => {
  await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject,
    html,
    text,
    // We dont want this to be important tagged
    headers: {
      "X-Priority": "3",
      "X-MSMail-Priority": "Normal",
      Importance: "Normal",
    },
  });
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const sendMagicLink = async (
  name: string,
  to: string,
  token: string
) => {
  const magicLink = `${FRONTEND_URL}/verify?token=${token}`;

  const templatePath = path.join(
    __dirname,
    "../templates/verificationEmail.ejs"
  );
  const html = await ejs.renderFile(templatePath, {
    subject: "Welcome to Taskify — confirm your email",
    name: name,
    action_url: magicLink,
    action_text: "Verify Email",
  });

  const text = `Click this link to verify your account: ${magicLink}`;

  await sendMail({
    to,
    subject: "Welcome to Taskify — confirm your email",
    html,
    text,
  });

  return magicLink;
};
