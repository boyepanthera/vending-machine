import Joi from "joi";

interface ICreateProduct {
  productName: string;
  amountAvailable: number;
  cost: number;
}

const CreateProductSchema = Joi.object({
  productName: Joi.string().min(2).max(40).required(),
  amountAvailable: Joi.string().min(2).max(40).required(),
  cost: Joi.number().multiple(5).required(),
});

const UpdateProductSchema = Joi.object({
  productName: Joi.string().min(2).max(40),
  amountAvailable: Joi.string().min(2).max(40),
  cost: Joi.number().multiple(5),
});

export const validateCreateProduct = (data: ICreateProduct) => {
  let { error, value } = CreateProductSchema.validate(data);
  return { err: error, value };
};

export const validateUpdateProduct = (data: ICreateProduct) => {
  let { error, value } = UpdateProductSchema.validate(data);
  return { err: error, value };
};
