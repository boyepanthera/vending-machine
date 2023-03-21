import Joi from "joi";

interface ICreateUser {
  firstName: string;
  lastName: string;
  password: string;
  username: string;
  role: string;
}

const CreateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(40),
  lastName: Joi.string().min(2).max(40),
  username: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().valid("buyer", "seller"),
});

const UpdateUserSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
});

export const validateCreateUser = (data: ICreateUser) => {
  let { error, value } = CreateUserSchema.validate(data);
  return { err: error, value };
};

export const validateUpdateUser = (data: ICreateUser) => {
  let { error, value } = UpdateUserSchema.validate(data);
  return { err: error, value };
};
