import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { dbConnection } from "../config/db.js";
import User from "../models/user.model.js";

dotenv.config();

const createAdmin = async () => {
  await dbConnection();

  const fullName = "admin";
  const email = "krishprajapati22@gnu.ac.in";
  const password = "krish12";
  const role = "admin";

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    console.log(`User already exists with email ${email}. Updating role/password to admin.`);
    existingUser.fullName = fullName;
    existingUser.role = role;
    existingUser.password = await bcrypt.hash(password, 10);
    await existingUser.save();
    console.log("Admin user updated successfully.");
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ fullName, email, password: hashedPassword, role });
    console.log("Admin user created successfully.");
  }

  process.exit(0);
};

createAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
