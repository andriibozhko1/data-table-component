export default class TableList {
  constructor({ element, phones }) {
    this.element = element;
    this.phones = phones;

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
          <th class="table__type-of-sort" data-sort-by="name">Name</th>
          <th class="table__type-of-sort" data-sort-by="age">ID</th>
        </tr>
        ${pagination[id] !== undefined ? pagination[id]
          .map(phone => {
            return `
          <tr>
            <td class="table__type-of-sort" value="name"><input class="table__items-field" type="text" value="${
              phone.name
            }"></input></td>
            <td class="table__type-of-sort" value="name">${phone.age}</td>
          </tr>
            `;
          })
          .join("") : ''}
    </table>
    </div>
    <div class="table__footer">
        <div class="table__pagination-navigation">
          <span class="table__pagination-item ${id === 0 ? 'table__pagination-item--hide' : ''}" data-pagination-btns="-1">Prev</span>
            ${pagination
              .map((phones, index) => {
                return `
                  <div class="table__pagination-item ${index === id ? 'table__pagination-item--active' : ''}" data-pagination-id="${index}">${index +
                  1}</div>
                `;
              })
              .join("")}
            <span class="table__pagination-item ${id === this.pagination.length - 1 ? 'table__pagination-item--hide' : ''}" data-pagination-btns="1">Next</span>
          </div>
    </div>
    `;
  }

  filter(value) {
    let filteredArr = [];

    this.phones.filter(phone => {
      if (phone.name.toLowerCase().includes(value.toLowerCase())) {
        filteredArr.push(phone);
      }
    });
    this._render(0, this.quantityPhones, filteredArr)
  }

  sorting(fieldName) {
    this.phones = this.phones.sort((a, b) =>
      a[fieldName] < b[fieldName] ? -1 : 1
    );
    this._render(0, this.quantityPhones);
  }

  addEvents() {
    let dropDown = document.querySelector('[data-element="drop-down"]');
    let id = 0;

    this.element.addEventListener("filter", data => {
      this.filter(data.detail);
    });

    this.element.addEventListener("click", event => {
      if (event.target.dataset.sortBy) {
        let typeOfSort = event.target.dataset.sortBy;
        this.sorting(typeOfSort);
      }

      if (event.target.dataset.paginationId) {
        id = +event.target.dataset.paginationId;
        this._render(id,this.quantityPhones, this.editedPhoneList);
      }

      if (event.target.dataset.paginationBtns) {
        switch (+event.target.dataset.paginationBtns) {
          case 1:
            if (id >= this.pagination.length - 1) {
              return;
            }
            id += +event.target.dataset.paginationBtns;
            this._render(id,this.quantityPhones, this.editedPhoneList);
            break;

          case -1:
            if (id <= 0) {
              id = 0;
              return;
            }
            id += +event.target.dataset.paginationBtns;
            this._render(id,this.quantityPhones, this.editedPhoneList);
            break;
        }
      }
    });

    dropDown.addEventListener("change", () => {
      this._render(0, dropDown.value,this.editedPhoneList);
    });
  }
}
