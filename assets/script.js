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

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const taxinvoice = document.getElementById("taxinvoice").value;
    const invoiceno = document.getElementById("invoice").value;
    const invoicedate = document.getElementById("invoicedate").value;
    const invoicedcontent=document.getElementById("invoicedcontent").value
    const duedate = document.getElementById("duedate").value;
    const totalAmount = document.getElementById("totalAmount").value;
    const notes = document.getElementById("notes").value;
    const notesContent = document.getElementById("notescontent").value;
    const tandc = document.getElementById("TandC").value;
    const tandcContent = document.getElementById("TandCcontent").value;

    // Check if mandatory fields are filled
    if (!taxinvoice || !invoiceno || !invoicedate || !duedate || !totalAmount) {
        alert("Please fill in all mandatory fields.");
        return;
    }

    function generatePDFContent() {
        doc.setFontSize(20);
        doc.text(taxinvoice, 180, 20);

        doc.setFontSize(12);
        doc.text(`Invoice No: ${invoiceno}`, 10, 60);
        doc.text(`Invoice Date: ${invoicedcontent}`, 10, 70);
        doc.text(`Due Date: ${duedate}`, 10, 80);

        const startY = 90;
        let currentY = startY;

        doc.setFontSize(10);
        doc.text("Item Description", 10, currentY);
        doc.text("Qty", 60, currentY);
        doc.text("Rate", 80, currentY);
        doc.text("SGST", 100, currentY);
        doc.text("CGST", 120, currentY);
        doc.text("Cess", 140, currentY);
        doc.text("Amount", 160, currentY);
        currentY += 10;

        document.querySelectorAll("tr[id^='itemRow']").forEach(function (row) {
            const description = row.querySelector("td input[type='text']").value;
            const qty = row.querySelectorAll("td input")[1].value;
            const rate = row.querySelectorAll("td input")[2].value;
            const sgst = row.querySelectorAll("td input")[3].value;
            const cgst = row.querySelectorAll("td input")[4].value;
            const cess = row.querySelectorAll("td input")[5].value;
            const amount = row.querySelectorAll("td input")[6].value;

            doc.text(description, 10, currentY);
            doc.text(qty, 60, currentY);
            doc.text(rate, 80, currentY);
            doc.text(sgst, 100, currentY);
            doc.text(cgst, 120, currentY);
            doc.text(cess, 140, currentY);
            doc.text(amount, 160, currentY);
            currentY += 10;
        });
        doc.setFontSize(12);
        doc.text(`Total Amount: ${totalAmount}`, 10, currentY + 10);
        currentY += 20;
        doc.setFontSize(10);
        doc.text(notes, 10, currentY);
        currentY += 10;
        doc.text(notes, 10, currentY);
        currentY += 10;
        doc.text(tandc, 10, currentY);
        currentY += 10;
        doc.text(tandcContent, 10, currentY);
        doc.save('invoice.pdf');
    }

    // Add logo if uploaded
    const logoUpload = document.getElementById('logoUpload').files[0];
    if (logoUpload) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgData = e.target.result;
            doc.addImage(imgData, 'PNG', 10, 10, 50, 30);
            generatePDFContent();
        };
        reader.readAsDataURL(logoUpload);
    } 
    else {
        generatePDFContent();
    }
}
