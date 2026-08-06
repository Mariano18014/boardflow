import nodemailer from "nodemailer";

const APP_NAME = "BoardFlow";
const BRAND_PRIMARY = "#1D2644";
const BRAND_SECONDARY = "#4A89C6";
const BG_SOFT = "#F4F7FB";
const TEXT_MAIN = "#1E293B";
const TEXT_MUTED = "#475569";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: process.env.NODE_ENV === 'production'
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
});

function getFromHeader() {
  const fromName = process.env.MAIL_FROM_NAME || APP_NAME;
  const fromAddress = process.env.MAIL_FROM_ADDRESS || "no-reply@example.com";
  return `"${fromName}" <${fromAddress}>`;
}

function getAppBaseUrl() {
  if (process.env.APP_URL) return process.env.APP_URL;
  if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
    return "https://" + process.env.REPL_SLUG + "." + process.env.REPL_OWNER + ".repl.co";
  }
  return "http://localhost:5000";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmailTemplate(params: {
  preheader: string;
  heading: string;
  intro: string;
  bodyHtml: string;
  ctaLabel: string;
  ctaUrl: string;
  footer?: string;
  accent?: string;
}) {
  const accent = params.accent || BRAND_PRIMARY;
  const footer = params.footer || `© ${new Date().getFullYear()} ${APP_NAME}`;

  return `
    <div style="display:none;font-size:1px;color:#fff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
      ${params.preheader}
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BG_SOFT};padding:24px 12px;font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="background:${BRAND_PRIMARY};padding:20px 24px;text-align:center;">
                <div style="font-size:22px;line-height:1.2;font-weight:700;letter-spacing:0.2px;color:#ffffff;">${APP_NAME}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:30px 28px 8px 28px;">
                <h1 style="margin:0 0 8px 0;color:${TEXT_MAIN};font-size:28px;line-height:1.25;">${params.heading}</h1>
                <p style="margin:0;color:${TEXT_MUTED};font-size:16px;line-height:1.6;">${params.intro}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 24px 28px;color:${TEXT_MUTED};font-size:16px;line-height:1.65;">
                ${params.bodyHtml}
                <div style="text-align:center;margin:28px 0 18px;">
                  <a href="${params.ctaUrl}" style="display:inline-block;background:${accent};color:#ffffff;text-decoration:none;padding:13px 24px;border-radius:10px;font-weight:600;font-size:15px;">
                    ${params.ctaLabel}
                  </a>
                </div>
                <p style="margin:0;font-size:13px;color:#64748B;line-height:1.55;">
                  Si el botón no funciona, copiá y pegá este enlace en tu navegador:<br />
                  <a href="${params.ctaUrl}" style="color:${BRAND_SECONDARY};word-break:break-all;">${params.ctaUrl}</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px 24px 28px;border-top:1px solid #E2E8F0;background:#FBFDFF;color:#64748B;font-size:12px;line-height:1.5;text-align:center;">
                ${footer}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

export async function sendPasswordResetEmail(
  to: string,
  resetToken: string,
  userName: string
): Promise<boolean> {
  const safeName = escapeHtml(userName || "usuario");
  const resetUrl = `${getAppBaseUrl()}/reset-password?token=${resetToken}`;
  const html = buildEmailTemplate({
    preheader: `Recuperación de contraseña de ${APP_NAME}`,
    heading: `Hola ${safeName},`,
    intro: "Recibimos un pedido para restablecer tu contraseña.",
    bodyHtml: `
      <p style="margin:0 0 14px;">Hacé clic en el siguiente botón para crear una nueva contraseña:</p>
      <p style="margin:0 0 6px;font-size:14px;color:#64748B;">Este enlace expirará en 1 hora.</p>
      <p style="margin:0;font-size:14px;color:#64748B;">Si no solicitaste este cambio, podés ignorar este correo.</p>
    `,
    ctaLabel: "Restablecer Contraseña",
    ctaUrl: resetUrl,
  });

  const mailOptions = {
    from: getFromHeader(),
    to,
    subject: `Recuperación de contraseña - ${APP_NAME}`,
    text: `Hola ${userName || "usuario"},\n\nRecibimos un pedido para restablecer tu contraseña en ${APP_NAME}.\n\nUsá este enlace (expira en 1 hora):\n${resetUrl}\n\nSi no solicitaste este cambio, podés ignorar este correo.`,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
