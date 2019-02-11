import ServerRequest from './component/server-requset.js';
import DataTable from './component/table.js';

let promise = new ServerRequest();

promise.getAllPhones().then((phones) => {
  new DataTable({
    element: document.querySelector('[data-component="table"]'),
    data: phones,

    columnConfig: {
      name: {
        title: 'Название', 
        isSortable: true, 
        isSearchable: true,
      },
      age: {
        title: 'Возраст',
        isSortable: true, 
      },
      snippet: { 
        title: 'Описание',
        isSearchable: true,
      }
    }
  })
})