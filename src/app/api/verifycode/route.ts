import dbConnect from "@/db";
import UserModel from "@/model/user.model";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const isValidCode = user?.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (!isValidCode || !isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: !isCodeNotExpired
            ? "Verification Code Expired"
            : "Invalid Verification Code",
        },
        { status: 400 }
      );
    }

    user.isVerified = true;

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Verification successful",
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error verifying user:", error);
    return Response.json(
      { success: false, message: "Error verifying user" },
      { status: 500 }
    );
  }
}
