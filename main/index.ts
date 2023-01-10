import { Context, HttpRequest } from '@azure/functions';
import { logger } from '../src/utils/logging-utils';
import { ApplicationService } from '../src/application/application.service';

var applicationService = null;

export async function run(context: Context, req: HttpRequest): Promise<void> {
  if (applicationService == null) {
    applicationService = new ApplicationService();
    await applicationService.init();
  }
  context.done = () => {};
  if (req.method === 'POST') {
    try {
      applicationService.setExecutionContext(context);
      var id = await applicationService.insert(req.body);
      context.res = {
        body: { id: id },
      };
      return;
    } catch (e) {
      logger.debug(e);
      context.res = {
        status: 500,
        body: { e: e.message },
      };
    }
  }
  if (req.method === 'GET') {
    applicationService.setExecutionContext(context);
    logger.debug(await applicationService.findAll());
    context.res.status(200).body('Hello!');
    return;
  }
  context.done();
  return;
}
