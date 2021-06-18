const itemList = document.querySelectorAll(".listItem");

let addedItems;
let numOfItems; // Usefull for indexing
let currentEditItem = "";

if (!localStorage.getItem("num")) {
  numOfItems = 0;
} else {
  numOfItems = localStorage.getItem("num");
}
// Iterate over all added items for displaying
const fillList = () => {
  if (!addedItems || addedItems.size === 0) {
    itemList[0].innerHTML = `<p style="color: grey; text-align: center">No Items Added</p>`;
    itemList[1].innerHTML = `<p style="color: grey; text-align: center">No Items Added</p>`;
    localStorage.map = JSON.stringify([...addedItems]);
    numOfItems = 0;
    localStorage.setItem("num", numOfItems);
    return;
  }
  const mapSort1 = new Map(
    [...addedItems.entries()].sort((a, b) => a[1].index - b[1].index)
  );

  const arrayofItems = Array.from(mapSort1);
  const listContent = arrayofItems
    .map((content) => {
      return `
        <div class="item">
        <p style="width: 80%">${content[0]}</p>
        <button class="itemButton showQuantity">${content[1].quant}</button>
        <button class="itemButton editButton" id="${content[0]}">Edit</button>
        <button class="itemButton delete" id="${content[0]}" >Delete</button>
        </div>
      `;
    })
    .join("");
  console.log(numOfItems);
  itemList[0].innerHTML = listContent; // updating content of grocery list
  itemList[1].innerHTML = listContent;

  // Updating local storage at every function call
  localStorage.map = JSON.stringify([...addedItems]);
  localStorage.setItem("num", numOfItems);
};

// checking for local storage
if (!localStorage.map) {
  addedItems = new Map(); // map of added items
  fillList();
} else {
  addedItems = new Map(JSON.parse(localStorage.map));
  fillList();
}

// onClick handler for Edit Button
function onEditHandler(name) {
  const editItem = document.querySelector("#editItem");
  editItem.classList.toggle("hid"); //Showing Edit Part
  editItem.scrollIntoView({ behavior: "smooth" });
  const inputFeild = document.querySelectorAll(".editForm input");
  currentEditItem = name;
  inputFeild[0].setAttribute("value", name); //Adding value to inputs of Edit Part
  inputFeild[1].setAttribute("value", addedItems.get(name).quant);
}

// onClick handler for Delete Button
const onDeleteHandler = (name) => {
  addedItems.delete(name);
  fillList();
};

// event delegation for edit and delete button
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("editButton")) {
    console.log(e.target.id);
    onEditHandler(e.target.id);
  } else if (e.target.classList.contains("delete")) {
    onDeleteHandler(e.target.id);
  }
});

// onsubmit handler for submitting add item form
const addButton = document.querySelector(".add");
addButton.addEventListener("click", function () {
  let inputVal = document.querySelectorAll("input");
  let name = inputVal[0].value;
  let quantity = Number(inputVal[1].value);
  if (addedItems.has(name)) {
    // If new item is already present
    const prev = addedItems.get(name).quant;
    const ind = addedItems.get(name).index;
    addedItems.set(name, {
      index: ind,
      quant: prev + quantity // increamenting the quantity if item already present
    });
  } else {
    addedItems.set(name, {
      index: ++numOfItems,
      quant: quantity
    });
  }
  console.log(numOfItems);
  inputVal[0].value = "";
  inputVal[1].value = "";
  fillList();

  return false;
});

// onsubmit handler for submitting edit item form
const edit = document.querySelector(".edit");
edit.addEventListener("click", function () {
  const editItemIndex = addedItems.get(currentEditItem).index;
  addedItems.delete(currentEditItem);
  let inputVal = document.querySelectorAll(".editForm input");
  let name = inputVal[0].value;
  let quantity = Number(inputVal[1].value);
  if (addedItems.has(name)) {
    // If editted name is already present
    const prev = addedItems.get(name).quant;
    const ind = addedItems.get(name).index;
    addedItems.set(name, {
      index: editItemIndex,
      quant: prev + quantity // increamenting quantitiy if item already present
    });
  } else {
    addedItems.set(name, {
      index: editItemIndex,
      quant: quantity
    });
  }
  fillList();
  document.querySelector("#editItem").classList.toggle("hid");
  currentEditItem = "";
  alert("Item Updated Successfully");
});

