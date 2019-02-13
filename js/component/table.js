import Header from './header.js'
import TableList from './table-list.js'

export default class DataTable {
  constructor({ element , data, columnConfig}) {
    this.element = element;
    this.data = data;
    this.config = columnConfig;
    this._render();
  }
  _render() {
    this.element.innerHTML = `
      <div class="table">
        <div class="table__header" data-component="table-header"></div>
        <div class="table__list" data-component="table-list"></div>
       </div>
    `;
    new Header({
      element: document.querySelector('[data-component="table-header"]'),
    });
    new TableList({
      element: document.querySelector('[data-component="table-list"]'),
      data: this.data,
      config: this.config,
    })
  }
}