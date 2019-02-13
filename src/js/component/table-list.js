export default class TableList {
  constructor({ element, data, config }) {
    this.element = element;
    this.items = data;
    this.config = config;

    this.paginationInfo = {
      id: 0,
      generalStatusCheckBoxes: false,
      quantityItems: 5,
      data: this.items,
    }

    this.items.map(item => {
      item.isChecked = false;
    })


    Object.values(this.config).map(config => {
      config.sortTo = 'top'
    })

    this._render();
    this.addEvents();
  }

  _getData() {
    return this.items;
  }

  _filter(value) {
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
    this.paginationInfo.data = filteredItems;
    this._render();
  }

  _sort(element,typeOfSort) {
      let sortTo = element.dataset.sortTo.trim();
      
      this.paginationInfo.data.sort((a,b) => {
        if(sortTo === 'top') {
          this.config[element.dataset.isSortable].sortTo = 'down';
          return a[typeOfSort] < b[typeOfSort] ? -1 : 1;
        } else {
          this.config[element.dataset.isSortable].sortTo = 'top';
          return a[typeOfSort] < b[typeOfSort] ? 1 : -1;
        }
      })
    this._render();
  }

  addEvents() {
    let dropDown = document.querySelector('[data-element="drop-down"]');

    dropDown.addEventListener("change", () => {
      this.paginationInfo.quantityItems = dropDown.value;
      this._render();
    });

    this.element.addEventListener("filter", data => {
      this._filter(data.detail);
    });

    this.element.addEventListener("click", event => {
      if (event.target.dataset.paginationId) {
        this.paginationInfo.id = +event.target.dataset.paginationId;
        this._render();
      }
      if (event.target.dataset.paginationBtns) {
        switch (+event.target.dataset.paginationBtns) {
          case 1:
              if (this.paginationInfo.id >= this.pagination.length - 1) {
                return;
              }
              this.paginationInfo.id += +event.target.dataset.paginationBtns;
              this._render();
              break;

          case -1:
            if (this.paginationInfo.id <= 0) {
              this.paginationInfo.id = 0;
              return;
            }
            this.paginationInfo.id += +event.target.dataset.paginationBtns;
            this._render();
            break;
        }
      }
      
      if(event.target.dataset.isChecked) {
        let itemId = event.target.closest('[data-item-id]').dataset.itemId;
        this.paginationInfo.data.find(item => {
          if(item.id === itemId) {
            item.isChecked = event.target.checked;
          }
        })
        this._checkBoxStatus();
      }

      if(event.target.dataset.checkAll) {
        this.paginationInfo.generalStatusCheckBoxes = event.target.checked;

        this.paginationInfo.data.filter(item => {
          if(this.paginationInfo.generalStatusCheckBoxes) {
            item.isChecked = true;
          } else {
            item.isChecked = false;
          }
          this._render();
        })
      }
      
      if(event.target.dataset.isSortable) {
        this._sort(event.target, event.target.dataset.isSortable);
      }
    });
  }

  _checkBoxStatus() {
    let quantityCheckedCheckBoxes = 0;

    this.paginationInfo.data.filter(item => {
      if(quantityCheckedCheckBoxes === this.items.length - 1) {
        this.paginationInfo.generalStatusCheckBoxes = true;
      } else {
        this.paginationInfo.generalStatusCheckBoxes = false;
      }

      if(item.isChecked) {
        quantityCheckedCheckBoxes++;
      }
    })

    this._render();
  }

  _render() {
    if(this.paginationInfo.id > this.paginationInfo.length) {
      this.paginationInfo.id = 0;
    }

    let items = [...this.paginationInfo.data];
    let pagination = [];

    items.forEach(() => {
      pagination.push(items.splice(0, this.paginationInfo.quantityItems));
    });
    pagination.push(items);
    pagination = pagination.filter(arr => arr.length !== 0);

    this.paginationInfo.length = pagination.length,

    this.pagination = pagination;

    console.log(this.paginationInfo)
    this.element.innerHTML = `
      <table class="table__table">
        <thead>
          <tr class="table__table-header">
            <th class="table__type-of-sort"><label>
                <input data-check-all="${this.paginationInfo.generalStatusCheckBoxes}" type="checkbox" ${this.paginationInfo.generalStatusCheckBoxes ? 'checked' : ''}>
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
            ${pagination[this.paginationInfo.id] ? pagination[this.paginationInfo.id].map(items => {
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
            }).join('') : ''}
        </tbody>
      </table>
      <div class="table__footer">
        <div class="table__pagination-navigation">
          <span class="table__pagination-item ${ this.paginationInfo.id === 0 ? "table__pagination-item--hide" : "" }" data-pagination-btns="-1">Prev</span>
            ${pagination
              .map((phones, index) => {
                return `
                  <div class="table__pagination-item ${index === this.paginationInfo.id ? "table__pagination-item--active" : "" }" data-pagination-id="${index}">${index + 1}</div>
                `;
              }).join("")}
            <span class="table__pagination-item ${ this.paginationInfo.id === pagination.length - 1 ? "table__pagination-item--hide" : ""}" data-pagination-btns="1">Next</span>
        </div>
      </div>
    `
  }
}