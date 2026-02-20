// ===============================
// ROCKVILLE REPAIR INVENTORY V3
// ===============================

let inventory = JSON.parse(localStorage.getItem("inventory"));

// Default Starting Inventory
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

// ===============================
// RENDER INVENTORY
// ===============================

function renderInventory(filtered = inventory) {
  const table = document.getElementById("inventoryTable");
  table.innerHTML = "";

  filtered.forEach((item, index) => {
    const low = item.quantity <= 3;
    const statusClass = low ? "low" : "ok";
    const statusText = low ? "LOW STOCK" : "IN STOCK";

    table.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>
          <button class="minus" onclick="adjustQuantity(${index}, -1)">-</button>
          <button class="plus" onclick="adjustQuantity(${index}, 1)">+</button>
        </td>
        <td class="${statusClass}">${statusText}</td>
        <td>
          ${low ? `<button class="reorder" onclick="reorderPart('${item.name}')">Reorder</button>` : ""}
        </td>
        <td><button class="delete" onclick="deletePart(${index})">X</button></td>
      </tr>
    `;
  });
}

// ===============================
// ADJUST QUANTITY
// ===============================

function adjustQuantity(index, amount) {
  inventory[index].quantity += amount;
  if (inventory[index].quantity < 0) inventory[index].quantity = 0;
  saveInventory();
  renderInventory();
}

// ===============================
// DELETE PART
// ===============================

function deletePart(index) {
  inventory.splice(index, 1);
  saveInventory();
  renderInventory();
}

// ===============================
// ADD NEW PART
// ===============================

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

// ===============================
// SEARCH
// ===============================

function searchParts() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const filtered = inventory.filter(item =>
    item.name.toLowerCase().includes(search)
  );
  renderInventory(filtered);
}

// ===============================
// EXPORT TO EXCEL
// ===============================

function exportToExcel() {
  let csv = "Rockville Repair Inventory Report\n";
  csv += "Company Phone: (555) 867-5309\n";
  csv += "---------------------------------\n\n";
  csv += "Part Name,Quantity,Status\n";

  inventory.forEach(item => {
    const status = item.quantity <= 3 ? "LOW STOCK" : "IN STOCK";
    csv += `${item.name},${item.quantity},${status}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "rockville_repair_inventory.csv";
  a.click();
}

// ===============================
// REORDER FUNCTION
// ===============================

function reorderPart(partName) {
  alert(
    `REORDER ALERT\n\nPart: ${partName}\n\nCall Supplier to reorder.\n\nRockville Repair\nPhone: (555) 867-5309`
  );
}

// ===============================
// MOBILE MECHANIC MODE
// ===============================

function toggleMobileMode() {
  document.body.classList.toggle("mobile-mode");
}

// Initial Render
renderInventory();
