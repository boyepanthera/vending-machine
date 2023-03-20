import mongoose from "mongoose";
import Jwt from "jsonwebtoken";
import crypto from "crypto";
import Bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { IProduct } from "./product.model";
const Schema = mongoose.Schema;

interface IUser {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  hashPassword: Function;
}

interface IBuyer extends IUser {
  deposits: string;
  depositBalance: number;
}

interface ISeller extends IUser {
  products: IProduct[];
}

const userSchema = new Schema<IUser>(
  {
    _id: { type: String, default: uuid },
    username: { type: String, unique: true, required: true },
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const buyerSchema = new Schema<IBuyer>({
  deposits: { type: String, ref: "Deposit" },
  depositBalance: { type: Number },
});

const sellerSchema = new Schema<ISeller>({
  products: [{ type: String, ref: "Product" }],
});

userSchema.methods.generateLoginToken = function generateLoginToken() {
  return generateJwtToken(this);
};

function generateJwtToken(record: IUser) {
  const options = {
    expiresIn: "6h",
    issuer: "vending-hasher",
  };
  return Jwt.sign(
    {
      _id: record._id,
      email: record.email,
      username: record.username,
    },
    process.env.JWT_SECRET,
    options
  );
}

userSchema.methods.hashPassword = function hashPassword(): void {
  const salt = Bcrypt.genSaltSync(10);
  const hash = Bcrypt.hashSync(this.password, salt);
  this.password = hash;
  return;
};

userSchema.methods.comparePassword = comparePassword;

function comparePassword(plainPassword: string): boolean {
  return Bcrypt.compareSync(plainPassword, this.password);
}

userSchema.methods.generatePasswordResetToken =
  function generatePasswordResetToken(): string {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.passwordResetToken = resetToken;
    this.passwordResetExpiresIn = Date.now() + 900000; //15mins expiration
    this.save();
    return resetToken;
  };

userSchema.pre("save", function (): void {
  if (this.isModified("password")) {
    this.hashPassword();
  }
  return;
});

const User = mongoose.model("User", userSchema);
export const Buyer = User.discriminator("Buyer", buyerSchema);

export const Seller = User.discriminator("Seller", sellerSchema);

export default User;
