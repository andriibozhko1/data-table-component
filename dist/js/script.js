import Table from './component/table.js';
import ServerRequest from './component/server-requset.js';
import Header from './component/header.js';
import TableList from './component/table-list.js';

let promise = new ServerRequest();

promise.getAllPhones().then(phones => {
  new TableList({
    element: document.querySelector('[data-component="table-list"'),
    phones: phones,
  })
})
let table = new Table({
  element: document.querySelector('[data-component="table"'),
});
let header = new Header({
  element: document.querySelector('[data-component="table-header"]'),
})
