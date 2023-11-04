import React, { useState, useEffect } from 'react';
import './style.css'; 

function StoreOwner() {
    const [showCreateStoreForm, setShowCreateStoreForm] = useState(false);
    const [showAddComputerForm, setShowAddComputerForm] = useState(false);
    const [createStoreMessage, setCreateStoreMessage] = useState('');
    const [addComputerMessage, setAddComputerMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        // Update the document title using the browser API
        setUsername(localStorage.getItem('username'))
        setPassword(localStorage.getItem('password'))
    });

    async function generateInventoryReport(ownerId) {
        const requestBody = { body : JSON.stringify({
            action: "getAllComputers",
            userID: ownerId,
            })
        };

        console.log("requestBody: ", requestBody)

        try {
        const response = await fetch('https://q15htzftq3.execute-api.us-east-1.amazonaws.com/beta/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
        });

        const responseData = await response.json();
        console.log(responseData);
        // Check if the response is successful.
        if (responseData.statusCode==200) {
            console.log('Computer fetched:', responseData);
            
            const responseBody = JSON.parse(responseData.body);
            const computerList = responseBody.computerList;

            console.log("computerList: ", computerList)

        } else {
        // For non-successful responses, use the error message from the backend.
            console.log('Failed to get computers:', responseData);
        }
        } catch (error) {
        // This is for network errors or invalid JSON parsing.
            //document.getElementById('addComputerMessage').innerText = 'Failed to add computer. Please try again. Your credentials might be wrong';
            console.error('Error adding computer:', error);
        }
    }

    async function addComputer(computerData) {
        const storeID = document.getElementById('storeID2').value;
        console.log("store id : ", storeID);
        const credentials = document.getElementById('computerCredentials').value;
        const brand = document.getElementById('brand').value;
        const price = document.getElementById('price').value;
        const memory = document.getElementById('memory').value;
        const storage = document.getElementById('storage').value;
        const processor = document.getElementById('processor').value;
        const processorGeneration = document.getElementById('processorGeneration').value;
        const graphics = document.getElementById('graphics').value;

        const computerDetails = {
            brand,
            price,
            memory,
            storage,
            processor,
            processorGeneration,
            graphics
        };
        const requestBody = { body : JSON.stringify({
            action: "addComputer",
            credentials,
            storeID,
            computerDetails
            })
        };

        try {
        const response = await fetch('https://q15htzftq3.execute-api.us-east-1.amazonaws.com/beta/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
        });

        const responseData = await response.json();
        console.log(responseData);
        // Check if the response is successful.
        if (responseData.statusCode==200) {
            document.getElementById('addComputerMessage').innerText = 'Computer added successfully!';
            console.log('Computer added:', responseData);
        } else {
        // For non-successful responses, use the error message from the backend.
            document.getElementById('addComputerMessage').innerText = responseData.message || 'Failed to add computer. Please try again. Try different username';
        }
        } catch (error) {
        // This is for network errors or invalid JSON parsing.
            document.getElementById('addComputerMessage').innerText = 'Failed to add computer. Please try again. Your credentials might be wrong';
            console.error('Error adding computer:', error);
        }
    }

    return (
        <div>
            <h1>Welcome <span id="ownerName">Store Owner</span></h1>
    
            {/* <div className="button" onClick={() => { setShowCreateStoreForm(true); setShowAddComputerForm(false); }}>Create Store</div> */}
            
            
            <div className="button" onClick={() => { setShowAddComputerForm(true); }}>Add Computer</div>
            
            <div className="button">Modify Price or Delete Computer</div>
            <div className="button" onClick={() => generateInventoryReport(username)}>Generate Inventory</div>
            {/* <div className="button">Remove Store</div> */}
           
            
            <div id="addComputerForm" className="form" style={{ display: showAddComputerForm ? 'block' : 'none' }}>
                <h2>Add Computer</h2>
                <label htmlFor="storeID2">Store ID:</label>
                <input type="number" id="storeID2" required />
                <label htmlFor="computerCredentials">Your Credentials:</label>
                <input type="password" id="computerCredentials" required />
                <label htmlFor="brand">Brand:</label>
                <input type="text" id="brand" required />
                <br />
                <label htmlFor="price">Price:</label>
                <input type="number" id="price" required />
                <br />
                <label htmlFor="memory">Memory:</label>
                <input type="text" id="memory" required />
                <br />
                <label htmlFor="storage">Storage:</label>
                <input type="text" id="storage" required />
                <br />
                <label htmlFor="processor">Processor:</label>
                <input type="text" id="processor" required />
                <br />
                <label htmlFor="processorGeneration">Processor Generation:</label>
                <input type="text" id="processorGeneration" required />
                <br />
                <label htmlFor="graphics">Graphics:</label>
                <input type="text" id="graphics" required />
                <br />
                <button type="button" onClick={addComputer}>Add Computer</button>
                <p id="addComputerMessage"></p>
            </div>
                
        </div>
        
    );
    
}

export default StoreOwner;
