// import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/emailTemplate";
import { ApiResponse } from "@/types/ApiResponse";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Silent Share | Verification",
      react: VerificationEmail({username,otp: verifyCode}),
    });

    console.log(data + " " + error);
    return {
      success: true,
      message: "Verification email sent successfully.",
    };
  } catch (err) {
    console.error("Error sending verification email:", err);
    return {
      success: false,
      message: "Failed to send verification email.",
    };
  }
}
