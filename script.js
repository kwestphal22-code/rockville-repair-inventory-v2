let inventory = JSON.parse(localStorage.getItem("inventory"));

if (!inventory) {
  inventory = [
    { name: "Brake Chambers", quantity: 10 },
    { name: "Air Fittings", quantity: 10 },
    { name: "Brake Pads", quantity: 10 },
    { name: "Brake Drums", quantity: 10 },
    { name: "Oil Filters", quantity: 10 }
  ];
  saveInventory();
}

function saveInventory() {
  localStorage.setItem("inventory", JSON.stringify(inventory));
}

function renderInventory(filtered = inventory) {
  const table = document.getElementById("inventoryTable");
  table.innerHTML = "";

  filtered.forEach((item, index) => {
    const statusClass = item.quantity <= 3 ? "low" : "ok";
    const statusText = item.quantity <= 3 ? "LOW STOCK" : "IN STOCK";

    table.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>
          <button class="minus" onclick="adjustQuantity(${index}, -1)">-</button>
          <button class="plus" onclick="adjustQuantity(${index}, 1)">+</button>
        </td>
        <td class="${statusClass}">${statusText}</td>
        <td><button class="delete" onclick="deletePart(${index})">X</button></td>
      </tr>
    `;
  });
}

function adjustQuantity(index, amount) {
  inventory[index].quantity += amount;
  if (inventory[index].quantity < 0) inventory[index].quantity = 0;
  saveInventory();
  renderInventory();
}

function deletePart(index) {
  inventory.splice(index, 1);
  saveInventory();
  renderInventory();
}

function addNewPart() {
  const name = document.getElementById("newPart").value;
  const qty = parseInt(document.getElementById("newQty").value);

  if (!name || !qty) {
    alert("Enter part name and quantity");
    return;
  }

  inventory.push({ name, quantity: qty });
  saveInventory();
  renderInventory();

  document.getElementById("newPart").value = "";
  document.getElementById("newQty").value = "";
}

function searchParts() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const filtered = inventory.filter(item =>
    item.name.toLowerCase().includes(search)
  );
  renderInventory(filtered);
}

renderInventory();
