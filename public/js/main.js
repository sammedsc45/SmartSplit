// Wait for the DOM to fully load before running any scripts
window.addEventListener('DOMContentLoaded', () => {
    const { jsPDF } = window.jspdf;

    // Get the form and results container elements
    const form = document.querySelector('#tip-form');
    const resultsContainer = document.querySelector('#results');
    const percentageDiv = document.querySelector('#percentage-div');
    const customDiv = document.querySelector('#custom-div');
    const tipTypeRadios = document.querySelectorAll('input[name="tip-type"]');
    const resetBtn = document.querySelector('#reset-btn');  // Add reference to the reset button

    // Add an event listener to the form submit button
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Get the form inputs
        const billAmount = parseFloat(document.querySelector('#bill-amount').value);
        const tipPercentage = parseFloat(document.querySelector('#tip-percentage').value);
        const customTip = parseFloat(document.querySelector('#custom-tip').value);
        const numberOfPeople = parseInt(document.querySelector('#num-of-people').value);
        
        const baseCurrency = document.querySelector('#base-currency-selector').value;
        const targetCurrency = document.querySelector('#target-currency-selector').value;

        // Check if the inputs are valid
        if (isNaN(billAmount) || billAmount <= 0 || isNaN(numberOfPeople) || numberOfPeople <= 0) {
            alert("Please enter valid numbers for the bill amount and number of people.");
            return;
        }

        let tipAmount;
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

        let totalAmount = billAmount + tipAmount;
        let amountPerPerson = totalAmount / numberOfPeople;

        // Get the exchange rate if the base and target currencies are different
        if (baseCurrency !== targetCurrency) {
            const exchangeRate = await getExchangeRate(baseCurrency, targetCurrency);
            if (exchangeRate !== null) {
                totalAmount *= exchangeRate;
                tipAmount *= exchangeRate;
                amountPerPerson *= exchangeRate;
            }
        }

        // Display the results with the converted currency symbol
        document.querySelector('#total-amount').textContent = `${targetCurrency} ${totalAmount.toFixed(2)}`;
        document.querySelector('#total-tip').textContent = `${targetCurrency} ${tipAmount.toFixed(2)}`;
        document.querySelector('#amount-per-person').textContent = `${targetCurrency} ${amountPerPerson.toFixed(2)}`;
    });

     // Export results to a PDF file
     document.querySelector('#export-pdf').addEventListener('click', () => {
        // Get the calculated results
        const totalAmount = document.querySelector('#total-amount').textContent;
        const tipAmount = document.querySelector('#total-tip').textContent;
        const amountPerPerson = document.querySelector('#amount-per-person').textContent;

        // Ensure the results are populated before exporting
        if (!totalAmount || !tipAmount || !amountPerPerson) {
            alert('Please calculate the results before exporting.');
            return;
        }

        const doc = new jsPDF();

        // Set font styles and add the title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text('Tip Splitter Results', 105, 15, null, null, 'center');

        // Helper function to format and trim the currency
        const formatAmount = (amount) => amount.trim();

        // Create table data with the formatted amounts
        const tableData = [
            ['Total Amount', formatAmount(totalAmount)],
            ['Total Tip', formatAmount(tipAmount)],
            ['Amount Per Person', formatAmount(amountPerPerson)]
        ];

        // Add a table to the PDF with the results
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

        // Save the PDF file
        doc.save('tip-splitter-results.pdf');
    });

    // Fetch exchange rate function
    const getExchangeRate = async (baseCurrency, targetCurrency) => {
        const apiKey = 'd145fc87ff90623d1099ffab';  // Replace with your actual API key
        const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            const exchangeRate = data.conversion_rates[targetCurrency];
            return exchangeRate;
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
            return null;
        }
    };

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

    // Reset button event listener
    resetBtn.addEventListener('click', () => {
        form.reset();  // Clear all the input fields
        percentageDiv.style.display = 'block';  // Reset the display of the percentage section
        customDiv.style.display = 'none';       // Hide the custom tip section

        // Clear the displayed results
        document.querySelector('#total-amount').textContent = '';
        document.querySelector('#total-tip').textContent = '';
        document.querySelector('#amount-per-person').textContent = '';
    });
});
