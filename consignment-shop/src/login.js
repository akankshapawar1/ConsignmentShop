import React, { useState } from 'react';
//import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Button, TextField, Typography, Container } from '@mui/material';

// Inlined styles
const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f4f7f6',
      margin: 0,
      padding: 20,
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      fontSize: '2em',
      marginBottom: 20,
      textAlign: 'center',
      color: '#333'
    },
    form: {
      maxWidth: '400px',
      width: '100%',
      padding: '20px',
      background: '#fff',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    label: {
      alignSelf: 'flex-start',
      marginBottom: 5,
      fontWeight: 'bold'
    },
    input: {
      width: '100%',
      padding: 10,
      margin: '10px 0',
      borderRadius: 5,
      border: '1px solid #ccc',
      boxSizing: 'border-box'
    },
    button: {
      width: '100%',
      padding: 10,
      margin: '10px 0',
      borderRadius: 5,
      border: 'none',
      backgroundColor: '#4CAF50',
      color: '#fff',
      cursor: 'pointer',
      fontSize: '1em',
      fontWeight: 'bold',
    },
    buttonHover: {
      backgroundColor: '#45a049',
    },
    message: {
      marginTop: 10,
      fontSize: '1em',
      textAlign: 'center',
      color: '#333'
    },
    linkButton: {
      margin: '10px 0',
      padding: 10,
      border: 'none',
      backgroundColor: 'transparent',
      color: '#4CAF50',
      cursor: 'pointer',
      fontSize: '1em',
      textDecoration: 'underline'
    }
  };
  
function Login() {

  const navigate = useNavigate();
  const [showCreateStoreForm, setShowCreateStoreForm] = useState(false);
  
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const initialFormState = {
    storeName: '',
    userID: '',
    latitude: '',
    longitude: '',
    credentials: ''
  };

  //const [storeFormData, setStoreFormData] = useState(initialFormState);
  const handleCreateStoreClick = async (event) => {
    console.log('Create Store Button Clicked');
    if(!showCreateStoreForm){
    setShowCreateStoreForm(true);
    }
    else{
      setShowCreateStoreForm(false);
    }
  };

  const navigateToCustomer = () => {
    navigate('/Customer');
  };

  const handleSubmit = async (event) => {

    event.preventDefault();
    
    const payload = {
      body: JSON.stringify({ action: "login", user_id: userId, password })
    };

    try {
      
      const response = await fetch('https://q15htzftq3.execute-api.us-east-1.amazonaws.com/beta/login', {
        method: 'POST',
        body: JSON.stringify(payload)
      }); 

      const data = await response.json();

      if (data.statusCode === 401) {
        throw new Error('Invalid username or password, please try again!');
      }

      const responseBody = JSON.parse(data.body);
      setMessage(responseBody.message);
      console.log('Response message: ', responseBody.message)

      if (responseBody.isSiteManager === true && data.statusCode === 200) {
        localStorage.setItem('username', userId);
        localStorage.setItem('password', password);
        navigate('/sitemanager');
      } else if (data.statusCode === 200 && responseBody.isSiteManager === false) {
        localStorage.setItem('username', userId);
        localStorage.setItem('password', password);
        navigate('/storeowner');
      }
    } catch (error) {
      //console.log(error.body)
      setMessage(error.message);
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Card>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom style={{ color: 'black' }}>
            Computer Consignment Shop
          </Typography>
          {/* <Typography variant="h5" align="center" gutterBottom style={{ color: 'black' }}>
            Login
          </Typography> */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              id="user_id"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
          </form>
          <Typography variant="body1" color="error" gutterBottom>
            {message}
          </Typography>
          <Button variant="outlined" fullWidth onClick={handleCreateStoreClick}>
            Create Store
          </Button>
          {showCreateStoreForm && <CreateStoreForm />}
        </CardContent>
      </Card>
      {/* <Card>
        <CardContent>
        
          {<Typography variant="body1" align="center" style={styles.message}>
            Are you a customer? <button style={styles.linkButton} onClick={navigateToCustomer}>Click here</button>
          </Typography>}
         
        </CardContent>
      </Card> */}
    </Container>
    
  );
}

async function createStore(storeData) {
  try {
    const create_payload = {
      body: JSON.stringify({ action: "createStore", userID: storeData.userID, storeName: storeData.storeName, 
        latitude: storeData.latitude, longitude: storeData.longitude, credentials: storeData.credentials })
    };
    const response = await fetch('https://q15htzftq3.execute-api.us-east-1.amazonaws.com/beta/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(create_payload)
    }); 

    const responseData = await response.json();
    console.log(response);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${responseData.status}`);
    }
    
    if (responseData.statusCode === 409) {
      return 'Store already exists or userID already has a store registered. Please choose a different name or credentials.';
    } else {
      console.log('Store created: ', responseData);
      return 'Store created successfully!';
    }
  } catch (error) {
    console.error('Error creating store: ', error);
    return 'Failed to create store. Please try again.';
  }
}

function CreateStoreForm({ onStoreCreated }) {
  console.log('Create Store Form is now visible');
  const initialFormState = {
    storeName: '',
    userID: '',
    latitude: '',
    longitude: '',
    credentials: ''
  };
  const [storeData, setStoreData] = useState(initialFormState);
  const [createStoreMessage, setCreateStoreMessage] = useState('');
  const [showCreateStoreForm, setShowCreateStoreForm] = useState(false);

  const handleInputChange = (e) => {
    //setStoreData({ ...storeData, [e.target.id]: e.target.value });
    const { name, value } = e.target;
    setStoreData(prevStoreData => ({
      ...prevStoreData,
      [name]: value
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValidNumber = (value) => {
      return !isNaN(value) && !isNaN(parseFloat(value));
    };
  
    // Check if latitude and longitude are valid numbers
    if (!isValidNumber(storeData.latitude) || !isValidNumber(storeData.longitude)) {
      setCreateStoreMessage('Invalid format for latitude or longitude. Please enter a valid value.');
      return;
    }
    const message = await createStore(storeData);
    setCreateStoreMessage(message);
    setStoreData(initialFormState);
  }

  return (
    <Container maxWidth="sm" style={{ marginTop: 20 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Create Store
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="User Name"
              variant="outlined"
              name="userID"
              value={storeData.userID}
              onChange={handleInputChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Store Name"
              variant="outlined"
              name="storeName"
              value={storeData.storeName}
              onChange={handleInputChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              name="credentials"
              type="password"
              value={storeData.credentials}
              onChange={handleInputChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Latitude"
              variant="outlined"
              name="latitude"
              value={storeData.latitude}
              onChange={handleInputChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Longitude"
              variant="outlined"
              name="longitude"
              value={storeData.longitude}
              onChange={handleInputChange}
              required
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Create Store
            </Button>
          </form>
          <Typography variant="body1" color="textSecondary" align="center" style={{ marginTop: 10 }}>
            {createStoreMessage}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export {createStore,CreateStoreForm};
export default Login;
