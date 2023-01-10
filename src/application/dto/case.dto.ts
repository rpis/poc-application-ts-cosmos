import { CustomerDto, customerSchema } from './customer.dto.';

const Joi = require('joi');

export const caseSchema = Joi.object({
  purpose: Joi.number().integer().min(1).max(10).required(),
  caseType: Joi.number().integer().min(1).max(10).required(),
  amount: Joi.number().min(100).max(100000000).required(),
  customer: customerSchema,
});

export class CaseDto {
  caseType: number;
  amount: number;
  purpose: number;
  customer: CustomerDto;
}
