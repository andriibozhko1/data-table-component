export default class TableList {
  constructor({ element, data, columnConfig }) {
    this.element = element;
    this.phones = data;

    this.phones.map(phone => {
      phone.isChecked = false;
    })

    this.generalStatusCheckbox = false;
    this.columnConfig = columnConfig;

    this._render();
    this.addEvents();
  }
  _render(id = 0, quantityPhones = 5, phonesList = this.phones) {
    let phones = [...phonesList];
    let pagination = [];

    phones.forEach(() => {
      pagination.push(phones.splice(0, quantityPhones));
    });

    pagination.push(phones);
    pagination = pagination.filter(arr => arr.length !== 0);

    this.pagination = pagination;
    this.editedPhoneList = phonesList;
    this.quantityPhones = quantityPhones;

    this.element.innerHTML = `
    <table class="table__table">
          <tr class="table__table-header">
          <td data-check-all="false"><input type="checkbox" ${this.generalStatusCheckbox ? 'checked' : ''}></input</td>
          ${Object.keys(this.columnConfig)
            .map(typeOfSort => {
              return `
              <th class="table__type-of-sort" 
                data-sort-by="${typeOfSort}" 
                data-is-sortable="${this.columnConfig[typeOfSort].isSortable}" 
                data-is-searchable="${this.columnConfig[typeOfSort].isSearchable}"
                data-sort-to="up"
                >
                ${this.columnConfig[typeOfSort].title}
              </th>
            `;
            })
            .join("")}
        </tr>
        ${
          pagination[id] !== undefined
            ? pagination[id]
                .map(phone => {
                  return `
                  <tr>
                    <td data-item-id="${phone.id}" data-check-item="${phone.isChecked}"><input type="checkbox" ${phone.isChecked ? 'checked' : ''}></input</td>
                      ${Object.keys(this.columnConfig)
                        .map(value => {
                          return `
                            <td class="table__type-of-sort"  data-items-id="${phone.id}">
                              <div class="table__data-field" data-items-type="${value}" data-items-value="${phone[value]}">
                                ${phone[value]}
                              </div>
                            </td>`
                        })
                        .join("")}
                  </tr>
                    `;
                }).join("")  : ""}
            </table>
            </div>
              <div class="table__footer">
                  <div class="table__pagination-navigation">
                    <span class="table__pagination-item ${
                      id === 0 ? "table__pagination-item--hide" : ""
                    }" data-pagination-btns="-1">Prev</span>
                      ${pagination
                        .map((phones, index) => {
                          return `
                            <div class="table__pagination-item ${
                              index === id
                                ? "table__pagination-item--active"
                                : ""
                            }" data-pagination-id="${index}">${index + 1}</div>
                          `;
                        })
                        .join("")}
                      <span class="table__pagination-item ${
                        id === this.pagination.length - 1
                          ? "table__pagination-item--hide"
                          : ""
                      }" data-pagination-btns="1">Next</span>
                    </div>
              </div>
    `;
  }

  filter(value) {
    let filteredArr = [];
    Object.keys(this.columnConfig).filter(typeSort => {
      if (this.columnConfig[typeSort].isSearchable === true) {
        this.phones.filter(phone => {
          if (typeof phone[typeSort] === "number") {
            if (phone[typeSort] === +value) {
              filteredArr.push(phone);
            }
          } else {
            if (phone[typeSort].toLowerCase().includes(value.toLowerCase())) {
              filteredArr.push(phone);
            }
          }
        });
      }
    });

    this._render(0, this.quantityPhones, filteredArr);
  }

  sorting(fieldName) {
    this.phones = this.phones.sort((a, b) => a[fieldName] < b[fieldName] ? -1 : 1);
    this._render(0, this.quantityPhones, this.phones);
    
  }


  addEvents() {
    let dropDown = document.querySelector('[data-element="drop-down"]');
    let id = 0;

    this.element.addEventListener("filter", data => {
      this.filter(data.detail);
    });

    dropDown.addEventListener("change", () => {
      this._render(0, dropDown.value, this.editedPhoneList);
    });

    this.element.addEventListener("click", event => {
      if (event.target.dataset.isSortable === "true") {
        let typeOfSort = event.target.dataset.sortBy;
        this.sorting(typeOfSort);
      }

      // PAGINATION SETTINGS

      if (event.target.dataset.paginationId) {
        id = +event.target.dataset.paginationId;
        this._render(id, this.quantityPhones, this.editedPhoneList);
      }

      if (event.target.dataset.paginationBtns) {
        switch (+event.target.dataset.paginationBtns) {
          case 1:
            if (id >= this.pagination.length - 1) {
              return;
            }
            id += +event.target.dataset.paginationBtns;
            this._render(id, this.quantityPhones, this.editedPhoneList);
            break;

          case -1:
            if (id <= 0) {
              id = 0;
              return;
            }
            id += +event.target.dataset.paginationBtns;
            this._render(id, this.quantityPhones, this.editedPhoneList);
            break;
        }
      }

      this.checkAllItems(event.target,id)

      if(event.target.closest('[data-check-item]')) {
        if(event.target.checked) {
          this.phones.find(phone => phone.id === event.target.closest('[data-check-item]').dataset.itemId ? phone.isChecked = true : '');
          this._render(id, this.quantityPhones, this.editedPhoneList);
          console.log(this.getSelected());
        } else {
          this.phones.find(phone => phone.id === event.target.closest('[data-check-item]').dataset.itemId ? phone.isChecked = false : '');
          this.generalStatusCheckbox = false;
          this._render(id, this.quantityPhones, this.editedPhoneList);
          console.log(this.getSelected());
        }
      }
    });
  }
  checkAllItems(element, id) {
    if(element.closest('[data-check-all]')) {
      if(element.checked) {
        this.generalStatusCheckbox = true;
        this.phones.map(phone => phone.isChecked = true);
        this._render(id, this.quantityPhones, this.editedPhoneList);
        console.log(this.getSelected());
      } else {
        this.generalStatusCheckbox = false;
        this.phones.map(phone => phone.isChecked = false);
        this._render(id, this.quantityPhones, this.editedPhoneList);
      }
    }
  }
  getSelected() {
    let selectedItem = this.phones.filter(item => item.isChecked ? item : '')
    return selectedItem;
  }
  getData() {
    return this.phones;
  }
}
