import { Customer } from '../src/db/schema/application.interface';
import * as df from 'durable-functions';
const moment = require('moment');

class Ctx {
  id: string;
  customers: Customer[];
  cif: string;
  amount: number;
}

const orchestrator = df.orchestrator(function* (context) {
  const outputs = [];

  const firstRetryIntervalInMilliseconds = 30000;
  const maxNumberOfAttempts = 10;

  const retryOptions: df.RetryOptions = new df.RetryOptions(
    firstRetryIntervalInMilliseconds,
    maxNumberOfAttempts,
  );
  outputs.push(
    yield context.df.callActivityWithRetry('process-id', retryOptions, {
      id: context.df.getInput<Ctx>().id,
      processId: context.df.instanceId,
    }),
  );
  outputs.push(
    yield context.df.callActivityWithRetry('check-customer', retryOptions, {
      id: context.df.getInput<Ctx>().id,
      cif: context.df.getInput<Ctx>().customers[0].cif,
    }),
  );

  if (outputs[1] == '0') console.log('Execution in customer error state!');
  if (outputs[1] == '1') {
    outputs.push(
      yield context.df.callActivityWithRetry('get-account-no', retryOptions, {
        id: context.df.getInput<Ctx>().id,
        cif: context.df.getInput<Ctx>().customers[0].cif,
      }),
    );
    // temporarty for test only
    outputs.push(
      yield context.df.callActivityWithRetry(
        'mark-send-to-decision',
        retryOptions,
        {
          id: context.df.getInput<Ctx>().id,
          cif: context.df.getInput<Ctx>().customers[0].cif,
        },
      ),
    );
    if (context.df.getInput<Ctx>().amount > 1000) {
      outputs.push(
        yield context.df.callActivityWithRetry(
          'mark-send-to-decision',
          retryOptions,
          {
            id: context.df.getInput<Ctx>().id,
            cif: context.df.getInput<Ctx>().customers[0].cif,
          },
        ),
      );
      const dueTime = moment.utc(context.df.currentUtcDateTime).add(1, 'h');
      const durableTimeout = context.df.createTimer(dueTime.toDate());

      const approvalEvent = context.df.waitForExternalEvent('ApprovalEvent');
      if (
        approvalEvent ===
        (yield context.df.Task.any([approvalEvent, durableTimeout]))
      ) {
        durableTimeout.cancel();
        console.log('executed: ' + JSON.stringify(approvalEvent.result));
        var result: any = approvalEvent.result;
        if (result.decision == 'OK') {
          outputs.push(
            yield context.df.callActivityWithRetry('finalize', retryOptions, {
              id: context.df.getInput<Ctx>().id,
              amount: context.df.getInput<Ctx>().amount,
              accountNo: outputs[2],
            }),
          );
        } else {
          outputs.push(
            yield context.df.callActivityWithRetry('reject', retryOptions, {
              id: context.df.getInput<Ctx>().id,
              amount: context.df.getInput<Ctx>().amount,
              accountNo: outputs[2],
            }),
          );
        }
      } else {
        console.log('executed timeouted!');
      }
    } else {
      outputs.push(
        yield context.df.callActivityWithRetry('finalize', retryOptions, {
          id: context.df.getInput<Ctx>().id,
          amount: context.df.getInput<Ctx>().amount,
          accountNo: outputs[2],
        }),
      );
    }
  } else {
    outputs.push(
      yield context.df.callActivityWithRetry(
        'reject-customer-status',
        retryOptions,
        {
          id: context.df.getInput<Ctx>().id,
          amount: context.df.getInput<Ctx>().amount,
          accountNo: outputs[2],
        },
      ),
    );
  }

  //console.log('timer start');
  //const nextCheck = moment.utc(context.df.currentUtcDateTime).add(60, 's');
  //yield context.df.createTimer(nextCheck.toDate());
  //console.log('timer end');

  return outputs;
});

export default orchestrator;
