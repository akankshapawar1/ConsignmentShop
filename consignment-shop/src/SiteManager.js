/* (SM) Site Manager reports total inventory for site to show (Worcester Store, $1500) and (Boston Store, $3250)
(SM) Site Manager removes the Worcester store
(SM) Site Manager reports total inventory for site to show (Boston Store, $3250) */

import React, { useState } from 'react';
//import './siteManager.css';
import './style.css'; 

function SiteManager(){

    const[totalInventory, setTotalInventory] = useState([]);
    const[totalSum, setTotalSum] = useState(0);

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
                console.log('typeof : ', typeof responseData.body);
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

    async function displayRemoveStore(){

    }

    return (
        <div>
            <h1>Site Manager</h1>
            <button className='button' onClick={() => displayTotalInventory()}>Total Inventory</button>
            
        {/* <div>
            {totalInventory && totalInventory.length > 0 ? (
                totalInventory.map(item => (
                    <div key={item.store_id}>
                        <p>Store ID: {item.store_id}</p>
                        <p>Store Name: {item.store_name}</p>
                        <p>Total Price: {item['sum(Computer.price)']}</p>
                    </div>
                ))
            ) : (
                <p>No inventory data available.</p>
            )}
        </div> */}

            {/* Inventory Table */}
            <div>
                {totalInventory && totalInventory.length > 0 ? (
                    <table>
                    <thead>
                      <tr>
                        <th>Store Name</th>
                        <th>Inventory</th>
                      </tr>
                    </thead>
                    <tbody>
                      {totalInventory.map((store, index) => (
                        <tr key={index}>
                          <td>{store.store_name}</td>
                          <td>{store['sum(Computer.price)']}</td>
                        </tr>
                      ))}
                      <tr>
                        <td><b>Total</b></td>
                        <td>{totalSum}</td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                    <p>No inventory data available.</p>
                )}
            </div>

            <button className='button'>Store Inventory</button>
            <button className='button'>Total Balance</button>
            <button className='button'>Store Balance</button>
            <button className='button' onClick={()=> displayRemoveStore()}>Remove Store</button>

        </div>
    );
}

export default SiteManager;
