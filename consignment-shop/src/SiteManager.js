/* (SM) Site Manager reports total inventory for site to show (Worcester Store, $1500) and (Boston Store, $3250)
(SM) Site Manager removes the Worcester store
(SM) Site Manager reports total inventory for site to show (Boston Store, $3250) */

import React, { useState, useEffect } from 'react';
//import './siteManager.css';
import { Typography, Snackbar,Button, Container, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
// import { Typography, Button, Container, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import './style.css'; 
import { useNavigate } from 'react-router-dom';
function SiteManager(){

    // states for displaying inventory
    const[totalInventory, setTotalInventory] = useState([]);
    const[totalSum, setTotalSum] = useState(0);
    const [showInventory, setShowInventory] = useState(false);
    const [showDeleteComp,setShowDeleteComp] = useState(false);
    const navigate = useNavigate();
    // states for deleting store
    const[storeList, setStoreList] = useState([]);
    const[storeToBeDeleted, setStoreToBeDeleted] = useState();
    const[deleteSuccess, setDeleteSuccess] = useState(null);
    const [isInventoryVisible, setIsInventoryVisible] = useState(false);
    const [deletedStoreId, setDeletedStoreId] = useState(null);
    const [activeView, setActiveView] = useState(null);
    useEffect(() => {
        // Cleanup function to clear the timeout
        setShowInventory(false);
        // if (deleteSuccessTimeout) {
        //     clearTimeout(deleteSuccessTimeout);
        // }
    }, []);
    let deleteSuccessTimeout = null;

    // Inside deleteStore function, assign the timeout to this variable
    deleteSuccessTimeout = setTimeout(() => {
        setDeleteSuccess(true);
        setDeletedStoreId(null); // Also clear the deletedStoreId
    }, 10000);


    useEffect(() => {
        // Cleanup function to clear the timeout
        return () => {
            if (deleteSuccessTimeout) {
                clearTimeout(deleteSuccessTimeout);
            }
        };
    }, []); 

    const handleRadioChange = (event) =>{
        setStoreToBeDeleted(event.target.value);
    }
    console.log("show inventory ", showInventory);
    async function toggleDisplayTotalInventory() {
       
        // const shouldDisplay = !showInventory;
        // setShowInventory(shouldDisplay);
        if(showInventory)
        {
            setShowInventory(false);
        }
        else{
            setShowInventory(true);
            await displayTotalInventory();
        }
         
        // if (showInventory) {
        //     // Only fetch data when we are about to show the inventory
           
        // }
    }

    async function displayTotalInventory(){
        const requestBody = { body : JSON.stringify({
            action: "totalInventory"
            })
        };
        try{
            const response = await fetch('https://q15htzftq3.execute-api.us-east-1.amazonaws.com/beta/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),
            });

            const responseData = await response.json();

            console.log(responseData);

            if (responseData.statusCode==200) {
                console.log('Total Inventory: ', responseData.body);
                //console.log('typeof : ', typeof responseData.body);
                const bodyObject = JSON.parse(responseData.body);
                console.log('Parsed Body:', bodyObject);
                setTotalInventory(bodyObject.totalInventory);
                const totalSum2 = bodyObject.totalInventory.reduce((acc, item) => acc + (Number(item['Inventory']) || 0), 0);
                setTotalSum(totalSum2);
            } else {
                console.log('Failed');
            }

        }catch(error){
            console.log('Error fetching inventory',error);
        }
    }

    async function displayStoresToDelete(){
        const requestBody = { body : JSON.stringify({
            action:'displayStoresToDelete'
            })
        };
        try{
            const response = await fetch('https://q15htzftq3.execute-api.us-east-1.amazonaws.com/beta/login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),    
            });

            const responseData2 = await response.json();

            console.log(responseData2);

            if(responseData2.statusCode==200){
                const bodyObject = JSON.parse(responseData2.body);
                console.log('Store list', bodyObject);
                setStoreList(bodyObject.storeList);
            }else{
                console.log('Failed to retrieve store list');
            }

        }catch(error){
            console.log('Failed to display the list', error);
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

            console.log(requestBody.store_id);

            try{
                const response = await fetch('https://q15htzftq3.execute-api.us-east-1.amazonaws.com/beta/login',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
                });

                const responseData2 = await response.json();

                console.log(responseData2);

                if(responseData2.statusCode==200){
                    //const bodyObject = JSON.parse(responseData2);
                    console.log('Deleted the store', responseData2);
                    setActiveView('deleteStore');
                    setDeleteSuccess(true);
                    console.log("delete success ", deleteSuccess);
                    // Do we want to display the list of stores after store has been deleted?
                    //await displayStoresToDelete();
                    setStoreToBeDeleted(null);
                    setDeletedStoreId(storeToBeDeleted); // Set the ID of the deleted store
                    await displayStoresToDelete();
                    // Set a timeout to reset the deleteSuccess state after 5 seconds
                    setTimeout(() => {
                        setDeleteSuccess(false);
                        setDeletedStoreId(null);
                        setActiveView(null);// Also clear the deletedStoreId
                    }, 5000);
                }else{
                    console.log('Failed to delete the store');
                }
            }catch(error){
                console.log('Failed to delete the store', error);
            }
        }
    }
    async function logout() {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        navigate('/login');
    }
    // return (
    //     <div>
    //         <h1>Site Manager</h1>
    //         {/* <button className='button' onClick={() => {displayTotalInventory(); }}>Total Inventory</button> */}
    //         <button className='button' onClick={() => {setShowDeleteComp(false);toggleDisplayTotalInventory();}}>Total Inventory</button>

    //         {/* Inventory Table */}
    //         <div>
    //             {totalInventory && showInventory && totalInventory.length > 0 ? (
    //                 <table>
    //                 <thead>
    //                   <tr>
    //                     <th>Store ID</th>
    //                     <th>Store Name</th>
    //                     <th>Inventory</th>
    //                   </tr>
    //                 </thead>
    //                 <tbody>
    //                   {totalInventory.map((store, index) => (
    //                     <tr key={index}>
    //                       <td>{store.store_id}</td>
    //                       <td>{store.store_name}</td>
    //                       <td>{store['Inventory']}</td>
    //                     </tr>
    //                   ))}
    //                   <tr>
    //                     <td><b>Total</b></td>
    //                     <td></td>
    //                     <td><b>{totalSum}</b></td>
    //                   </tr>
    //                 </tbody>
    //               </table>
    //             ) : (
    //                 <p></p>
    //             )}
    //         </div>

    //         <button className='button'>Store Inventory</button>
    //         <button className='button'>Total Balance</button>
    //         <button className='button'>Store Balance</button>
    //         <button className='button' onClick={()=> {setShowInventory(false);if(showDeleteComp){setShowDeleteComp(false);} else {setShowDeleteComp(true);}displayStoresToDelete()}}>Remove Store</button>
            
    //         {/* Store List */}
    //         <div>
    //             {storeList && showDeleteComp && storeList.length > 0 ? (
    //                 <><table>
    //                     <thead>
    //                         <tr>
    //                             <th>Delete</th>
    //                             <th>Store ID</th>
    //                             <th>Store Name</th>
    //                         </tr>
    //                     </thead>
    //                     <tbody>
    //                         {storeList.map((store, index) => (
    //                             <tr key={index}>
    //                                 <td>
    //                                     <label><input type='radio' 
    //                                     value={store.store_id} 
    //                                     name='deleteStore' 
    //                                     onChange={handleRadioChange}></input>
    //                                     </label>
    //                                 </td>
    //                                 <td>{store.store_id}</td>
    //                                 <td>{store.store_name}</td>
    //                             </tr>
    //                         ))}
    //                     </tbody>
    //                 </table><button className='button' onClick={()=> deleteStore()}>Delete the selected store</button></> 
    //             ) : (
    //                 <p></p>
    //             )}
    //         </div>
            
    //         <div>
    //         {deleteSuccess === true && activeView === 'deleteStore' ? (
    //             <p><b>Store {deletedStoreId} has been deleted successfully</b></p>
    //         ):(
    //             <p></p>
    //         )}
    //         </div>
    //         <Button
    //         variant="contained"
    //         color="primary"
    //         fullWidth
    //         onClick={logout}
    //       >
    //         Logout
    //       </Button>

    //     </div>
    // );
    const handleCloseSnackbar = () => {
        setDeleteSuccess(false);
        setDeletedStoreId(null);
    };
            
            return (
                <Container maxWidth="md">
                    <Typography variant="h3" gutterBottom>
                        Site Manager
                    </Typography>
        
                    <Button variant="contained" onClick={() => {setShowDeleteComp(false);toggleDisplayTotalInventory();}} sx={{ margin: 1 }}>
                        Total Inventory
                    </Button>
                    <Button variant="contained" sx={{ margin: 1 }}>
                        Store Inventory
                    </Button>
                    <Button variant="contained" sx={{ margin: 1 }}>
                        Total Balance
                    </Button>
                    <Button variant="contained" sx={{ margin: 1 }}>
                        Store Balance
                    </Button>
                    <Button variant="contained" color="secondary" onClick={()=> {setShowInventory(false);if(showDeleteComp){setShowDeleteComp(false);} else {setShowDeleteComp(true);}displayStoresToDelete()}} sx={{ margin: 1 }}>
                        Remove Store
                    </Button>
        
                    {showInventory && (
                        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Store ID</TableCell>
                                        <TableCell>Store Name</TableCell>
                                        <TableCell>Inventory</TableCell>
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
                                    <TableRow>
                                        <TableCell><b>Total</b></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell><b>{totalSum}</b></TableCell>
                                    </TableRow>
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
           {deleteSuccess === true && activeView === 'deleteStore' ? (
                <p><b>Store {deletedStoreId} has been deleted successfully</b></p>
            ):(
                <p></p>
            )}
            </div>
        
                    <Button variant="contained" color="primary" onClick={logout} fullWidth sx={{ marginTop: 2 }}>
                        Logout
                    </Button>
                </Container>
            );
}

export default SiteManager;