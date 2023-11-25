import React, { useState, useEffect } from 'react';
import { Typography, Button, Container, Radio, RadioGroup, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import './style.css'; 
import { useNavigate } from 'react-router-dom';

function SiteManager(){

    const [totalInventory, setTotalInventory] = useState([]);
    const [totalSum, setTotalSum] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);
    const [showInventory, setShowInventory] = useState(false);
    const [showTotalInventory, setShowTotalInventory] = useState(false);
    const [TotalBalance, setTotalBalance] = useState(false);
    const [showTotalBalance, setShowTotalBalance] = useState(false);
    const [StoreProfit, setStoreProfit] = useState([]);
    const [showStoreProfit, setShowStoreProfit] = useState(false);
    const [storeBalance, setStoreBalance] = useState([]);
    const [showStoreBalance, setShowStoreBalance] = useState(false);
    const [showDeleteComp,setShowDeleteComp] = useState(false);
    const [storeList, setStoreList] = useState([]);
    const [deleteSuccess, setDeleteSuccess] = useState(null);
    const [deletedStoreId, setDeletedStoreId] = useState(null);
    const [activeView, setActiveView] = useState(null);
    const [storeToBeDeleted, setStoreToBeDeleted] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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
        fetchTotalBalance();
        fetchTotalInventory();
    }, []);

    deleteSuccessTimeout = setTimeout(() => {
        setDeleteSuccess(true);
        setDeletedStoreId(null); 
    }, 5000);

    const handleRadioChange = (event) =>{
        setStoreToBeDeleted(event.target.value);
    }

    async function toggleDisplayStoreInventory() {
        if(showTotalInventory)
        {
            setShowTotalInventory(false);
        }
        if(showTotalBalance){
            setShowTotalBalance(false);
        }
        if(showInventory)
        {
            setShowInventory(false);
        }
        if(showStoreProfit){
            setShowStoreProfit(false);
        }
        if(showStoreBalance)
        {
            setShowStoreBalance(false);
        }
        setShowInventory(!showInventory);

    if (!showInventory) { // Load data only if we are about to show the inventory
        await displayStoreInventory();
    }
    }

    /*

    async function toggleDisplayTotalInventory() {
        if(showInventory)
        {
            setShowInventory(false);
        }
        if(showStoreBalance)
        {
            setShowStoreBalance(false);
        }
        if(showTotalBalance)
        {
            setShowTotalBalance(false);
        }
        if(showTotalInventory)
        {
            setShowTotalInventory(false);
        }
        else{
            setShowTotalInventory(true);
            await displayTotalInventory();

        }
    }

    async function toggleDisplayTotalBalance() {
        if(showInventory)
        {
            setShowInventory(false);
        }
        if(showTotalInventory)
        {
            setShowTotalInventory(false);
        }
        if(showStoreBalance)
        {
            setShowStoreBalance(false);
        }
        if(showTotalBalance){
            setShowTotalBalance(false);
        }
        else{
            setShowTotalBalance(true);
            await displayTotalBalance();
        }
    }

    */

    async function toggleDisplayStoreBalance() {
        if(showInventory)
        {
            setShowInventory(false);
        }
        if(showTotalInventory)
        {
            setShowTotalInventory(false);
        }
        if(showTotalBalance){
            setShowTotalBalance(false);
        }
        if(showStoreProfit){
            setShowStoreProfit(false);
        }
        if(showStoreBalance){
            setShowStoreBalance(false);
        }
        else{
            setShowStoreBalance(true);
            await displayStoreBalance();
        }
    }


    async function toggleDisplayStoreProfit() {
        if(showInventory)
        {
            setShowInventory(false);
        }
        if(showTotalInventory)
        {
            setShowTotalInventory(false);
        }
        if(showTotalBalance){
            setShowTotalBalance(false);
        }
        if(showStoreBalance){
            setShowStoreBalance(false);
        }
        if(showStoreProfit){
            setShowStoreProfit(false);
        }
        else{
            setShowStoreProfit(true);
            await displayStoreProfit();
        }
    }

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

    async function displayTotalInventory(){
        const requestBody = { body : JSON.stringify({
            action: "totalInventory"
            })
        };
        
        const responseData = await fetchData(requestBody);
        if (responseData.statusCode === 200) {
            const bodyObject = JSON.parse(responseData.body);
            console.log('Parsed Body:', bodyObject);
            const totalSum2 = bodyObject.totalInventory.reduce((acc, item) => acc + (Number(item['Inventory']) || 0), 0);
            setTotalSum(totalSum2);
        
    }
}

