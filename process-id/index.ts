import { AzureFunction, Context } from '@azure/functions';
import { ApplicationService } from '../src/application/application.service';
import { Application } from 'src/db/schema/application.interface';

var applicationService = null;

const activityFunction: AzureFunction = async function (
  context: Context,
): Promise<string> {
  if (applicationService == null) {
    applicationService = new ApplicationService();
    await applicationService.init();
  }
  applicationService.setExecutionContext(context);
  var appl: Application = await applicationService.updateProcessId(
    context.bindings.context.id,
    context.bindings.context.processId,
  );
  context.bindings.internalQueue = JSON.stringify(appl);
  return `Hello ${context.bindings.name}!`;
};

export default activityFunction;
