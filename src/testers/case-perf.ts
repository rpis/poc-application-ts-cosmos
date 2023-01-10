import axios from 'axios';
import { firstValueFrom, map } from 'rxjs';

const BASE_URL = 'https://spls1neuafagenerigene001.azurewebsites.net/api';

function sleep(delay): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function sendApplication(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      axios
        .post<any>(BASE_URL + '/applications/test', data, {
          headers: headers,
        })
        .then((response) => {
          return resolve(response.data);
        });
    } catch (e) {
      console.error(e);
    }
  });
}
(async () => {
  var startTime = performance.now();
  for (let i = 1000; i < 1010; i++) {
    const message = {
      caseType: 1,
      purpose: 10,
      amount: 999.99,
      customer: {
        cif: i.toString(),
        firstName: 'Aleksander',
        lastName: 'Iksinski',
        pesel: '90909090908',
      },
    };
    //console.log('Sending message ', message);
    var startTime = performance.now();
    //console.log('out :', await sendApplication(message));
    await sendApplication(message);
    var endTime = performance.now();
    console.log(`Call took ${endTime - startTime} milliseconds`);
    await sleep(1000);
  }
})().catch((e) => {
  console.error(e);
});
