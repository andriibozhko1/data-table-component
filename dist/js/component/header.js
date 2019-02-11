import Debounce from '../utils/debounce.js';

export default class Header {
  constructor({ element }) {
    this.element = element;

    this._render();
    this._addEvents();
  }
  _render() {
    this.element.innerHTML = `
    <span>Show <select class="table__dropDown" data-element="drop-down">
      <option class="table__dropDown-items" value="5">5</option>
      <option class="table__dropDown-items" value="10">10</option>
      <option class="table__dropDown-items" value="20">20</option>
    </select> phones</span>
    <label>Search: <input type="text" class="table__filter" data-element="table-filter" placeholder="Motorola"></input></label>
    `
  }
  _addEvents() {
    let filterField = this.element.querySelector('[data-element="table-filter"]');
    let table = document.querySelector('[data-component="table-list"]')

    let getValueToTableList = (value) => {
      let filterEvent = new CustomEvent('filter', {
        detail: value,
      })

      table.dispatchEvent(filterEvent);
    }
    
    getValueToTableList = Debounce(getValueToTableList, 500);

    filterField.addEventListener('keyup', () => {
      getValueToTableList(filterField.value);
    })
  }
}