import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Container, TextField, Card, CardContent } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import './style.css'; 

function StoreOwner() {

    const [inventoryData, setInventoryData] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showInventory, setShowInventory] = useState(false);
    const [showAddComputerForm, setShowAddComputerForm] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [greeting, setGreeting] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
      const username = localStorage.getItem('username')
      const password = localStorage.getItem('password')

      if (username && password) {
        setUsername(username)
        setPassword(password)
      }
      else {
        navigate("/login")
      }

      const date = new Date();
      if (date.getHours() < 12) {
        setGreeting('Good Morning, ');
      } else if (date.getHours() < 17) {
        setGreeting('Good Afternoon, ');
      } else {
        setGreeting('Good Evening, ');
      }
    },[]);

    const fetchData = async (action) => {
      try {
          const response = await fetch('https://q15htzftq3.execute-api.us-east-1.amazonaws.com/beta/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(action)
          });
          return await response.json();
      } catch (error) {
          console.error(`Error during ${action}:`, error);
          return null;
      }
    };

    async function generateInventoryReport(ownerId) {

        console.log('Owner ID: ',ownerId);

        const requestBody = { body : JSON.stringify({
            action: "getAllComputers",
            userID: ownerId,
            })
        };

        const responseData = await fetchData(requestBody);

        console.log('Response data from Generate inventory: ',responseData);
        
        if (responseData.statusCode === 200) {
            console.log('Computer fetched:', responseData);
            const responseBody = JSON.parse(responseData.body);
            const computerList = responseBody.computerList;
            setInventoryData(computerList);
            const total = computerList.reduce((acc, computer) => acc + parseFloat(computer.price || 0), 0);
            setTotalPrice(total);
            setShowInventory(true);
            console.log('Total inventory: ',total);
            console.log('Computer List: ', computerList)
        } else {
            console.log('Failed to get computers:', responseData);
        }
    }

    async function addComputer() {
        //const brand = document.getElementById('brand').value;
        const brand = selectedBrand
        const computer_name = document.getElementById('name').value;
        const price = document.getElementById('price').value;
        const memory = document.getElementById('memory').value;
        const storage = document.getElementById('storage').value;
        const processor = document.getElementById('processor').value;
        const processorGeneration = document.getElementById('processorGeneration').value;
        const graphics = document.getElementById('graphics').value;

        const computerDetails = {
            brand,
            computer_name,
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

        const responseData = await fetchData(requestBody);

        console.log('Response data from Add computer: ',responseData);

        if (responseData.statusCode === 200) {
            document.getElementById('addComputerMessage').innerText = 'Computer added successfully!';
            console.log('Computer added: ', responseData);
        } else {
            document.getElementById('addComputerMessage').innerText = responseData.message || 'Failed to add computer. Please try again. Try different username';
        }
    }

    async function logout() {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        navigate('/login');
    }

    return (
      <div style={{ display: 'flex' }}>
      <Container maxWidth="md" style={{ flex: 1 }}>
      {/* <Card>
        <CardContent> */}
          <Typography variant="h4" gutterBottom style={{ fontSize: '28px', fontWeight: 'bold' }}>
            {greeting} <span id="ownerName">{username}!</span>
          </Typography>

          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '15px', marginBottom: '15px', width: '300px', display: 'block'}}
            onClick={() => {
              if(showAddComputerForm)
                {setShowAddComputerForm(false)}
              else
                {setShowAddComputerForm(true)}; 
              setShowInventory(false)}}>
            Add Computer
          </Button>

          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '15px', marginBottom: '15px', width: '300px', display: 'block'}}>
            Modify Price or Delete Computer
          </Button>

          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '15px', marginBottom: '15px', width: '300px', display: 'block'}}
            onClick={() => {generateInventoryReport(username);setShowAddComputerForm(false)}}>
            Generate Inventory
          </Button>

          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '15px', marginBottom: '15px', width: '300px', display: 'block'}}
            onClick={logout}>
            Logout
          </Button>
          {/* </CardContent>
          </Card> */}
          </Container>
          
          <Container maxWidth="md" style={{ flex: 1, minHeight: '600px' }}>
          {/* <Card>
          <CardContent> */}
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
                required>
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
              label="Name"
              variant="outlined"
              id="name"
              required
              margin="normal"
            />
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
              onClick={addComputer}>
              Add Computer
            </Button>
            <Typography variant="body1" color="error" gutterBottom id="addComputerMessage"></Typography>
          </div>
        {/* </CardContent>
      </Card> */}
      {showInventory ? (
        inventoryData.length > 0 ? (
                <TableContainer component={Paper} style={{ marginTop: 20}}>
                    <Table aria-label="inventory table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Brand</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Memory</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Storage</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Processor</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Process Generation</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Graphics</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {inventoryData.map((computer, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        {computer.computer_name}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {computer.brand}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {computer.memory}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {computer.storage}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {computer.processor}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {computer.process_generation}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {computer.graphics}
                                    </TableCell>
                                    <TableCell align="center">${computer.price}</TableCell>
                                </TableRow>
                            ))}
                            {/* Total Price Row */}
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <strong>Total Inventory</strong>
                                </TableCell>
                                <TableCell align="right"><strong>${totalPrice.toFixed(2)}</strong></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
        ) : (
          <Typography variant="h6" align="center" color="textSecondary" style={{ marginTop: 50 }}>
            No computers available.
          </Typography>
        )
      ) : (
        <Typography variant="h6" align="center" color="textSecondary" style={{ marginTop: 20 }}>
          
        </Typography>
      )}
    </Container>
    </div>
); 
}

export default StoreOwner;