async function displayStoreInventory(){
    const requestBody = { body : JSON.stringify({
        action: "totalInventoryStores"
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

async function displayStoreProfit(){
    const requestBody = { body : JSON.stringify({
        action: "storesProfit"
        })
    };
    
    const responseData = await fetchData(requestBody);

    if (responseData.statusCode === 200) {
        const bodyObject = JSON.parse(responseData.body);
        console.log('Parsed Body:', bodyObject);
        setStoreProfit(bodyObject.totalProfitResult);
    } else {
        console.log('Failed to load the inventory');
    }
}

/*
    async function displayTotalBalance(){
        const requestBody = { body : JSON.stringify({
            action: "totalBalance"
            })
        };
        
        const responseData = await fetchData(requestBody);

        if (responseData.statusCode === 200) {
            const bodyObject = JSON.parse(responseData.body);
            console.log('Parsed Body:', bodyObject);
            const totalSum3 = bodyObject.totalBalance.reduce((acc, item) => acc + (Number(item['Inventory']) || 0), 0);
            setTotalBalance(totalSum3);
        } else {
            console.log('Failed to load the inventory');
        }
    }

*/

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

    const fetchTotalBalance = async () => {
        const requestBody = { body: JSON.stringify({ action: "totalBalance" }) };
        const responseData = await fetchData(requestBody);
        if (responseData.statusCode === 200) {
            const bodyObject = JSON.parse(responseData.body);
            setTotalBalance(bodyObject.totalBalance);
        } else {
            console.log('Failed to load total balance');
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
        if(showTotalInventory)
        {
            setShowTotalInventory(false);
        }
        if(showTotalBalance){
            setShowTotalBalance(false);
        }
        if(showStoreBalance){
            setShowStoreBalance(false);
        }
        if(showStoreProfit){
            setShowStoreProfit(false);
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
            <div className="infoBox">
                <Typography variant="h6">Total Profit: {totalProfit}</Typography>
            </div>
            <div className="infoBox">
                <Typography variant="h6">Total Balance: {TotalBalance}</Typography>
            </div>
            <div className="infoBox">
                <Typography variant="h6">Total Inventory: {totalSum}</Typography>
            </div>
            </div>



        <Button variant="contained" onClick={() => {setShowDeleteComp(false);toggleDisplayStoreInventory();}} sx={{ margin: 1 }}>
            Store Inventory
        </Button>

        <Button variant="contained" onClick={() => {setShowDeleteComp(false);toggleDisplayStoreProfit();}} sx={{ margin: 1 }}>
            Store Profit
        </Button>

        <Button variant="contained" onClick={() => {setShowDeleteComp(false);toggleDisplayStoreBalance();}} sx={{ margin: 1 }}>
            Store Balance
        </Button>

        <Button variant="contained" color="secondary" onClick={()=> {setShowInventory(false);if(showDeleteComp){setShowDeleteComp(false);}else {setShowDeleteComp(true);}displayStoresToDelete()}} sx={{ margin: 1 }}>
            Remove Store
        </Button>

        {showInventory && (
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

                        {/*

                        <TableRow>
                            <TableCell><b>Total</b></TableCell>
                            <TableCell></TableCell>
                            <TableCell><b>{totalSum}</b></TableCell>
                        </TableRow>

                        */}
                    </TableBody>
                </Table>
            </TableContainer>
        )}

{showStoreProfit && (
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Store ID</TableCell>
                            <TableCell>Store Name</TableCell>
                            <TableCell>Profit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {StoreProfit.map((store) => (
                            <TableRow key={store.store_id}>
                                <TableCell>{store.store_id}</TableCell>
                                <TableCell>{store.store_name}</TableCell>
                                <TableCell>{store.store_profit}</TableCell>
                            </TableRow>
                        ))}

                        {/*

                        <TableRow>
                            <TableCell><b>Total</b></TableCell>
                            <TableCell></TableCell>
                            <TableCell><b>{totalSum}</b></TableCell>
                        </TableRow>

                        */}
                    </TableBody>
                </Table>
            </TableContainer>
        )}

        {showTotalInventory && (
            <div>
                <Typography variant="h6" gutterBottom>
                    The Total Inventory is {totalSum}
                </Typography>
            </div>
)}

        {showTotalBalance && (
            <div>
                <Typography variant="h6" gutterBottom>
                    The Total Balance is {TotalBalance}
                </Typography>
            </div>
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
                                <TableCell>{store['Inventory']}</TableCell>
                            </TableRow>
                        ))}

                        {/*

                        <TableRow>
                            <TableCell><b>Total</b></TableCell>
                            <TableCell></TableCell>
                            <TableCell><b>{totalSum}</b></TableCell>
                        </TableRow>

                        */}
                    </TableBody>
                </Table>
            </TableContainer>
        )}


        {showDeleteComp && (
            <div>
                <Typography variant="h6" gutterBottom>
                    Select a Store to Delete
                </Typography>
                <RadioGroup>
                    {storeList.map((store) => (
                        <FormControlLabel
                            key={store.store_id}
                            value={store.store_id}
                            control={<Radio />}
                            label={`${store.store_name} (ID: ${store.store_id})`}
                            onChange={handleRadioChange}
                        />
                    ))}
                </RadioGroup>
                <Button variant="contained" color="error" onClick={deleteStore} sx={{ margin: 1 }}>
                    Delete Selected Store
                </Button>
            </div>
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
