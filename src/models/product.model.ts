import { v4 as uuid } from "uuid";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface IProduct {
  _id: string;
  name: string;
  quantityAvailable: number;
}

const productSchema = new Schema<IProduct>(
  {
    _id: { type: String, default: uuid },
    name: { type: String, unique: true, required: true },
    quantityAvailable: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
