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
        <td><button type="button" class="btn btn-danger" onclick="removeInvoiceItem(${itemCounter})">Remove</button></td>
    `;

    invoiceItems.appendChild(newItemRow);
}

function removeInvoiceItem(rowId) {
    document.getElementById('itemRow' + rowId).remove();
    updateTotalAmount();
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
    let totalSGST = 0;
    let totalCGST = 0;

    document.querySelectorAll("tr[id^='itemRow']").forEach(function (row) {
        const qty = parseFloat(row.querySelectorAll("td input")[1].value) || 0;
        const rate = parseFloat(row.querySelectorAll("td input")[2].value) || 0;
        const sgst = parseFloat(row.querySelectorAll("td input")[3].value) || 0;
        const cgst = parseFloat(row.querySelectorAll("td input")[4].value) || 0;
        const amount = parseFloat(row.querySelectorAll("td input")[6].value) || 0;

        total += amount;
        totalSGST += qty * sgst;
        totalCGST += qty * cgst;
    });

    document.getElementById('totalAmount').value = total.toFixed(2);
    document.getElementById('sgstAmount').value = totalSGST.toFixed(2);
    document.getElementById('cgstAmount').value = totalCGST.toFixed(2);
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const taxinvoice = document.getElementById("taxinvoice").value;
    const invoiceno = document.getElementById("invoice").value;
    const invoicedate = document.getElementById("invoicedate").value;
    const invoicedcontent = document.getElementById("invoicedcontent").value
    const duedate = document.getElementById("duedate").value;
    const duedatecontent = document.getElementById("duedatecontent").value;
    const totalAmount = document.getElementById("totalAmount").value;
    const notes = document.getElementById("notes").value;
    const notesContent = document.getElementById("notescontent").value;
    const tandc = document.getElementById("TandC").value;
    const tandcContent = document.getElementById("TandCcontent").value;
    const totalCGST = document.getElementById("cgstAmount").value;
    const totalSGST = document.getElementById("sgstAmount").value;
    const tcompany = document.getElementById("company").value;
    const tname = document.getElementById("name").value;
    const tcompanygst = document.getElementById("companygst").value;
    const tcity = document.getElementById("city").value;
    const tstate = document.getElementById("state").value;
    const tcountry = document.getElementById("country").value;
    const bill = document.getElementById("bill").value;
    const ccompany = document.getElementById("ccompany").value;
    const cgstt = document.getElementById("cgstt").value;
    const caddress = document.getElementById("caddress").value;
    const ccity = document.getElementById("ccity").value;
    const cstate = document.getElementById("cstate").value;
    const ccountry = document.getElementById("ccountry").value;

    if (!taxinvoice || !invoiceno || !invoicedate || !duedate || !totalAmount) {
        alert("Please fill in all mandatory fields.");
        return;
    }

    function generatePDFContent() {
        doc.setFontSize(15);
        doc.text(taxinvoice, 140, 20);

        doc.setFontSize(12);
        doc.text(`Invoice No: ${invoiceno}`, 10, 60);
        doc.text(`${invoicedate}: ${invoicedcontent}`, 10, 70);
        doc.text(`${duedate}: ${duedatecontent}`, 10, 80);
        doc.text(`${tcompany}`,10,90);
        doc.text(`${tname}`,10,100);
        doc.text(`${tcompanygst}`,10,110);
        doc.text(`${tcity}`,10,120);
        doc.text(`${tstate}`,10,130);
        doc.text(`${tcountry}`,10,140);
        doc.text(`${bill}`,10,160);
        doc.text(`${ccompany}`,10,170);
        doc.text(`${cgstt}`,10,180);
        doc.text(`${caddress}`,10,190);
        doc.text(`${ccity}`,10,200);
        doc.text(`${cstate}`,10,210);
        doc.text(`${ccountry}`,10,220);

        const startY = 230;
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
            const inputs = row.querySelectorAll("td input");
        
            const description = inputs[0].value;
            const qty = inputs[1].value;
            const rate = inputs[2].value;
            const sgst = inputs[3].value;
            const cgst = inputs[4].value;
            const cess = inputs[5].value;
            const amount = inputs[6].value;

            if (currentY > 270) {
                doc.addPage();
                currentY = 10;
            }
        
            doc.text(description, 10, currentY);
            doc.text(qty, 60, currentY);
            doc.text(rate, 80, currentY);
            doc.text(sgst, 100, currentY);
            doc.text(cgst, 120, currentY);
            doc.text(cess, 140, currentY);
            doc.text(amount, 160, currentY);
            currentY += 10;
        });        

        if (currentY > 270) {
            doc.addPage();
            currentY = 10;
        }

        doc.setFontSize(12);
        currentY += 10;
        doc.text(`CGST: ${totalCGST}`, 10, currentY);
        currentY += 10;
        doc.text(`SGST: ${totalSGST}`, 10, currentY);
        currentY += 10;
        doc.text(`Total Amount: ${totalAmount}`, 10, currentY);
        currentY += 20;
        
        if (currentY > 270) {
            doc.addPage();
            currentY = 10;
        }

        doc.setFontSize(10);
        doc.text(notes, 10, currentY);
        currentY += 10;
        doc.text(notesContent, 10, currentY);
        currentY += 10;
        doc.text(tandc, 10, currentY);
        currentY += 10;
        doc.text(tandcContent, 10, currentY);

        doc.save('invoice.pdf');
    }

    const logoUpload = document.getElementById('logoUpload').files[0];
    if (logoUpload) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgData = e.target.result;
            doc.addImage(imgData, 'PNG', 10, 10, 50, 30);
            generatePDFContent();
        };
        reader.readAsDataURL(logoUpload);
    } else {
        generatePDFContent();
    }
}
