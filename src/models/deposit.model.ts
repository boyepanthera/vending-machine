import { v4 as uuid } from "uuid";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface IDeposit {
  _id: string;
  amount: number;
  depositor: string;
}

const depositSchema = new Schema<IDeposit>(
  {
    _id: { type: String, default: uuid },
    amount: { type: Number, unique: true, required: true },
    depositor: { type: String },
  },
  { timestamps: true }
);

const Deposit = mongoose.model<IDeposit>("Deposit", depositSchema);
export default Deposit;
