import mongoose from "mongoose";
import Jwt from "jsonwebtoken";
import Bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { IProduct } from "./product.model";
const Schema = mongoose.Schema;

export interface IUser {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: string;
  hashPassword: Function;
  comparePassword: Function;
  generateLoginToken: Function;
}

interface IBuyer extends IUser {
  deposits: string[];
  deposit: number;
  role: string;
}

interface ISeller extends IUser {
  products: IProduct[];
  role: string;
}

const baseUserOptions = {
  discriminatorKey: "__type",
  collection: "users",
  timestamps: true,
};

const userSchema = new Schema<IUser>(
  {
    _id: { type: String, default: uuid },
    username: { type: String, unique: true, required: true },
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String, required: true },
  },
  baseUserOptions
);

const buyerSchema = new Schema<IBuyer>({
  deposits: [{ type: String, ref: "Deposit" }],
  role: {
    type: String,
    default: "buyer",
  },
  deposit: { type: Number },
});

const sellerSchema = new Schema<ISeller>({
  products: [{ type: String, ref: "Product" }],
  role: {
    type: String,
    default: "seller",
  },
});

userSchema.methods.generateLoginToken = function generateLoginToken(): string {
  return generateJwtToken(this);
};

function generateJwtToken(record: ISeller | IBuyer): string {
  const options = {
    expiresIn: "6h",
    issuer: "vending-hasher",
  };
  return Jwt.sign(
    {
      _id: record._id,
      role: record.role,
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
