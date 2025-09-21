const addPage = document.getElementById("addPage");
const billingPage = document.getElementById("billingPage");
const itemsListAdd = document.getElementById("itemsListAdd");
const itemsListBill = document.getElementById("itemsListBill");

let storeItems = JSON.parse(localStorage.getItem("storeItems")) || [];

function renderAddItems() {
    itemsListAdd.innerHTML = "";
    storeItems.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("item");
        div.innerHTML = `<label>${item.name}</label><span>$${item.price.toFixed(2)}</span>
                         <button style="background:red;" onclick="deleteItem(${index})">X</button>`;
        itemsListAdd.appendChild(div);
    });
}

window.deleteItem = function(index) {
    storeItems.splice(index, 1);
    localStorage.setItem("storeItems", JSON.stringify(storeItems));
    renderAddItems();
}

document.getElementById("addItemBtn").addEventListener("click", () => {
    const name = document.getElementById("newItemName").value.trim();
    const price = parseFloat(document.getElementById("newItemPrice").value);

    if (!name || isNaN(price) || price <= 0) {
        alert("Enter valid name and price");
        return;
    }

    storeItems.push({ name, price });
    localStorage.setItem("storeItems", JSON.stringify(storeItems));
    renderAddItems();

    document.getElementById("newItemName").value = "";
    document.getElementById("newItemPrice").value = "";
});

document.getElementById("goBillingBtn").addEventListener("click", () => {
    if (storeItems.length === 0) {
        alert("Add at least one item.");
        return;
    }
    showBillingPage();
});

function showBillingPage() {
    addPage.style.display = "none";
    billingPage.style.display = "block";

    itemsListBill.innerHTML = "";
    storeItems.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("item");
        div.innerHTML = `<label>${item.name}</label>
                         <input type="number" min="0" value="0" data-price="${item.price}">`;
        itemsListBill.appendChild(div);
    });
}

document.getElementById("backToAddBtn").addEventListener("click", () => {
    billingPage.style.display = "none";
    addPage.style.display = "block";
    renderAddItems();
});

document.getElementById("calcBtn").addEventListener("click", function () {
    let total = 0;
    let details = '';
    const inputs = document.querySelectorAll('#itemsListBill input[type="number"]');

    inputs.forEach(input => {
        let qty = parseInt(input.value) || 0;
        let price = parseFloat(input.dataset.price) || 0;
        let itemName = input.previousElementSibling.innerText;

        if (qty > 0) {
            let subtotal = qty * price;
            total += subtotal;
            details += `<p><span>${itemName} x ${qty}</span> <span>$${subtotal.toFixed(2)}</span></p>`;
        }
    });

    if (total === 0) {
        document.getElementById("bill").innerHTML = "<p>No items selected.</p>";
    } else {
        const date = new Date().toLocaleString();
        document.getElementById("bill").innerHTML = `
            <h2>Cherry Cups Bakery</h2>
            <h3>${date}</h3>
            <hr>
            ${details}
            <hr>
            <h3>Total: $${total.toFixed(2)}</h3>
        `;
    }
});

document.getElementById("printBtn").addEventListener("click", function () {
    const billContent = document.getElementById("bill").innerHTML;
    if (!billContent || billContent.includes("No items selected")) {
        alert("Please calculate your bill first!");
        return;
    }
    const printWindow = window.open("", "", "width=400,height=600");
    printWindow.document.write(`<html><head><title>Print Bill</title></head>
                                <body>${billContent}</body></html>`);
    printWindow.document.close();
    printWindow.print();
});

renderAddItems();
