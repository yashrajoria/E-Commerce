import { StoreUsers } from "@/models/StoreUsers";
import bcrypt from "bcrypt";
import { mongooseConnect } from "./mongoose";

export async function verifyUserCredentials(email, password) {
  await mongooseConnect();
  const user = await StoreUsers.findOne({ email });
  console.log("AUTH", user);
  if (user && bcrypt.compareSync(password, user.password)) {
    // If the user is valid, return user details
    return { id: user.user_id, email: user.email, name: user.full_name };
  }

  // If invalid credentials
  return null;
}
