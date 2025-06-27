import { ServerClient } from "postmark";

const client = new ServerClient(process.env.POSTMARK_API_TOKEN!);

export async function sendVerificationEmail({
  to,
  verificationUrl,
}: {
  to: string;
  verificationUrl: string;
}) {
  await client.sendEmail({
    From: process.env.POSTMARK_FROM_EMAIL!,
    To: to,
    Subject: "Verify your email address",
    HtmlBody: `
      <p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
      <p><a href="${verificationUrl}">${verificationUrl}</a></p>
    `,
    TextBody: `Thank you for signing up! Verify your email: ${verificationUrl}`,
    MessageStream: "outbound",
  });
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: {
  to: string;
  resetUrl: string;
}) {
  await client.sendEmail({
    From: process.env.POSTMARK_FROM_EMAIL!,
    To: to,
    Subject: "Password Reset Request",
    HtmlBody: `
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you didn't request this, you can ignore this email.</p>
    `,
    TextBody: `Reset your password: ${resetUrl}`,
    MessageStream: "outbound",
  });
}
