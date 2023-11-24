import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Container, TextField, Tooltip } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckIcon from '@mui/icons-material/Check';

import './style.css'; 

function StoreOwner() {
    const [inventoryData, setInventoryData] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showAllComputers, setShowAllComputers] = useState(true);
    const [computers, setComputers] = useState([]);
    const [showInventory, setShowInventory] = useState(false);
    const [showAddComputerForm, setShowAddComputerForm] = useState(false);
    const [editingComputerId, setEditingComputerId] = useState(null);
    const [editedPrice, setEditedPrice] = useState();
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

      getAllComputers(username)
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

    async function getAllComputers(ownerId) {
      setShowAllComputers(true)

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
          const total = computerList.reduce((acc, computer) => acc + parseFloat(computer.price || 0), 0);
          console.log('Total inventory: ',total);
          console.log('Computer List: ', computerList)

          setComputers(computerList)
          setTotalPrice(total);
      } else {
          console.log('Failed to get computers:', responseData);
      }
    }

    async function generateInventoryReport(ownerId) {
        setShowAllComputers(false)

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
        setShowAllComputers(false)
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

    async function editPrice(computerId) {
      console.log('Edit price of computer ', computerId)
      setEditingComputerId(computerId);
    }

    const handlePriceChange = (e) => {
      setEditedPrice(e.target.value);
    };

    const handlePriceSubmit = async (computerId) => {
      setEditingComputerId(null);

      console.log("updated price: ", editedPrice)

      const requestBody = { body : JSON.stringify({
        action: "editPrice",
        computer_id: computerId,
        newPrice: editedPrice
        })
      }

      const responseData = await fetchData(requestBody);
      setShowAllComputers(true)

      console.log("responseData: ", responseData.statusCode)

      if (responseData.statusCode === 200) {
        await getAllComputers(username)
      }

    };

    async function deleteComputer(computerId) {
      console.log('Delete computer ', computerId)

      const requestBody = { body : JSON.stringify({
        action: "deleteComputer",
        computer_id: computerId,
        })
      }

      const responseData = await fetchData(requestBody);

      console.log("responseData: ", responseData)
    }

    async function logout() {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        navigate('/login');
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="md" style={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom style={{ fontSize: '28px', fontWeight: 'bold' }}>
            {greeting} <span id="ownerName">{username}!</span>
          </Typography>

          <div style={{ display: 'flex' }}>

          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '15px', marginBottom: '15px', width: '300px', display: 'block'}}
            onClick={() => {
              setShowInventory(false)
              setShowAddComputerForm(false)
              setShowAllComputers(true)
            }}>
            Your Computers
          </Button>

          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '15px', marginBottom: '15px', width: '300px', display: 'block'}}
            onClick={() => {
              if(showAddComputerForm)
                {setShowAddComputerForm(false)}
              else
                {setShowAddComputerForm(true)}; 
                setShowAllComputers(false)
              setShowInventory(false)}}>
            Add Computer
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

          </div>

          </Container>

          <Container style={{ flex: 1, minHeight: '600px' }}>
          
          {showAllComputers ? (
            computers.length > 0 ? (
                <TableContainer component={Paper} style={{ marginTop: 20}}>
                    <Table>
                        <TableHead>
                        <TableRow>
                                <TableCell component="th" scope="row">
                                    <strong>Total Inventory</strong>
                                </TableCell>
                                <TableCell align="right"><strong>${totalPrice.toFixed(2)}</strong></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Brand</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Memory</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Storage</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Processor</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Process Generation</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Graphics</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Price</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {computers.map((computer, index) => (
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
                                  <TableCell align="center">
                                  {editingComputerId === computer.computer_id ? (
                                    <>
                                      <form
                                        onSubmit={(e) => {
                                          e.preventDefault();
                                          handlePriceSubmit(computer.computer_id);
                                        }}
                                      >
                                        <input
                                          type="text"
                                          value={editedPrice}
                                          onChange={handlePriceChange}
                                        />
                                        <Tooltip title="Confirm Edit" arrow>
                                          <Button type="submit" variant="outlined" color="primary" startIcon={<CheckIcon />} />
                                        </Tooltip>
                                      </form>
                                    </>
                                  ) : (
                                    <>
                                      {computer.price}
                                      <Tooltip title="Edit Price" arrow>
                                        <Button variant="outlined" color="primary" startIcon={<AttachMoneyIcon />} onClick={() => editPrice(computer.computer_id)} />
                                      </Tooltip>
                                    </>
                                  )}
                                  </TableCell>
                                  <TableCell>
                                  <Tooltip title="Delete Computer" arrow>
                                    <Button variant="outlined" color="secondary" startIcon={<DeleteIcon />} onClick={() => deleteComputer(computer.computer_id)} />
                                    </Tooltip>
                                  </TableCell>
                              </TableRow>
                            ))}
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
