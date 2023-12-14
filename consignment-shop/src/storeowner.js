import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Container, TextField, Tooltip, Input } from '@mui/material';
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
    const [selectedMemory, setSelectedMemory] = useState('');
    const [selectedStorage, setSelectedStorage] = useState('');
    const [selectedProcessor, setSelectedProcessor] = useState('');
    const [selectedProcessGen, setSelectedProcessGen] = useState('');
    const [selectedGraphics, setSelectedGraphics] = useState('');
    const [storeProfit, setStoreProfit] = useState(0)

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
      getStoreProfit(username)

      console.log("storeProfit: ", storeProfit)

    },[storeProfit]);

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

    async function getStoreProfit(username) {
      const requestBody = { body : JSON.stringify({
        action: "getStoreProfit",
        user_id: username,
        })
      };

      const responseData = await fetchData(requestBody)
      const parsedResponseData = JSON.parse(responseData)

      if (parsedResponseData.statusCode === 200) {
        const parsedBody = JSON.parse(parsedResponseData.body)

        setStoreProfit(parsedBody.storeProfit)
      }
      else {
        console.error("Unable to fetch store profit")
      }
    }

    async function getAllComputers(ownerId) {
      setShowAllComputers(true)
      document.getElementById('addComputerMessage').innerText = '';

      const requestBody = { body : JSON.stringify({
        action: "getAllComputers",
        userID: ownerId,
        })
      };

      const responseData = await fetchData(requestBody);
      
      if (responseData.statusCode === 200) {
          console.log('Computer fetched:', responseData);
          const responseBody = JSON.parse(responseData.body);
          const computerList = responseBody.computerList;
          // console.log("computer.isavailable", computer.is_available);
          const total = computerList.reduce((acc, computer) => {
            if (computer.is_available === 1) {
                return acc + parseFloat(computer.price || 0);
            }
            return acc;
        }, 0);
        
          console.log('Total inventory: ',total);
          console.log('Computer List: ', computerList)

          setComputers(computerList)
          setTotalPrice(total);
      } else {
          console.log('Failed to get computers:', responseData);
      }
    }

    async function addComputer(event) {
        event.preventDefault();
        setShowAllComputers(false)
        const brand = selectedBrand
        const computer_name = document.getElementById('name').value;
        const price = document.getElementById('price').value;
        const memory = selectedMemory
        const storage = selectedStorage
        const processor = selectedProcessor
        const processorGeneration = selectedProcessGen
        const graphics = selectedGraphics

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
            console.log("Added Computer")
            document.getElementById('name').value = '';
            document.getElementById('price').value = ''; 
            setSelectedBrand('');
            setSelectedMemory('');
            setSelectedGraphics('');
            setSelectedProcessGen('');
            setSelectedProcessor('');
            setSelectedStorage('');
            setShowAddComputerForm(false)
            await getAllComputers(username)
        } else {
            console.log("Could not add computer due to status code ",responseData.statusCode);
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

      if (storeProfit >= 25) {
        const responseData = await fetchData(requestBody);

        if (responseData.statusCode === 200) {
          await getAllComputers(username)
        }
      }
      else {
        window.alert('Insufficient balance')
      }
      
    }

    async function logout() {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        navigate('/customer');
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
            onClick={logout}>
            Logout
          </Button>

          </div>

          </Container>

          <Container style={{ flex: 1, minHeight: '600px' }}>
          
          {showAllComputers ? (
            computers.length > 0 ? (
                <TableContainer component={Paper} style={{ marginTop: 20, width: '100%'}}>
                    <Table>
                        <TableHead>
                        <TableRow>
                                <TableCell component="th" scope="row">
                                    <strong>Total Inventory</strong>
                                </TableCell>
                                <TableCell align="right"><strong>${totalPrice.toFixed(2)}</strong></TableCell>
                                <TableCell component="th" scope="row">
                                    <strong>Store Profit</strong>
                                </TableCell>
                                <TableCell align="right"><strong>${storeProfit.toFixed(2)}</strong></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Brand</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Memory</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Storage</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Processor</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Process Generation</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Graphics</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Sold</TableCell>
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
                                  <TableCell component="th" scope="row">
                                    {computer.is_available === 1 ? 'No' : 'Yes'}
                                  </TableCell>
                                  <TableCell align="center">
                                  {editingComputerId === computer.computer_id ? (
                                    <>
                                      <form
                                        onSubmit={(e) => {
                                          e.preventDefault();
                                          handlePriceSubmit(computer.computer_id);
                                        }}
                                        style={{ display: 'flex', alignItems: 'center' }}
                                      >
                                        <Input
                                          type="text"
                                          value={editedPrice}
                                          onChange={handlePriceChange}
                                          style={{ flex: 1, marginRight: '8px', width: '40px' }}
                                        />
                                        <Tooltip title="Confirm Edit" arrow>
                                          <Button type="submit" variant="outlined" color="primary" startIcon={<CheckIcon />} />
                                        </Tooltip>
                                      </form>
                                    </>
                                  ) : (
                                    <TableCell>
                                      <td>{computer.price}&nbsp;&nbsp;</td>
                                    <td>
                                      {computer.is_available === 1 ? (
                                        <Tooltip title="Edit Price" arrow>
                                          <Button variant="outlined" color="primary" startIcon={<AttachMoneyIcon />} onClick={() => editPrice(computer.computer_id)} />
                                        </Tooltip>
                                      ) : (
                                        <Tooltip title="Computer not available" arrow>
                                          <Button variant="outlined" color="primary" startIcon={<AttachMoneyIcon />} disabled />
                                        </Tooltip>
                                      )}
                                    </td>
                                    </TableCell>
                                  )}
                                  </TableCell>
                                  <TableCell>
                                  <Tooltip title="Delete Computer" arrow>
                                    <Button variant="outlined" color="secondary" startIcon={<DeleteIcon />} onClick={() => deleteComputer(computer.computer_id)} disabled={computer.is_available === 0} />
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
          <form onSubmit={addComputer}>
          <div
            id="addComputerForm"
            className="form"
            style={{ display: showAddComputerForm ? 'block' : 'none' }}
          >
            <Typography variant="h5" gutterBottom>
              Add Computer
            </Typography>

            <FormControl fullWidth variant="outlined" margin="normal" required>
              <InputLabel htmlFor="brand" required>Brand</InputLabel>
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
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="memory" required>Memory</InputLabel>
              <Select
                label="Memory"
                id="memory"
                value={selectedMemory}
                onChange={(e) => setSelectedMemory(e.target.value)}
                required>
                <MenuItem key="1" value="1GB">1GB</MenuItem>
                <MenuItem key="4" value="4GB">4GB</MenuItem>
                <MenuItem key="8" value="8GB">8GB</MenuItem>
                <MenuItem key="12" value="12GB">12GB</MenuItem>
                <MenuItem key="16" value="16GB">16GB</MenuItem>
                <MenuItem key="32" value="32GB">32GB</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="storage" required>Storage</InputLabel>
              <Select
                label="Storage"
                id="storage"
                value={selectedStorage}
                onChange={(e) => setSelectedStorage(e.target.value)}
                required>
                <MenuItem key="128" value="128GB">128GB</MenuItem>
                <MenuItem key="256" value="256GB">256GB</MenuItem>
                <MenuItem key="512" value="512GB">512GB</MenuItem>
                <MenuItem key="1" value="1TB">1TB</MenuItem>
                <MenuItem key="2" value="2TB">2TB</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="processor" required>Processor</InputLabel>
              <Select
                label="Processor"
                id="processor"
                value={selectedProcessor}
                onChange={(e) => setSelectedProcessor(e.target.value)}
                required>
                <MenuItem key="xion" value="Intel Xion">Intel Xion</MenuItem>
                <MenuItem key="i9" value="Intel i9">Intel i9</MenuItem>
                <MenuItem key="i7" value="Intel i7">Intel i7</MenuItem>
                <MenuItem key="r9" value="AMD Ryzen 9">AMD Ryzen 9</MenuItem>
                <MenuItem key="r7" value="AMD Ryzen 7">AMD Ryzen 7</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="processGeneration" required>Process Generation</InputLabel>
              <Select
                label="Process Generation"
                id="processGeneration"
                value={selectedProcessGen}
                onChange={(e) => setSelectedProcessGen(e.target.value)}
                required>
                <MenuItem key="13i" value="13th Gen Intel">13th Gen Intel</MenuItem>
                <MenuItem key="12i" value="12th Gen Intel">12th Gen Intel</MenuItem>
                <MenuItem key="11i" value="11th Gen Intel">11th Gen Intel</MenuItem>
                <MenuItem key="7r" value="AMD Ryzen 7000 Series">AMD Ryzen 7000 Series</MenuItem>
                <MenuItem key="6r" value="AMD Ryzen 6000 Series">AMD Ryzen 6000 Series</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="graphics" required>Graphics</InputLabel>
              <Select
                label="Graphics"
                id="graphics"
                value={selectedGraphics}
                onChange={(e) => setSelectedGraphics(e.target.value)}
                required>
                <MenuItem key="nv90" value="NVIDIA GeForce RTX 4090">NVIDIA GeForce RTX 4090</MenuItem>
                <MenuItem key="nv80" value="NVIDIA GeForce RTX 4080">NVIDIA GeForce RTX 4080</MenuItem>
                <MenuItem key="amd63" value="AMD Radeon Pro W6300">AMD Radeon Pro W6300</MenuItem>
                <MenuItem key="amd64" value="AMD Radeon Pro W6400">AMD Radeon Pro W6400</MenuItem>
                <MenuItem key="ii" value="Intel Integrated Graphics">Intel Integrated Graphics</MenuItem>
                <MenuItem key="i730" value="Intel UHD Graphics 730">Intel UHD Graphics 730</MenuItem>
                <MenuItem key="i770" value="Intel UHD Graphics 770">Intel UHD Graphics 770</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              >
              Add Computer
            </Button>
            <Typography variant="body1" color="error" gutterBottom id="addComputerMessage"></Typography>
          </div>
          </form>
    </Container>
    </div>
    
); 
}

export default StoreOwner;
