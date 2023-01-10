const Joi = require('joi');

export const customerSchema = Joi.object({
  firstName: Joi.string().alphanum().min(3).max(13).required(),
  lastName: Joi.string().alphanum().min(3).max(15).required(),
  pesel: Joi.string().alphanum().min(3).max(15).required(),
  cif: Joi.string().alphanum().min(3).max(15).required(),
});

export class CustomerDto {
  firstName: string;
  lastName: string;
  pesel: string;
  cif: string;
}
