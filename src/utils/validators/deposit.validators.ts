import Joi from "joi";

interface IMakeDeposit {
  amount: number;
}

const MakeDepositSchema = Joi.object({
  amount: Joi.number().min(5).valid(5, 10, 20, 50, 100).required(),
});

export const validateMakeDeposit = (data: IMakeDeposit) => {
  let { error, value } = MakeDepositSchema.validate(data);
  return { err: error, value };
};
