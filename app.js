// Storage Controller
const StorageCtrl = (function () {
  // Public methods
  return {
    storeItem: function (item) {
      let items = [];

      // Check if any items in local storage
      if (localStorage.getItem("items") === null) {
        // Push new item
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        // Push new item
        items.push(item);
        // Reset local storage
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItems: function () {
      let items;

      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }

      return items;
    },
    updateItems: function (items) {
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearAllItems: function () {
      localStorage.removeItem("items");
    },
  };
})();

// Item Controller
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  const data = {
    items: StorageCtrl.getItems(),
    currentItem: null,
    totalCalories: 0,
  };

  // Public methods
  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      // Create id
      let ID;

      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      const newItem = new Item(ID, name, calories);
      // Add to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function (id) {
      let found = null;
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function (name, calories) {
      // Calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },
    deleteItem: function (id) {
      // Get ids
      const ids = data.items.map(function (item) {
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove Item
      data.items.splice(index, 1);
    },
    clearAllItems: function () {
      data.items = [];
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    getTotalCalories: function () {
      let totalCalories = 0;

      // Loop throught items and add calories
      data.items.forEach(function (item) {
        totalCalories += item.calories;
      });

      // Set total calories in data structure
      data.totalCalories = totalCalories;

      // Return total calories
      return data.totalCalories;
    },
    logData: function () {
      return data;
    },
  };
})();

// UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    clearBtn: ".clear-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
  };

  // Public methods
  return {
    populateItemList: function (items) {
      let html = "";
      items.forEach(function (item) {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="fa fa-pencil edit-item"></i>
        </a>
      </li>`;
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    addListItem: function (item) {
      // Show list
      document.querySelector(UISelectors.itemList).style.display = "block";
      const li = document.createElement("li");
      // Add class
      li.className = "collection-item";
      // Add id
      li.id = `item-${item.id}`;
      // Add html
      li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
        <i class="fa fa-pencil edit-item"></i>
        </a>
      `;
      // Insert item
      document.querySelector(UISelectors.itemList).appendChild(li);
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      listItems.forEach(function (listItem) {
        const id = listItem.getAttribute("id");

        if (id === `item-${item.id}`) {
          document.querySelector(`#item-${item.id}`).innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
            <i class="fa fa-pencil edit-item"></i>
            </a>
          `;
        }
      });
    },
    deleteListItem: function (id) {
      const itemID = `item-${id}`;
      const listItem = document.querySelector(`#${itemID}`);
      listItem.remove();
    },
    getSelectors: function () {
      return UISelectors;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent =
        totalCalories;
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    clearListItems: function () {
      const itemList = document.querySelector(UISelectors.itemList);

      while (itemList.firstElementChild) {
        itemList.firstElementChild.remove();
      }
    },
    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value =
        ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value =
        ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
  };
})();

// App Controller
const App = (function (ItemCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function () {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // Disable submit on enter
    document.addEventListener("keypress", function (e) {
      if (e.key === "Enter" || e.keyCode === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // Update item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    // Back button event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", function (e) {
        e.preventDefault();
        UICtrl.clearEditState();
      });

    // Delete item event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // Clear item event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", itemClearAllSubmit);
  };

  // Update item submit
  const itemEditClick = function (e) {
    e.preventDefault();

    if (e.target.classList.contains("edit-item")) {
      // Get list item id
      const listId = e.target.parentNode.parentNode.id;

      // Break into an array
      const listIdArr = listId.split("-");

      // Get the actual id
      const id = parseInt(listIdArr[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);
      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }
  };

  // Clear all items submit
  const itemClearAllSubmit = function () {
    // Remove all data
    ItemCtrl.clearAllItems();

    // Remove Current item
    if (ItemCtrl.getCurrentItem()) {
      ItemCtrl.setCurrentItem = null;
    }

    // Remove all list items from the UI
    UICtrl.clearListItems();

    // Hide list
    UICtrl.hideList();

    // Reset Calories to 0
    UICtrl.showTotalCalories(0);

    // Clear items from LS
    StorageCtrl.clearAllItems();
  };

  // Add item submit
  const itemAddSubmit = function (e) {
    e.preventDefault();
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calories input
    if (input.name !== "" && input.calories !== "") {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);

      // Store in local storage
      StorageCtrl.storeItem(newItem);

      // Clear fields
      UICtrl.clearInput();
    }
  };

  const itemUpdateSubmit = function (e) {
    e.preventDefault();

    // Get item input
    const input = UICtrl.getItemInput();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to the UI
    UICtrl.showTotalCalories(totalCalories);

    // Update data to LS
    StorageCtrl.updateItems(ItemCtrl.getItems());

    UICtrl.clearEditState();
  };

  const itemDeleteSubmit = function (e) {
    e.preventDefault();

    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Remove list item from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to the UI
    UICtrl.showTotalCalories(totalCalories);

    // Update data to LS
    StorageCtrl.updateItems(ItemCtrl.getItems());

    UICtrl.clearEditState();
  };

  // Public methods
  return {
    init: function () {
      // Clear edit state / set initial state
      UICtrl.clearEditState();

      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Checks if our list is empty
      // If yes, then we hide the list (the gray line)
      // If not, then we show list items
      !items.length ? UICtrl.hideList() : UICtrl.populateItemList(items);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, UICtrl, StorageCtrl);

App.init();
