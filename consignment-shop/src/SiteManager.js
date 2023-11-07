/* (SM) Site Manager reports total inventory for site to show (Worcester Store, $1500) and (Boston Store, $3250)
(SM) Site Manager removes the Worcester store
(SM) Site Manager reports total inventory for site to show (Boston Store, $3250) */

import React, { useState, useEffect } from 'react';
//import './siteManager.css';
import './style.css'; 

function SiteManager(){

    let deleteSuccessTimeout = null;

    // Inside deleteStore function, assign the timeout to this variable
    deleteSuccessTimeout = setTimeout(() => {
        setDeleteSuccess(false);
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

    // states for displaying inventory
    const[totalInventory, setTotalInventory] = useState([]);
    const[totalSum, setTotalSum] = useState(0);

    // states for deleting store
    const[storeList, setStoreList] = useState([]);
    const[storeToBeDeleted, setStoreToBeDeleted] = useState();
    const[deleteSuccess, setDeleteSuccess] = useState(null);
    const [deletedStoreId, setDeletedStoreId] = useState(null);


    // to remove previous output from screen
    const [activeView, setActiveView] = useState(null);

    const handleRadioChange = (event) =>{
        setStoreToBeDeleted(event.target.value);
    }

    const handleDisplayTotalInventory = async () =>{
        setActiveView('totalInventory');
        await displayTotalInventory();
    }

    const handleDisplayStoresToDelete = async () =>{
        setActiveView('storesToDelete');
        await displayStoresToDelete();
    }

    const handleDeleteStore = async () => {
        await deleteStore();
        setActiveView('deleteStore'); // Keep or change the active view as needed
    };
    
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
                const totalSum2 = bodyObject.totalInventory.reduce((acc, item) => acc + (Number(item['sum(Computer.price)']) || 0), 0);
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
                    setDeleteSuccess(true);
                    // Do we want to display the list of stores after store has been deleted?
                    //await displayStoresToDelete();
                    setStoreToBeDeleted(null);
                    setDeletedStoreId(storeToBeDeleted); // Set the ID of the deleted store
                    // Set a timeout to reset the deleteSuccess state after 5 seconds
                    setTimeout(() => {
                        setDeleteSuccess(false);
                        setDeletedStoreId(null); // Also clear the deletedStoreId
                    }, 5000);
                }else{
                    console.log('Failed to delete the store');
                }
            }catch(error){
                console.log('Failed to delete the store', error);
            }
        }
    }

    return (
        <div>
            <h1>Site Manager</h1>
            <button className='button' onClick={() => handleDisplayTotalInventory()}>Total Inventory</button>

            {/* Inventory Table */}
            {/* Conditional rendering based on activeView */}
            {activeView === 'totalInventory' && (
                <div>
                {totalInventory && totalInventory.length > 0 ? (
                    <table>
                    <thead>
                      <tr>
                        <th>Store ID</th>
                        <th>Store Name</th>
                        <th>Inventory</th>
                      </tr>
                    </thead>
                    <tbody>
                      {totalInventory.map((store, index) => (
                        <tr key={index}>
                          <td>{store.store_id}</td>
                          <td>{store.store_name}</td>
                          <td>{store['Inventory']}</td>
                        </tr>
                      ))}
                      <tr>
                        <td><b>Total</b></td>
                        <td></td>
                        <td><b>{totalSum}</b></td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                    <p></p>
                )}
            </div>
            )}
            

            <button className='button'>Store Inventory</button>
            <button className='button'>Total Balance</button>
            <button className='button'>Store Balance</button>
            <button className='button' onClick={()=> handleDisplayStoresToDelete()}>Remove Store</button>
            
            {/* Store List */}
            
                <div>
                {activeView === 'storesToDelete' && storeList && storeList.length > 0 ? (
                    <><table>
                        <thead>
                            <tr>
                                <th>Delete</th>
                                <th>Store ID</th>
                                <th>Store Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {storeList.map((store, index) => (
                                <tr key={index}>
                                    <td>
                                        <label><input type='radio' 
                                        value={store.store_id} 
                                        name='deleteStore' 
                                        onChange={handleRadioChange}></input>
                                        </label>
                                    </td>
                                    <td>{store.store_id}</td>
                                    <td>{store.store_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table><button className='button' onClick={()=> handleDeleteStore()}>Delete the selected store</button></> 
                ) : (
                    <p></p>
                )}
            </div>
            
            
            
            <div>
            {deleteSuccess === true && activeView === 'deleteStore' ? (
                <p><b>Store {deletedStoreId} has been deleted successfully</b></p>
            ):(
                <p></p>
            )}
            </div>

        </div>
    );
}

export default SiteManager;
