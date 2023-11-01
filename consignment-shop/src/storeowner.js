import React, { useState } from 'react';
import './style.css'; // assuming you have the style.css file in the same directory

function App() {
    const [showCreateStoreForm, setShowCreateStoreForm] = useState(false);
    const [showAddComputerForm, setShowAddComputerForm] = useState(false);
    const [createStoreMessage, setCreateStoreMessage] = useState('');
    const [addComputerMessage, setAddComputerMessage] = useState('');

    async function createStore(storeData) {
        const storeID = document.getElementById('storeID').value;
            const storeName = document.getElementById('storeName').value;
            const credentials = document.getElementById('credentials').value;
            const latitude = document.getElementById('latitude').value;
            const longitude = document.getElementById('longitude').value;

            const requestBody = { body : JSON.stringify({
                action: "createStore",
                storeID,
                storeName,
                latitude,
                longitude,
                credentials})
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
        console.log(response);
        if (responseData.statusCode === 409) {
            document.getElementById('createStoreMessage').innerText = 'Store already exists. Please choose a different name or credentials.';
        }

        else if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        else{
        document.getElementById('createStoreMessage').innerText = 'Store created successfully!';
        console.log('Store created:', responseData);
        }
    } catch (error) {
        document.getElementById('createStoreMessage').innerText = 'Failed to create store. Please try again.';
        console.error('Error creating store:', error);
    }
        // Your create store logic here
    }

    async function addComputer(computerData) {
        const computerID = document.getElementById('computerID').value;
            const storeID = document.getElementById('storeID2').value;
            console.log("store id : ", storeID);
            const credentials = document.getElementById('computerCredentials').value;
            const computerName = document.getElementById('computerName').value;
            const price = document.getElementById('price').value;
            const memory = document.getElementById('memory').value;
            const storage = document.getElementById('storage').value;
            const processor = document.getElementById('processor').value;
            const processorGeneration = document.getElementById('processorGeneration').value;
            const graphics = document.getElementById('graphics').value;

            const computerDetails = {
                computerID,
                computerName,
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
             console.log(requestBody);
           

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

            <div className="button" onClick={() => { setShowCreateStoreForm(true); setShowAddComputerForm(false); }}>Create Store</div>
            <div className="button" onClick={() => { setShowCreateStoreForm(false); setShowAddComputerForm(true); }}>Add Computer</div>
            <div className="button">Modify Price or Delete Computer</div>
            <div className="button">Generate Inventory</div>
            <div className="button">Remove Store</div>

            {showCreateStoreForm && (
                <div id="createStoreForm" className="form">
                    <h2>Create Store</h2>
                    <label htmlFor="storeName">Store ID:</label>
                    <input type="text" id="storeID" required />
                    <label htmlFor="storeName">Store Name:</label>
                    <input type="text" id="storeName" required />
                    <br />
                    <label htmlFor="credentials">Credentials:</label>
                    <input type="password" id="credentials" required />
                    <br />
                    <label htmlFor="latitude">Latitude:</label>
                    <input type="text" id="latitude" required />
                    <br />
                    <label htmlFor="longitude">Longitude:</label>
                    <input type="text" id="longitude" required />
                    <br />
                    <button type="button" onClick={() => createStore(/* your data here */)}>Create Store</button>
                    <p id="createStoreMessage">{createStoreMessage}</p>
                </div>
            )}

            {showAddComputerForm && (
                <div id="addComputerForm" className="form">
                    
                    {/* ... similar pattern to above form ... */}
                    <p id="addComputerMessage">{addComputerMessage}</p>
                </div>
            )}
        </div>
    );
}

export default App;
