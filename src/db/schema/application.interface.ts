import { Document } from 'mongoose';

export interface Customer extends Document {
  cif: Number;
  firstName: String;
  lastName: String;
  pesel: String;
}

export interface Application extends Document {
  type: Number;
  amount: Number;
  customers: Customer[];
  processId: string;
  accountNo: string;
  status: string;
  registrationDate: Date;
  finalizationDate: Date;
}
