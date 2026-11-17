import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

interface LanplotContactData {
  name: string;
  email: string;
  phone?: string;
  budget?: string;
  message?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Please use POST.',
    });
  }

  try {
    const { name, email, phone, budget, message }: LanplotContactData = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'A valid email address is required.' });
    }

    // Build email content
    const budgetLabel = budget || 'Not specified';
    const phoneLabel = phone || 'Not provided';
    const messageLabel = message?.trim() || 'No message provided';

    const htmlBody = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #b8860b 0%, #d4a843 100%); padding: 32px 24px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: 1px;">
            Spain Hotel Investment Inquiry
          </h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 13px;">
            Lanplot Spain — New Lead
          </p>
        </div>

        <div style="padding: 32px 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 140px;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #333; font-size: 15px; font-weight: 600;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #333; font-size: 15px;">
                <a href="mailto:${escapeHtml(email)}" style="color: #b8860b; text-decoration: none;">${escapeHtml(email)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Phone</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #333; font-size: 15px;">${escapeHtml(phoneLabel)}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Budget</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #333; font-size: 15px; font-weight: 600;">${escapeHtml(budgetLabel)}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Message</td>
              <td style="padding: 12px 0; color: #333; font-size: 15px; line-height: 1.6;">${escapeHtml(messageLabel)}</td>
            </tr>
          </table>
        </div>

        <div style="background: #fafafa; padding: 20px 24px; text-align: center; border-top: 1px solid #f0f0f0;">
          <p style="margin: 0; color: #999; font-size: 11px; letter-spacing: 0.5px;">
            Sent from Lanplot Spain Investment Page &middot; ${new Date().toISOString()}
          </p>
        </div>
      </div>
    `;

    const textBody = `
Spain Hotel Investment Inquiry — New Lead
==========================================

Name:    ${name}
Email:   ${email}
Phone:   ${phoneLabel}
Budget:  ${budgetLabel}

Message:
${messageLabel}

---
Sent from Lanplot Spain Investment Page
${new Date().toISOString()}
    `.trim();

    // Configure SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const recipientEmail = process.env.COMPANY_AGENT_EMAIL || 'ask@rinoproperties.com';

    // Send notification email to the company
    await transporter.sendMail({
      from: `"Rino Invest - Spain" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `🏨 Spain Investment Inquiry — ${name} (${budgetLabel})`,
      text: textBody,
      html: htmlBody,
    });

    // Send confirmation email to the lead
    await transporter.sendMail({
      from: `"Rino Invest Group" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank you for your interest — Rino Invest Group',
      text: `Dear ${name},\n\nThank you for your interest in our exclusive Spain hotel investment opportunity.\n\nA dedicated investment advisor will contact you within 24 hours to arrange a private briefing and share the detailed prospectus.\n\nIf you have any urgent questions, feel free to reach us at:\n📞 +34 635 955 137\n✉️ ask@rinoproperties.com\n\nBest regards,\nRino Invest Group\nC/ Ancha del Carmen, 2 - 29002 Málaga, Spain`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #b8860b 0%, #d4a843 100%); padding: 32px 24px; text-align: center;">
            <h1 style="margin: 0; color: #fff; font-size: 20px; font-weight: 700;">Thank You, ${escapeHtml(name)}</h1>
          </div>
          <div style="padding: 32px 24px; color: #333; font-size: 15px; line-height: 1.7;">
            <p>Thank you for your interest in our exclusive <strong>Spain hotel investment opportunity</strong>.</p>
            <p>A dedicated investment advisor will contact you within <strong>24 hours</strong> to arrange a private briefing and share the detailed prospectus.</p>
            <p>If you have any urgent questions, feel free to reach us at:</p>
            <p>
              📞 <a href="tel:+34635955137" style="color: #b8860b;">+34 635 955 137</a><br/>
              ✉️ <a href="mailto:ask@rinoproperties.com" style="color: #b8860b;">ask@rinoproperties.com</a>
            </p>
            <p style="margin-top: 24px;">Best regards,<br/><strong>Rino Invest Group</strong><br/>
            <span style="color: #999; font-size: 13px;">C/ Ancha del Carmen, 2 - 29002 Málaga, Spain</span></p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your inquiry has been submitted. We will contact you within 24 hours.',
      data: {
        submissionId: `lanplot_${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Lanplot contact form error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again or contact us directly at ask@rinoproperties.com',
    });
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
