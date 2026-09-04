import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/**
 * Check if SMTP email delivery is configured
 */
export const isEmailConfigured = () => {
  return Boolean(
    process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS
  );
};

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  if (!isEmailConfigured()) return null;

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
};

/**
 * Send an email. If SMTP is not configured, logs the content (and any
 * action link) to the console instead so local/dev testing still works —
 * mirrors the graceful-fallback pattern used by the Cloudinary config.
 *
 * @param {{to: string, subject: string, html: string, text?: string}} options
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const t = getTransporter();

  if (!t) {
    console.warn(
      "[Email] SMTP not configured (EMAIL_HOST, EMAIL_USER, EMAIL_PASS missing in .env). " +
        "Logging email content instead of sending:"
    );
    console.log(`[Email] To: ${to}`);
    console.log(`[Email] Subject: ${subject}`);
    console.log(`[Email] Body:\n${text || html}`);
    return { delivered: false, previewedInConsole: true };
  }

  try {
    await t.sendMail({
      from: process.env.EMAIL_FROM || `"ConnectCampus" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    });
    console.log(`[Email] Sent "${subject}" to ${to}`);
    return { delivered: true };
  } catch (error) {
    console.error("[Email] Failed to send:", error.message);
    // Don't block the request flow if email delivery fails — log the
    // content so the flow can still be tested/continued manually.
    console.log(`[Email] (delivery failed) To: ${to} | Subject: ${subject}`);
    console.log(`[Email] Body:\n${text || html}`);
    return { delivered: false, error: error.message };
  }
};

const emailShell = (title, bodyHtml) => `
  <div style="font-family: Inter, system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #0f172a;">
    <div style="display:flex; align-items:center; gap:10px; margin-bottom: 24px;">
      <div style="background:#4f46e5; color:#fff; font-weight:700; padding:8px 12px; border-radius:10px;">CC</div>
      <span style="font-size:18px; font-weight:700;">Campus<span style="color:#4f46e5;">Connect</span></span>
    </div>
    <h2 style="font-size:20px; margin-bottom:12px;">${title}</h2>
    ${bodyHtml}
    <p style="margin-top:32px; font-size:12px; color:#64748b;">
      ConnectCampus &middot; This is an automated message, please do not reply.
    </p>
  </div>
`;

export const buildVerificationEmail = (name, verifyUrl) =>
  emailShell(
    `Welcome, ${name}! Please verify your email`,
    `
      <p style="font-size:14px; color:#334155; line-height:1.6;">
        Thanks for creating a ConnectCampus account. Please confirm this is your email address by clicking the button below.
      </p>
      <a href="${verifyUrl}" style="display:inline-block; margin-top:16px; background:#4f46e5; color:#fff; text-decoration:none; padding:12px 24px; border-radius:10px; font-weight:600; font-size:14px;">
        Verify Email Address
      </a>
      <p style="margin-top:16px; font-size:12px; color:#64748b;">
        Or copy this link into your browser:<br/>${verifyUrl}
      </p>
      <p style="margin-top:16px; font-size:12px; color:#94a3b8;">This link expires in 24 hours.</p>
    `
  );

export const buildResetPasswordEmail = (name, resetUrl) =>
  emailShell(
    `Reset your password`,
    `
      <p style="font-size:14px; color:#334155; line-height:1.6;">
        Hi ${name}, we received a request to reset your ConnectCampus password. Click below to choose a new one.
      </p>
      <a href="${resetUrl}" style="display:inline-block; margin-top:16px; background:#4f46e5; color:#fff; text-decoration:none; padding:12px 24px; border-radius:10px; font-weight:600; font-size:14px;">
        Reset Password
      </a>
      <p style="margin-top:16px; font-size:12px; color:#64748b;">
        Or copy this link into your browser:<br/>${resetUrl}
      </p>
      <p style="margin-top:16px; font-size:12px; color:#94a3b8;">
        This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
      </p>
    `
  );
