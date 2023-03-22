import { v4 as uuid } from "uuid";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface ISales {
  _id: string;
  product: string;
  buyerId: string;
  amount: number;
}

const saleSchema = new Schema<ISales>(
  {
    _id: { type: String, default: uuid },
    product: { type: String, ref: "Product" },
    buyerId: { type: String, ref: "Seller" },
    amount: Number,
  },
  { timestamps: true }
);

const Sale = mongoose.model<ISales>("Sales", saleSchema);
export default Sale;
