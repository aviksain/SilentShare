import mongoose from "mongoose";
import { Schema } from "zod";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

const dbConnect = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log("DATABASE Already Connected");
    return;
  }

  try {
    const response = await mongoose.connect(process.env.MONGODB_URL || "");
    connection.isConnected = response.connections[0].readyState;

    console.log('DATABASE connected successfully');
  }
  catch(err) {
    console.error('DATABASE connection failed:', err);
    process.exit(1);
  }
};
