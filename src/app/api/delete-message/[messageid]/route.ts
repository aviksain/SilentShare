import dbConnect from '@/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import UserModel from '@/model/user.model';
import {User} from 'next-auth';

export async function DELETE(
  request: Request, 
  { params }: { params: { messageid: string } 
}) {

  await dbConnect();
  const messageid = params.messageid;
  const session = await getServerSession(authOptions);

  const user:User = session?.user;

  if(!session || !user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const updateResult = await UserModel.updateOne(
      { 
        _id: user._id 
      },
      { 
        $pull: { 
          messages: { _id: messageid } 
        } 
      }
    );

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { 
          message: 'Message not found or already deleted', 
          success: false },
        { 
          status: 404 
        }
      );
    }

    return Response.json(
      { message: 'Message deleted', success: true },
      { status: 200 }
    );
  }
  catch(err) {
    console.error('Error deleting message:', err);
    return Response.json(
      { message: 'Error deleting message', success: false },
      { status: 500 }
    );
  }
}












