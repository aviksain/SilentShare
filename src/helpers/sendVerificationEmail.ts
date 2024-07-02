import nodemailer from 'nodemailer';
import { ApiResponse } from '@/types/ApiResponse';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});


export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const info = await transporter.sendMail({
      from: `<${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: 'Silent Share | Verification',
      html: `  <h1>Hi ${username},</h1>
      <p>Thank you for registering. Please use the following verification
        code to complete your registration: <b>${verifyCode}</b></p>
      <p>If you did not request this code, please ignore this email.</p>`,
    });

    console.log(info.messageId);

    return {
      success: true,
      message: 'Verification email sent successfully.',
    };
  } catch (err) {
    console.error('Error sending verification email:', err);
    return {
      success: false,
      message: 'Failed to send verification email.',
    };
  }
}
