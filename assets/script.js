let itemCounter = 0;

function addInvoiceItem() {
    itemCounter++;
    const invoiceItems = document.getElementById('invoiceitems');

    const newItemRow = document.createElement('tr');
    newItemRow.setAttribute('id', 'itemRow' + itemCounter);

    newItemRow.innerHTML = `
        <td><input type="text" class="form-control" placeholder="Enter description required"></td>
        <td><input type="number" class="form-control qty" placeholder="Enter quantity" oninput="calculateAmount(${itemCounter})"></td>
        <td><input type="number" class="form-control rate" placeholder="Enter rate" oninput="calculateAmount(${itemCounter})"></td>
        <td><input type="number" class="form-control sgst" placeholder="SGST" oninput="calculateAmount(${itemCounter})"></td>
        <td><input type="number" class="form-control cgst" placeholder="CGST" oninput="calculateAmount(${itemCounter})"></td>
        <td><input type="number" class="form-control cess" placeholder="Cess" oninput="calculateAmount(${itemCounter})"></td>
        <td><input type="number" class="form-control amount" placeholder="Amount" readonly></td>
    `;

    invoiceItems.appendChild(newItemRow);
}

function calculateAmount(rowId) {
    const qty = parseFloat(document.querySelector(`#itemRow${rowId} .qty`).value) || 0;
    const rate = parseFloat(document.querySelector(`#itemRow${rowId} .rate`).value) || 0;
    const cgst = parseFloat(document.querySelector(`#itemRow${rowId} .cgst`).value) || 0;
    const sgst = parseFloat(document.querySelector(`#itemRow${rowId} .sgst`).value) || 0;
    const cess = parseFloat(document.querySelector(`#itemRow${rowId} .cess`).value) || 0;

    const amount = qty * rate + (qty * cgst) + (qty * sgst) + (qty*cess);
    const amountRow = document.querySelector(`#itemRow${rowId} .amount`);
    amountRow.value = amount.toFixed(2);

    updateTotalAmount();
}

function updateTotalAmount() {
    let total = 0;
    document.querySelectorAll('.amount').forEach(amountRow => {
        total += parseFloat(amountRow.value) || 0;
    });

    document.getElementById('totalAmount').value = total.toFixed(2);
}
