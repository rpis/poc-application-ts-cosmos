import { string } from 'joi';
import * as mongoose from 'mongoose';

export const CustomerSchema = new mongoose.Schema({
  cif: Number,
  firstName: String,
  lastName: String,
  pesel: String,
});

export const ApplicationSchema = new mongoose.Schema({
  caseType: Number,
  amount: Number,
  purpose: String,
  processId: String,
  accountNo: String,
  status: String,
  registrationDate: Date,
  finalizationDate: Date,
  customers: [CustomerSchema],
});
