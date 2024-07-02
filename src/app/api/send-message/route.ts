import dbConnect from "@/db";
import UserModel from "@/model/user.model";
import { Message } from "@/model/user.model";

export async function POST(request: Request) {
  dbConnect();

  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
  
    if (!user) {
      return Response.json(
        {
          success: false,
          messege: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    if(!user.isAcceptingMessages) {
      return Response.json(
        { message: 'User is not accepting messages', success: false },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };

    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      { message: 'Message sent successfully', success: true },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error adding message:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

