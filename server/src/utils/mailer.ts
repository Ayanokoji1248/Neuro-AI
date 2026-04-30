import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js";
import dotenv from "dotenv"
dotenv.config()

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const smtpHost = process.env.SMTP_HOST ?? "smtp.gmail.com";
const smtpPort = Number(process.env.SMTP_PORT ?? 587);
const smtpSecure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === "true"
    : smtpPort === 465;

if (!emailUser || !emailPass) {
    throw new Error("EMAIL_USER and EMAIL_PASS must be set before starting the server");
}

const mailOptions: SMTPTransport.Options = {
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
        user: emailUser,
        pass: emailPass,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
};

const transporter = nodemailer.createTransport(mailOptions);

// Verify connection once at startup
transporter.verify((error: Error | null, success: boolean) => {
    if (error) {
        console.log("Mail server error:", error);
    } else {
        console.log("Mail server ready");
    }
});

export const sendOtpEmail = async (email: string, otp: string) => {
    await transporter.sendMail({
        from: `"Your App" <${emailUser}>`,
        to: email,
        subject: "Your Login OTP",
        html: `
  <div style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">
          
          <table width="420" cellpadding="0" cellspacing="0" 
            style="background:#ffffff;border-radius:12px;padding:32px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
            
            <tr>
              <td>
                <h2 style="margin:0 0 16px;font-size:20px;color:#111827;">
                  Login Verification
                </h2>
              </td>
            </tr>

            <tr>
              <td>
                <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">
                  Use the code below to complete your login.
                </p>
              </td>
            </tr>

            <tr>
              <td>
                <div style="
                  display:inline-block;
                  padding:14px 24px;
                  font-size:28px;
                  font-weight:bold;
                  letter-spacing:8px;
                  background:#f3f4f6;
                  border-radius:10px;
                  color:#111827;
                ">
                  ${otp}
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;">
                  This code will expire in 5 minutes.
                </p>
              </td>
            </tr>

            <tr>
              <td>
                <p style="margin:16px 0 0;font-size:12px;color:#9ca3af;">
                  If you didn’t request this, you can safely ignore this email.
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </div>
`
    });
};
