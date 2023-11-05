document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the computer list from local storage
    const computerList = JSON.parse(localStorage.getItem('computerList'));
    // Clear the item to clean up storage
    localStorage.removeItem('computerList');

    // Get the table body
    const tableBody = document.getElementById('inventoryTable').querySelector('tbody');

    // Iterate over the computer list and add rows to the table
    computerList.forEach(computer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${computer.computer_id}</td>
            <td>${computer.store_id}</td>
            <td>${computer.brand}</td>
            <td>${computer.price}</td>
            <td>${computer.memory}</td>
            <!-- Add more cells as needed -->
        `;
        tableBody.appendChild(row);
    });
});
