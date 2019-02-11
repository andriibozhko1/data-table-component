export default class TableList {
  constructor({ element, data, config }) {
    this.element = element;
    this.items = data;
    this.config = config;
    this.paginationId = 0;


    this.items.map(item => {
      item.isChecked = false;
    })
    this.checkAll = false;
    Object.values(this.config).map(config => {
      config.sortTo = 'top'
    })
    this._render();
    this.addEvents();
  }
  _render(id = 0, quantityPhones = 5, itemsList = this.items) {
    let items = [...itemsList];
    let pagination = [];

    items.forEach(() => {
      pagination.push(items.splice(0, quantityPhones));
    });

    pagination.push(items);
    pagination = pagination.filter(arr => arr.length !== 0);

    this.pagination = pagination;
    this.editedPhoneList = itemsList;
    this.quantityPhones = quantityPhones;

    this.element.innerHTML = `
      <table class="table__table">
        <thead>
          <tr class="table__table-header">
            <th class="table__type-of-sort"><label>
                <input data-check-all="${this.checkAll}" type="checkbox" ${this.checkAll ? 'checked' : ''}>
            </th>
            ${Object.keys(this.config).map(items => {

              return `
                <th class="table__type-of-sort"
                  ${this.config[items].isSearchable ? 
                      `data-is-searchable="${items}"`
                    : ''}
                  ${this.config[items].isSortable ? 
                      `data-is-sortable="${items}"`
                    : ''} data-sort-to="${this.config[items].sortTo} 
                    ">
                  ${this.config[items].title}
                </th>
              `
            }).join('')}
          </tr>
        </thead>
        <tbody>
            ${pagination[id] ? pagination[id].map(items => {
              return `
                <tr class="${items.isChecked ? 'table__data-field--active' : ''}" data-item-checked="${items.isChecked}" data-item-id="${items.id}">
                  <td><input type="checkbox" data-is-checked="${items.isChecked}" ${items.isChecked ? 'checked' : ''}></input></td>
                  ${Object.keys(this.config).map(key => {
                    return `
                      <td class="table__data-field">${items[key]}</td>
                    `
                  }).join('')}
                </tr>
              `
            }).join(''): ''}
        </tbody>
      </table>
      <div class="table__footer">
        <div class="table__pagination-navigation">
          <span class="table__pagination-item ${ id === 0 ? "table__pagination-item--hide" : "" }" data-pagination-btns="-1">Prev</span>
            ${pagination
              .map((phones, index) => {
                return `
                  <div class="table__pagination-item ${index === id ? "table__pagination-item--active" : "" }" data-pagination-id="${index}">${index + 1}</div>
                `;
              }).join("")}
            <span class="table__pagination-item ${ id === pagination.length - 1 ? "table__pagination-item--hide" : ""}" data-pagination-btns="1">Next</span>
        </div>
      </div>
    `
  }
  getData() {
    return this.items;
  }
  filter(value) {
    let filteredItems = [];

    Object.keys(this.config).map(config => {
      if(this.config[config].isSearchable) {
        this.items.map(item => {
          if(item[config].toString().toLowerCase().includes(value.toLowerCase())) {
            filteredItems.push(item);
          }
        })
      }
    })

    filteredItems = filteredItems.filter((item, index) => {
      if (filteredItems.indexOf(item) == index) {
        return true;
      }
    });
    this._render(0, this.quantityPhones, filteredItems);
  }

  sort(element,typeOfSort) {
      let sortTo = element.dataset.sortTo.trim();
      
      this.editedPhoneList.sort((a,b) => {
        if(sortTo === 'top') {
          this.config[element.dataset.isSortable].sortTo = 'down';
          return a[typeOfSort] < b[typeOfSort] ? -1 : 1;
        } else {
          this.config[element.dataset.isSortable].sortTo = 'top';
          return a[typeOfSort] < b[typeOfSort] ? 1 : -1;
        }
      })
    this._render(this.paginationId, this.quantityPhones, this.editedPhoneList);
  }

  addEvents() {
    let dropDown = document.querySelector('[data-element="drop-down"]');

    dropDown.addEventListener("change", () => {
      this._render(0, dropDown.value, this.editedPhoneList);
    });

    this.element.addEventListener("filter", data => {
      this.filter(data.detail);
    });

    this.element.addEventListener("click", event => {
      if (event.target.dataset.paginationId) {
        this.paginationId = +event.target.dataset.paginationId;
        this._render(this.paginationId, this.quantityPhones, this.editedPhoneList);
      }
      if (event.target.dataset.paginationBtns) {
        switch (+event.target.dataset.paginationBtns) {
          case 1:
              if (this.paginationId >= this.pagination.length - 1) {
                return;
              }
              this.paginationId += +event.target.dataset.paginationBtns;
              this._render(this.paginationId, this.quantityPhones, this.editedPhoneList);
              break;

          case -1:
            if (this.paginationId <= 0) {
              this.paginationId = 0;
              return;
            }
            this.paginationId += +event.target.dataset.paginationBtns;
            this._render(this.paginationId, this.quantityPhones, this.editedPhoneList);
            break;
        }
      }
      
      if(event.target.dataset.isChecked) {
        let itemId = event.target.closest('[data-item-id]').dataset.itemId;
        this.editedPhoneList.find(item => {
          if(item.id === itemId) {
            item.isChecked = event.target.checked;
          }
        })
        this.checkBoxStatus();
      }

      if(event.target.dataset.checkAll) {
        this.checkAll = event.target.checked;

        this.editedPhoneList.filter(item => {
          if(this.checkAll) {
            item.isChecked = true;
          } else {
            item.isChecked = false;
          }
          this._render(this.paginationId, this.quantityPhones, this.editedPhoneList);
        })
      }
      
      if(event.target.dataset.isSortable) {
        this.sort(event.target, event.target.dataset.isSortable);
      }
    });
  }
  checkBoxStatus() {
    let temp = 0;
    this.editedPhoneList.filter(item => {
      if(temp === this.items.length - 1) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
      if(item.isChecked) {
        temp++;
      }
    })
    this._render(this.paginationId, this.quantityPhones, this.editedPhoneList);
  }
}