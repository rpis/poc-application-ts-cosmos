import { AzureFunction, Context } from '@azure/functions';
import { ApplicationService } from '../src/application/application.service';
import { Application } from '../src/db/schema/application.interface';

var applicationService = null;

const activityFunction: AzureFunction = async function (
  context: Context,
): Promise<string> {
  if (applicationService == null) {
    applicationService = new ApplicationService();
    await applicationService.init();
  }
  applicationService.setExecutionContext(context);
  const account: Account = await applicationService.getAccount(
    context.bindings.context.cif,
  );
  const appl: Application = await applicationService.updateStatusAndAccountNo(
    context.bindings.context.id,
    'ACCOUNT FETCHED',
    account.accountNo,
  );
  context.bindings.internalQueue = JSON.stringify(appl);
  return '';
};

export default activityFunction;
