import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.MAIL_FROM;
const fromName = process.env.MAIL_FROM_NAME ?? "Neuro AI";

if (!apiKey) {
  throw new Error("SENDGRID_API_KEY must be set before starting the server");
}

if (!fromEmail) {
  throw new Error("MAIL_FROM must be set before starting the server");
}

sgMail.setApiKey(apiKey);

console.log("SendGrid mail client initialized");

export const sendOtpEmail = async (email: string, otp: string) => {
  const msg = {
    to: email,
    from: {
      email: fromEmail,
      name: fromName,
    },
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
                ">${otp}</div>
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
                  If you did not request this, you can safely ignore this email.
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </div>
`,
  };

  await sgMail.send(msg).catch((error) => {
    if (error.response) {
      console.error("SendGrid error status:", error.code);
      console.error("SendGrid error body:", JSON.stringify(error.response.body, null, 2));
    }
    throw error;
  });
};
