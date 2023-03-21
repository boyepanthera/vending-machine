import Joi from "joi";

interface IMakeDeposit {
  amount: number;
}

const MakeDepositSchema = Joi.object({
  amount: Joi.number().min(1).required(),
});

export const validateMakeDeposit = (data: IMakeDeposit) => {
  let { error, value } = MakeDepositSchema.validate(data);
  return { err: error, value };
};
