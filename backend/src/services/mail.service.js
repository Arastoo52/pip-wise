import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import config from '../config/config.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Reusable Production-Ready Mail Service (Hostinger SMTP via Nodemailer)
 * Security guarantees:
 * - Credentials loaded strictly from environment variables (via config.smtp)
 * - Zero logging of SMTP passwords, credentials, or plain-text OTPs
 * - Errors wrapped cleanly in ApiError without exposing internal credentials
 */

let transporterInstance = null;
let lastLoadedUser = null;

/**
 * Lazily initializes and returns the Nodemailer SMTP transporter
 * Automatically re-reads .env if SMTP_PASSWORD was added after server startup
 */
const getTransporter = () => {
  if (!config.smtp.pass || !process.env.SMTP_PASSWORD) {
    dotenv.config({ override: true });
    config.smtp.host = process.env.SMTP_HOST || config.smtp.host;
    config.smtp.port = parseInt(process.env.SMTP_PORT || '465', 10);
    config.smtp.secure = config.smtp.port === 465;
    config.smtp.user = process.env.SMTP_USER || config.smtp.user;
    config.smtp.pass = process.env.SMTP_PASSWORD;
    config.smtp.fromName = process.env.SMTP_FROM_NAME || 'TradeSafe Brokers';
    config.smtp.fromEmail = process.env.SMTP_FROM_EMAIL || config.smtp.user;
  }

  const { host, port, secure, user, pass } = config.smtp;

  if (!host || !port || !user || !pass) {
    throw new ApiError(
      503,
      'Email service is temporarily unavailable (SMTP configuration incomplete in environment variables).'
    );
  }

  if (!transporterInstance || lastLoadedUser !== user) {
    lastLoadedUser = user;
    transporterInstance = nodemailer.createTransport({
      host,
      port,
      secure, // true for port 465 (SSL/TLS)
      auth: {
        user,
        pass,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });
  }

  return transporterInstance;
};

/**
 * Safe SMTP connection test method
 * Verifies connectivity and authentication with Hostinger SMTP without exposing credentials
 * @returns {Promise<{ connected: boolean, host: string, port: number }>}
 */
export const verifySmtpConnection = async () => {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    return {
      connected: true,
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(502, `Failed to establish connection with the SMTP mail server: ${error.message || 'Timeout'}`);
  }
};

/**
 * Generic reusable function to send an email via Hostinger SMTP
 * @param {{ to: string, subject: string, html: string, text?: string }} options
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  if (!to || !subject || (!html && !text)) {
    throw new ApiError(400, 'Recipient, subject, and email content are required.');
  }

  try {
    const transporter = getTransporter();
    const fromHeader = `"${config.smtp.fromName || 'TradeSafe Brokers'}" <${config.smtp.fromEmail || config.smtp.user}>`;

    const info = await transporter.sendMail({
      from: fromHeader,
      to,
      subject,
      text: text || 'Please view this email in an HTML-compatible email client.',
      html,
    });

    console.log(`📧 [Mail Sent Successfully] To: ${to} | MessageId: ${info.messageId}`);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error(`❌ [Mail Send Failed] To: ${to} | Error:`, error.message);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      502,
      `Unable to send verification email at this moment (${error.message || 'SMTP service error'}). Please try again shortly.`
    );
  }
};

/**
 * Sends a 4-digit OTP verification email
 * Never logs the OTP or any sensitive user credentials
 *
 * @param {{
 *   to: string,
 *   username?: string,
 *   otp: string,
 *   expiresInMinutes?: number,
 *   purpose?: string
 * }} params
 */
export const sendOtpEmail = async ({
  to,
  username = 'Trader',
  otp,
  expiresInMinutes = 10,
  purpose = 'Account Verification',
}) => {
  const safeUsername = String(username).replace(/[<>&"']/g, '');
  const subject = `${purpose} Code — TradeSafe Brokers`;

  const text = [
    `Hello ${safeUsername},`,
    '',
    `Your TradeSafe Brokers 4-digit verification code is: ${otp}`,
    '',
    `This OTP will expire in ${expiresInMinutes} minutes.`,
    '',
    'SECURITY WARNING: Never share this OTP with anyone. TradeSafe Brokers support staff will NEVER ask you for your verification code or password.',
    '',
    'If you did not request this code, please ignore this email and your account will remain secure.',
    '',
    '— TradeSafe Brokers Security Team',
  ].join('\n');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#0b1120;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#0b1120;padding:36px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:520px;background-color:#131d31;border:1px solid #1e293b;border-radius:16px;overflow:hidden;box-shadow:0 12px 32px rgba(0,0,0,0.4);">
          <!-- Top Brand Accent Bar -->
          <tr>
            <td style="height:5px;background:linear-gradient(90deg,#fc5d21 0%,#ff8552 100%);"></td>
          </tr>
          <!-- Header -->
          <tr>
            <td style="padding:28px 32px 16px;text-align:center;">
              <div style="display:inline-block;padding:6px 14px;border-radius:999px;background:rgba(252,93,33,0.12);border:1px solid rgba(252,93,33,0.3);color:#fc5d21;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;margin-bottom:14px;">
                TradeSafe Brokers Security
              </div>
              <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.01em;">
                Verify Your Email Address
              </h1>
            </td>
          </tr>
          <!-- Greeting & Message -->
          <tr>
            <td style="padding:8px 32px 20px;font-size:14.5px;line-height:1.6;color:#cbd5e1;text-align:center;">
              Hello <strong style="color:#ffffff;">${safeUsername}</strong>,<br />
              Use the <strong>4-digit verification code</strong> below to complete your ${purpose.toLowerCase()} on TradeSafe Brokers.
            </td>
          </tr>
          <!-- 4-Digit OTP Box -->
          <tr>
            <td align="center" style="padding:4px 32px 24px;">
              <div style="display:inline-block;background-color:#0f172a;border:1.5px solid #fc5d21;border-radius:14px;padding:18px 36px;box-shadow:0 6px 20px rgba(252,93,33,0.15);">
                <span style="font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;font-size:36px;font-weight:800;letter-spacing:14px;color:#fc5d21;margin-right:-14px;">
                  ${otp}
                </span>
              </div>
              <p style="margin:12px 0 0;font-size:12.5px;color:#94a3b8;">
                ⏱ This code expires in <strong style="color:#f8fafc;">${expiresInMinutes} minutes</strong>.
              </p>
            </td>
          </tr>
          <!-- Security Warning Box -->
          <tr>
            <td style="padding:0 32px 28px;">
              <div style="background-color:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25);border-radius:10px;padding:14px 16px;font-size:12.5px;line-height:1.5;color:#fca5a5;">
                <strong style="color:#f87171;">🔒 Security Warning:</strong> Never share this 4-digit OTP with anyone. TradeSafe Brokers administrators and support staff will <strong>never</strong> ask you for this code.
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:18px 32px;background-color:#0f172a;border-top:1px solid #1e293b;text-align:center;font-size:11.5px;color:#64748b;line-height:1.5;">
              If you did not initiate this request, you can safely disregard this email.<br />
              © ${new Date().getFullYear()} TradeSafe Brokers (<a href="mailto:${config.smtp.fromEmail}" style="color:#fc5d21;text-decoration:none;">${config.smtp.fromEmail}</a>)
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return await sendEmail({
    to,
    subject,
    text,
    html,
  });
};

export default {
  verifySmtpConnection,
  sendEmail,
  sendOtpEmail,
};
