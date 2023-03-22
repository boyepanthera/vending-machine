import Joi from "joi";

interface IBuy {
  amount: number;
  productId: string;
}

const BuySchema = Joi.object({
  amount: Joi.number().min(1).required(),
  productId: Joi.string().required(),
});

export const validateBuy = (data: IBuy) => {
  let { error, value } = BuySchema.validate(data);
  return { err: error, value };
};
