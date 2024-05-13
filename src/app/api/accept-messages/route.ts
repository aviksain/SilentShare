import { getServerSession } from "next-auth/next";
import dbConnect from "@/db";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import ApiResponse from "@/lib/ApiResponse";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json({
      success: false,
      message: new ApiResponse(400, {}, "Unauthorized request"),
    });
  }

  const userId = user._id;
  const { acceptingMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptingMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: new ApiResponse(
            404,
            {},
            "Unable to find user to update message acceptance status"
          ),
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: new ApiResponse(
          404,
          {},
          "Message acceptance status updated successfully"
        ),
        updatedUser,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error retrieving message acceptance status:", err);
    return Response.json(
      { success: false, message: "Error retrieving message acceptance status" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  try {
    const foundUser = await UserModel.findById(user?._id);

    if (!foundUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving message acceptance status:", error);
    return Response.json(
      { success: false, message: "Error retrieving message acceptance status" },
      { status: 500 }
    );
  }
}
