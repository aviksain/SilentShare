import dbConnect from "@/db";
import UserModel from "@/model/user.model";
import { z } from "zod";
import { usernameValidation } from "@/Schema/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try { 
    const {searchParams} = new URL(request.url);
    const queryParams = {
      username: searchParams.get('username')
    }

    const res = UsernameQuerySchema.safeParse(queryParams);

    console.log(res);

    if(!res.success) {
      const usernameErrors = res.error.format().username?._errors || [];

      return Response.json({
        success: false,
        message: usernameErrors?.length > 0
        ? usernameErrors.join(', ')
        : 'Invalid query parameters',
      },{status: 400});
    }

    const {username} = res.data;

    const existingUser = await UserModel.findOne({username, isVerified: true});

    if(existingUser) {
      return Response.json({
        success: false,
        message: `${username} username is already taken`
      },{status: 400})
    }

    return Response.json({
      success: true,
      message: "Username is unique"
    },{status: 200});


  }
  catch(err) {
    console.error(err);
    return Response.json({
      success: false,
      message: "Failed to Check Username"
    }, {status: 400});
  }

}



