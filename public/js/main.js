// Get the form and the results container
const form = document.querySelector('#tip-form');
const resultsContainer = document.querySelector('#results');
const percentageDiv = document.querySelector('#percentage-div');
const customDiv = document.querySelector('#custom-div');
const tipTypeRadios = document.querySelectorAll('input[name="tip-type"]');

// Add an event listener to the form submit button
form.addEventListener('submit', (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the form inputs
    const billAmount = parseFloat(document.querySelector('#bill-amount').value);
    const tipPercentage = parseFloat(document.querySelector('#tip-percentage').value);
    const customTip = parseFloat(document.querySelector('#custom-tip').value);
    const numberOfPeople = parseInt(document.querySelector('#num-of-people').value);

    // Check if the inputs are valid
    if (isNaN(billAmount) || billAmount <= 0 || isNaN(numberOfPeople) || numberOfPeople <= 0) {
        alert("Please enter valid numbers for the bill amount and number of people.");
        return;
    }

    let tipAmount;
    // Determine the tip amount based on the selected radio button
    const selectedTipType = document.querySelector('input[name="tip-type"]:checked').value;
    if (selectedTipType === 'percentage') {
        if (isNaN(tipPercentage) || tipPercentage < 0) {
            alert("Please enter a valid tip percentage.");
            return;
        }
        tipAmount = billAmount * (tipPercentage / 100);
    } else {
        if (isNaN(customTip) || customTip < 0) {
            alert("Please enter a valid custom tip amount.");
            return;
        }
        tipAmount = customTip;
    }

    const totalAmount = billAmount + tipAmount;
    // Calculate the amount per person
    const amountPerPerson = totalAmount / numberOfPeople;

    // Display the results
    document.querySelector('#total-amount').textContent = `₹${totalAmount.toFixed(2)}`;
    document.querySelector('#total-tip').textContent = `₹${tipAmount.toFixed(2)}`;
    document.querySelector('#amount-per-person').textContent = `₹${amountPerPerson.toFixed(2)}`;
});

// Export results as PDF
document.querySelector('#export-pdf').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;

    // Ensure the results are available before exporting
    const totalAmount = document.querySelector('#total-amount').textContent;
    const tipAmount = document.querySelector('#total-tip').textContent;
    const amountPerPerson = document.querySelector('#amount-per-person').textContent;

    // Check if the results are populated
    if (!totalAmount || !tipAmount || !amountPerPerson) {
        alert('Please calculate the results before exporting.');
        return;
    }

    const doc = new jsPDF();

    // Set font styles
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text('Tip Splitter Results', 105, 15, null, null, 'center');

    // Remove the currency symbol and trim whitespace
    const formatAmount = (amount) => amount.replace('₹', '').trim();

    // Create table data
    const tableData = [
        ['Total Amount', formatAmount(totalAmount)],
        ['Total Tip', formatAmount(tipAmount)],
        ['Amount Per Person', formatAmount(amountPerPerson)]
    ];

    // Add table to PDF
    doc.autoTable({
        startY: 25,
        head: [['Description', 'Amount']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
        styles: { font: 'helvetica', fontSize: 12 },
        alternateRowStyles: { fillColor: [224, 224, 224] },
        columnStyles: {
            1: { halign: 'right' }  // Right-align the Amount column
        }
    });

    // Save PDF
    doc.save('tip-splitter-results.pdf');
});

// Add event listeners to the radio buttons to toggle input fields
tipTypeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        const selectedTipType = document.querySelector('input[name="tip-type"]:checked').value;
        if (selectedTipType === 'percentage') {
            percentageDiv.style.display = 'block';
            customDiv.style.display = 'none';
            document.querySelector('#custom-tip').value = ''; // Clear custom tip if switching to percentage
        } else {
            percentageDiv.style.display = 'none';
            customDiv.style.display = 'block';
            document.querySelector('#tip-percentage').value = ''; // Clear percentage if switching to custom
        }
    });
});