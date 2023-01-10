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
  const customer: Customer = await applicationService.getCustomer(
    context.bindings.context.cif,
  );
  var appl: Application = null;
  if (customer.status == 0)
    appl = await applicationService.updateStatusAndCustomerData(
      context.bindings.context.id,
      'CUSTOMER STATUS ERROR',
      customer.firstName,
      customer.lastName,
      customer.pesel,
      context,
    );
  else
    appl = await applicationService.updateStatusAndCustomerData(
      context.bindings.context.id,
      'CUSTOMER STATUS OK',
      customer.firstName,
      customer.lastName,
      customer.pesel,
      context,
    );
  context.bindings.internalQueue = JSON.stringify(appl);
  return customer.status.toString();
};

export default activityFunction;
