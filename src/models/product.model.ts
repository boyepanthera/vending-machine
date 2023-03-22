import { v4 as uuid } from "uuid";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface IProduct {
  _id: string;
  productName: string;
  amountAvailable: number;
  sellerId: string;
  cost: number;
  deductQuantity: Function;
}

const productSchema = new Schema<IProduct>(
  {
    _id: { type: String, default: uuid },
    productName: { type: String, unique: true, required: true },
    amountAvailable: { type: Number, default: 5 },
    sellerId: { type: String, ref: "Seller" },
    cost: { type: Number },
  },
  { timestamps: true }
);

productSchema.methods.deductQuantity = function (quantity: number): void {
  this.amountAvailable = this.amountAvailable - quantity;
  this.save();
  return;
};

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;
