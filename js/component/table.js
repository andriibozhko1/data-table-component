export default class Table {
  constructor({ element }) {
    this.element = element;

    this._render();
  }
  _render() {
    this.element.innerHTML = `
    <div class="table">
      <div class="table__header" data-component="table-header"></div>
      <div class="table__list" data-component="table-list"></div>
    </div>
    `
  }
}