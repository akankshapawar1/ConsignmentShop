import React, { useState, useEffect } from 'react';
import { Typography, Button, Container, Radio, RadioButton, RadioGroup, FormControlLabel, Table, TableBody, TableCell, TableContainer, Checkbox, TableHead, TableRow, Paper } from '@material-ui/core';
import './style.css'; 
import { useNavigate } from 'react-router-dom';
import { RadioButtonUncheckedRounded, RadioRounded } from '@mui/icons-material';

function SiteManager(){

    const [totalInventory, setTotalInventory] = useState([]);
    const [totalSum, setTotalSum] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);
    const [showInventory, setShowInventory] = useState(false);
    const [storeBalance, setStoreBalance] = useState([]);
    const [showStoreBalance, setShowStoreBalance] = useState(false);
    const [showDeleteComp,setShowDeleteComp] = useState(false);
    const [storeList, setStoreList] = useState([]);
    const [deleteSuccess, setDeleteSuccess] = useState(null);
    const [deletedStoreId, setDeletedStoreId] = useState(null);
    const [activeView, setActiveView] = useState(null);
    const [storeToBeDeleted, setStoreToBeDeleted] = useState(null);
    // const [selectedStore, setSelectedStore] = useState(''); 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [sortOrder, setSortOrder] = useState('ASC');
    const [selectedRadio, setSelectedRadio] = useState(null);



    let deleteSuccessTimeout = null;
    const navigate = useNavigate();

    useEffect(() => { 
        const username = localStorage.getItem('username')
        console.log('username: ', username)
        const password = localStorage.getItem('password')

        if (username && password) {
            setUsername(username)
            setPassword(password)
        }
        else {
            navigate("/login")
        }

        if (deleteSuccessTimeout) {
            clearTimeout(deleteSuccessTimeout);
        }
        fetchTotalProfit();
        fetchTotalInventory();
    }, []);

    deleteSuccessTimeout = setTimeout(() => {
        setDeleteSuccess(true);
        setDeletedStoreId(null); 
    }, 10000);

    const handleRadioChange = (event) =>{
        
        setStoreToBeDeleted(event.target.value);
        setSelectedRadio(event.target.value);
        console.log("New storeToBeDeleted:", event.target.value);
        // setSelectedStore(event.target.value);
    }
    useEffect(() => {
        displayStoreInventory();
    }, [sortOrder]);
    
    async function toggleDisplayStoreInventory() {
        if(showInventory)
        {
            setShowInventory(false);
        }
        if(showStoreBalance)
        {
            setShowStoreBalance(false);
        }
        setShowInventory(!showInventory);

    if (!showInventory) {
        await displayStoreInventory();
    }
    }

    async function toggleDisplayStoreBalance() {
        if(showInventory)
        {
            setShowInventory(false);
        }
        if(showStoreBalance){
            setShowStoreBalance(false);
        }
        else{
            setShowStoreBalance(true);
            await displayStoreBalance();
        }
    }

    const fetchData = async (action) => {
        try {
            const response = await fetch('/login', {
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

    async function displayStoreInventory(){
        const requestBody = { body : JSON.stringify({
            action: "totalInventoryStores",
            sortOrder: sortOrder
            })
        };
        
        const responseData = await fetchData(requestBody);

        if (responseData.statusCode === 200) {
            const bodyObject = JSON.parse(responseData.body);
            console.log('Parsed Body:', bodyObject);
            setTotalInventory(bodyObject.totalInventoryResult);
        } else {
            console.log('Failed to load the inventory');
        }
    }

    async function displayStoreBalance(){
        const requestBody = { body : JSON.stringify({
            action: "storeBalance"
            })
        };
        
        const responseData = await fetchData(requestBody);

        if (responseData.statusCode === 200) {
            const bodyObject = JSON.parse(responseData.body);
            console.log('Parsed Body:', bodyObject);
            setStoreBalance(bodyObject.storeBalance);
        } else {
            console.log('Failed to load the store balance');
        }
    }

    const fetchTotalProfit = async () => {
        const requestBody = { body: JSON.stringify({ action: "totalProfit" }) };
        const responseData = await fetchData(requestBody);
        if (responseData.statusCode === 200) {
            const bodyObject = JSON.parse(responseData.body);
            setTotalProfit(bodyObject.totalProfit);
        } else {
            console.log('Failed to load total profit');
        }
    };

    const fetchTotalInventory = async () => {
        const requestBody = { body : JSON.stringify({
            action: "totalInventory"
            })
        };
        
        const responseData = await fetchData(requestBody);

        if (responseData.statusCode === 200) {
            const bodyObject = JSON.parse(responseData.body);
            console.log('Parsed Body:', bodyObject);
            setTotalSum(bodyObject.totalInventory);
        } else {
            console.log('Failed to load the inventory');
        }
    }

    async function displayStoresToDelete(){
        if(showInventory)
        {
            setShowInventory(false);
        }
        if(showStoreBalance){
            setShowStoreBalance(false);
        }
        const requestBody = { body : JSON.stringify({
            action: 'displayStoresToDelete'
            })
        };
        const responseData2 = await fetchData(requestBody);

        if(responseData2.statusCode === 200){
            const bodyObject = JSON.parse(responseData2.body);
            console.log('Store list', bodyObject);
            setStoreList(bodyObject.storeList);
        }else{
            console.log('Failed to retrieve store list');
        }
    }

    async function deleteStore(){
        if(storeToBeDeleted){
            setDeletedStoreId(storeToBeDeleted);
            const requestBody = { body : JSON.stringify({
                action:'deleteStore',
                store_id : storeToBeDeleted
                })
            }; 

            const responseData2 = await fetchData(requestBody);

            if(responseData2.statusCode === 200){
                console.log('Deleted the store', responseData2);
                setActiveView('deleteStore');
                setDeleteSuccess(true);
                setStoreToBeDeleted(null);
                setDeletedStoreId(storeToBeDeleted); 
                await displayStoresToDelete();
                setTimeout(() => {
                    setDeleteSuccess(false);
                    setDeletedStoreId(null);
                    setActiveView(null);
                }, 5000);
            }else{
                console.log('Failed to delete the store');
            }
        }
    }

    async function logout() {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        navigate('/login');
    }

    return (
    <Container maxWidth="md">

        <Typography variant="h3" gutterBottom>
            Site Manager
        </Typography>
        <div>
            {/* Balance = Total profit for site manager (5% of sold computers)
            Inventory = Total of available goods */}
            <div className="infoBox">
                <Typography variant="h6">Balance: {totalProfit}</Typography>
            </div>
            <div className="infoBox">
                <Typography variant="h6">Total Inventory: {totalSum}</Typography>
            </div>
            </div>



        <Button variant="contained" color="primary" onClick={() => {setShowDeleteComp(false);toggleDisplayStoreInventory();}} sx={{ margin: 1 }}>
            Store Inventory
        </Button>

        <Button variant="contained" color="primary" onClick={() => {setShowDeleteComp(false);toggleDisplayStoreBalance();}} sx={{ margin: 1 }}>
            Store Balance
        </Button>

        <Button variant="contained" color="secondary" onClick={()=> {setShowInventory(false);if(showDeleteComp){setShowDeleteComp(false);}else {setShowDeleteComp(true);}displayStoresToDelete()}} sx={{ margin: 1 }}>
            Remove Store
        </Button>

        {showInventory && (
            <React.Fragment>
                <Button 
                    variant="contained" 
                    onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
                    sx={{ margin: 1 }}
                >
                    Sort Inventory {sortOrder === 'ASC' ? 'Descending' : 'Ascending'}
                </Button>
                <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Store ID</TableCell>
                                <TableCell>Store Name</TableCell>
                                <TableCell>Total Inventory</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {totalInventory.map((store) => (
                                <TableRow key={store.store_id}>
                                    <TableCell>{store.store_id}</TableCell>
                                    <TableCell>{store.store_name}</TableCell>
                                    <TableCell>{store['Inventory']}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </React.Fragment>
        )}

        {showStoreBalance && (
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Store ID</TableCell>
                            <TableCell>Store Name</TableCell>
                            <TableCell>Store Balance</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {storeBalance.map((store) => (
                            <TableRow key={store.store_id}>
                                <TableCell>{store.store_id}</TableCell>
                                <TableCell>{store.store_name}</TableCell>
                                <TableCell>{store.sm_profit}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )}


        {showDeleteComp && (
                    <>
                    <RadioGroup
                        defaultValue = "30"
                        name = "radio-buttons-group"
                        onChange = {handleRadioChange}
                        value={storeToBeDeleted}
                    >
                    
                    {storeList.map((store) => (
                        <FormControlLabel value = {store.store_id.toString()} control = {<Radio />}  label={`${store.store_name} (ID: ${store.store_id})`} />
                    ))}
                    </RadioGroup>
                    <Button variant="contained" color="error" onClick={deleteStore} sx={{ margin: 1 }}>
                        Delete Selected Store
                    </Button>
                </>
                )}

        <div>
       
        {deleteSuccess === true && activeView === 'deleteStore' && deletedStoreId ? (
            <p><b>Store {deletedStoreId} has been deleted successfully!</b></p>
        ):(
            <p></p>
        )}
        </div>

        <Button variant="contained" color="primary" onClick={logout} fullWidth sx={{ marginTop: 2 }}>Logout</Button>

    </Container>
    );
}

export default SiteManager;
