import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Container, TextField, Card, CardContent } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import './style.css'; 

function StoreOwner() {
    const [showCreateStoreForm, setShowCreateStoreForm] = useState(false);
    const [showAddComputerForm, setShowAddComputerForm] = useState(false);
    const [createStoreMessage, setCreateStoreMessage] = useState('');
    const [addComputerMessage, setAddComputerMessage] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

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
        //const brand = document.getElementById('brand').value;
        const brand = selectedBrand
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

        console.log("computerDetails: ", computerDetails)
        const requestBody = { body : JSON.stringify({
            action: "addComputer",
            credentials: password,
            username: username,
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

    async function logout() {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        navigate('/login');
    }

    return (
        <Container maxWidth="sm">
      <Card>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Welcome <span id="ownerName">Store Owner</span>
          </Typography>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => setShowAddComputerForm(true)}
          >
            Add Computer
          </Button>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            // Add functionality for "Modify Price or Delete Computer" button
          >
            Modify Price or Delete Computer
          </Button>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => generateInventoryReport(username)}
          >
            Generate Inventory
          </Button>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={logout}
          >
            Logout
          </Button>

          <div
            id="addComputerForm"
            className="form"
            style={{ display: showAddComputerForm ? 'block' : 'none' }}
          >
            <Typography variant="h5" gutterBottom>
              Add Computer
            </Typography>

            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="brand">Brand</InputLabel>
              <Select
                label="Brand"
                id="brand"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                required
              >
                <MenuItem key="Dell" value="Dell"> Dell</MenuItem>
                <MenuItem key="HP" value="HP"> HP</MenuItem>
                <MenuItem key="Lenovo" value="Lenovo"> Lenovo</MenuItem>
                <MenuItem key="Apple" value="Apple"> Apple</MenuItem>
                <MenuItem key="Acer" value="Acer"> Acer</MenuItem>
                <MenuItem key="Asus" value="Asus"> Asus</MenuItem>
                <MenuItem key="Toshiba" value="Toshiba"> Toshiba</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Price"
              variant="outlined"
              id="price"
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Memory"
              variant="outlined"
              id="memory"
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Storage"
              variant="outlined"
              id="storage"
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Processor"
              variant="outlined"
              id="processor"
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Processor Generation"
              variant="outlined"
              id="processorGeneration"
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Graphics"
              variant="outlined"
              id="graphics"
              required
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={addComputer}
            >
              Add Computer
            </Button>
            <Typography variant="body1" color="error" gutterBottom id="addComputerMessage"></Typography>
          </div>
        </CardContent>
      </Card>
    </Container>
        
    );
    
}

export default StoreOwner;
