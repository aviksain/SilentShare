import { getServerSession } from "next-auth/next";
import dbConnect from "@/db";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import ApiResponse from "@/lib/ApiResponse";
import mongoose from "mongoose";

export async function GET(request: Request) {
  dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json({
      success: false,
      message: new ApiResponse(400, {}, "Unauthorized request"),
    });
  }

  try {
    const existingUser = await UserModel.findById(user._id);

    if (!existingUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const messages = await UserModel.aggregate([
      {
        $match: {
          $id: new mongoose.Types.ObjectId(user._id),
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
      {
        $project: {
          messages: 1,
        },
      },
    ]);

    return Response.json(
      { 
        messages: messages[0] 
      },
      {
        status: 200,
      }
    );


  } catch (err) {
    console.error('An unexpected error occurred:', err);
    return Response.json(
      { 
        message: 'Internal server error', 
        success: false 
      },
      { 
        status: 500 
      }
    );
  }
}
