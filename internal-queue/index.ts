import { AzureFunction, Context } from '@azure/functions';
import { Application } from 'src/db/schema/application.interface';

const queueTrigger: AzureFunction = async function (
  context: Context,
  appl: Application,
): Promise<void> {
  const out: any = {
    caseId: appl._id,
    caseType: 'DPPL1',
    amount: appl.amount,
    status: appl.status,
    registrationDate: appl.registrationDate,
    finalizationDate: appl.finalizationDate,
    sendDate: new Date(),
    processId: appl.processId,
    accountNo: appl.accountNo,
    customers: appl.customers,
  };
  // send to registry
  context.bindings.outputQueueItem = JSON.stringify(out);
};

export default queueTrigger;
