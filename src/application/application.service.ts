import { CaseDto } from './dto/case.dto';
import { Application } from '../db/schema/application.interface';
import * as df from 'durable-functions';
import { Context } from '@azure/functions';
import axios, { Axios } from 'axios';
import { logger } from '../utils/logging-utils';
require('dotenv').config();
import { CosmosClient } from '@azure/cosmos';

export class ApplicationService {
  applicationModel = null;
  httpService: Axios;
  executionContext: Context;
  container = null;
  constructor() {}

  setExecutionContext(executionContext: Context) {
    this.executionContext = executionContext;
  }
  async init() {
    const cosmosClient = new CosmosClient(
      process.env.COSMOSDB_CONNECTION_STRING,
    );
    const { database } = await cosmosClient.databases.createIfNotExists({
      id: 'applications',
    });
    const { container } = await database.containers.createIfNotExists({
      id: 'applications',
      partitionKey: '/case',
    });
    this.container = container;
  }
  async findAll(): Promise<Application[]> {
    return (await this.container.items.readAll().fetchAll()).resources;
  }

  async updateProcessId(id: string, processId: string): Promise<Application> {
    var appl = (await this.container.item(id, '1').read()).resource;
    logger.debug(appl);
    appl.processId = processId;
    await this.container.items.upsert(appl);
    return appl;
  }

  async updateStatusAndCustomerData(
    id: string,
    status: string,
    firstName: string,
    lastName: string,
    pesel: string,
  ): Promise<Application> {
    var appl = (await this.container.item(id, '1').read()).resource;
    appl.status = status;
    appl.customers[0].firstName = firstName;
    appl.customers[0].lastName = lastName;
    appl.customers[0].pesel = pesel;
    await this.container.items.upsert(appl);
    return appl;
  }

  async updateStatusAndAccountNo(
    id: string,
    status: string,
    accountNo: string,
  ): Promise<Application> {
    var appl = (await this.container.item(id, '1').read()).resource;
    appl.status = status;
    appl.accountNo = accountNo;
    await this.container.items.upsert(appl);
    return appl;
  }

  async updateStatus(id: string, status: string): Promise<Application> {
    var appl = (await this.container.item(id, '1').read()).resource;
    appl.status = status;
    await this.container.items.upsert(appl);
    return appl;
  }

  async updateStatusAndFinalizationDate(
    id: string,
    status: string,
  ): Promise<Application> {
    var appl = (await this.container.item(id, '1').read()).resource;
    appl.status = status;
    appl.finalizationDate = new Date();
    await this.container.items.upsert(appl);
    return appl;
  }

  getCustomer(cif: string): Promise<Customer> {
    return new Promise((resolve, reject) => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': '39cf040a24c14e8a8bdefb9df9ad3080',
        };
        axios
          .get('https://am-mocks.azure-api.net/customer?cif=' + cif, {
            headers: headers,
          })
          .then((res) => {
            return resolve(res.data);
          });
      } catch (e) {
        reject(e);
      }
      return null;
    });
  }

  getAccount(cif: string): Promise<Account> {
    return new Promise((resolve, reject) => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': '39cf040a24c14e8a8bdefb9df9ad3080',
        };
        axios
          .get<Account>('https://am-mocks.azure-api.net/account?cif=' + cif, {
            headers: headers,
          })
          .then((res) => {
            resolve(res.data);
          });
      } catch (e) {
        logger.debug(e);
        reject(e);
      }
      return null;
    });
  }

  async insert(caseDto: CaseDto) {
    var appl = {
      case: '1',
      caseType: caseDto.caseType,
      amount: caseDto.amount,
      purpose: caseDto.purpose,
      status: 'NEW',
      registrationDate: new Date(),
      customers: [
        {
          cif: caseDto.customer.cif,
          firstName: null,
          lastName: null,
          pesel: null,
        },
      ],
    };
    var application = (await this.container.items.create(appl)).resource;
    console.log(`'${application.id}' inserted`);
    logger.debug('Application id :' + application.id);
    logger.debug('Application customers :' + application.customers);
    logger.debug('Application amount :' + application.amount);
    const client = df.getClient(this.executionContext);
    const body = {
      id: application.id,
      customers: application.customers,
      amount: application.amount,
    };
    const instanceId = await client.startNew(
      'business-process',
      undefined,
      body,
    );

    //await this.startProcess(application);
    //context.log(`Started orchestration with ID = '${instanceId}'.`);
    this.sendToQueue(application);
    return application.id;
  }

  sendToQueue(application: Application): void {
    logger.debug('Application to send', application);
    this.executionContext.bindings.internalQueue = JSON.stringify(application);
    logger.debug('Message sent to queue', this.executionContext.invocationId);
  }
}
