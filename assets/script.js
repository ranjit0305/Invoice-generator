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

    const amount = qty * rate + (qty * cgst) + (qty * sgst) + (qty * cess);
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

function printInvoice() {
    const taxinvoice = $("#taxinvoice").val();
    const invoiceno = $("#invoice").val();
    const invoicedate = $("#invoicedate").val();
    const duedate = $("#duedate").val();

    const items = [];
    $("tr[id^='itemRow']").each(function () {
        const description = $(this).find("td:eq(0) input").val();
        const qty = $(this).find("td:eq(1) input").val();
        const rate = $(this).find("td:eq(2) input").val();
        const cgst = $(this).find("td:eq(3) input").val();
        const sgst = $(this).find("td:eq(4) input").val();
        const cess = $(this).find("td:eq(5) input").val();
        const amount = $(this).find("td:eq(6) input").val();

        items.push({
            description: description,
            qty: qty,
            rate: rate,
            cgst: cgst,
            sgst: sgst,
            cess: cess,
            amount: amount,
        });
    });

    const totalAmount = $("#totalAmount").val();

    let invoiceContent = `
        <h1>${taxinvoice}</h1>
        <p>Invoice No: ${invoiceno}</p>
        <p>Invoice Date: ${invoicedate}</p>
        <p>Due Date: ${duedate}</p>
        <table border="1">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>CGST</th>
                    <th>SGST</th>
                    <th>Cess</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>`;

    items.forEach(item => {
        invoiceContent += `
                <tr>
                    <td>${item.description}</td>
                    <td>${item.qty}</td>
                    <td>${item.rate}</td>
                    <td>${item.cgst}</td>
                    <td>${item.sgst}</td>
                    <td>${item.cess}</td>
                    <td>${item.amount}</td>
                </tr>`;
    });

    invoiceContent += `
            </tbody>
        </table>
        <p>Total Amount: ${totalAmount}</p>
    `;

    const newWindow = window.open('', '_blank', 'width=800,height=600');
    newWindow.document.write(invoiceContent);
    newWindow.document.close(); // Ensure the content is written before printing
    newWindow.print();
}
