const URL = "../api/phones.json";

export default class ServerRequest {
  constructor() {
    this.getAllPhones();
  }

  getAllPhones() {
    return new Promise((resolve, reject) => {
      fetch(URL).then(response => {
        if (response.status !== 200) {
          reject(`${response.status} ${response.statusText}`);
        }
        return response.json();
      }).then(result => {
        resolve(result);
      })
    });
  }
}