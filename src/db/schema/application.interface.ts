export interface Customer {
  cif: Number;
  firstName: String;
  lastName: String;
  pesel: String;
}

export interface Application {
  type: Number;
  amount: Number;
  customers: Customer[];
  processId: string;
  accountNo: string;
  status: string;
  registrationDate: Date;
  finalizationDate: Date;
}
