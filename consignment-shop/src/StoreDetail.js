import Customer from "./customer/customer";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
function StoreDetail(){
    const { storeId } = useParams();
    console.log(storeId); // Assuming you're passing the store ID in the URL
    const [inventory, setInventory] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [buyComputer, setBuyComputer] = useState(null)

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
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
                const requestBody = { body : JSON.stringify({
                action: "getComputersByStore",
                store_id: storeId,
                })
            };
    
            const data = await fetchData(requestBody);
            console.log(data)
            // const response = await fetch('https://q15htzftq3.execute-api.us-east-1.amazonaws.com/beta/login', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         action: 'getComputersByStore',
            //         store_id: storeId
            //     })
            // });
            
            // const data = await response.json();
            // console.log(data);
            if (data.statusCode === 200) {
                const responseBody = JSON.parse(data.body);
                setInventory(responseBody.computerList);
            } else {
                // Handle error
            }
        } catch (error) {
            console.error('Error fetching inventory:', error);
            // Handle error
        }
    };
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
    
    async function handleBuy(computerId){
        if(computerId){
            const requestBody = { body : JSON.stringify({
                action:'buyComputer',
                computer_id : computerId
                })
            }; 
            console.log('Computer to be sold: ',requestBody.computer_id);

            const responseData2 = await fetchData(requestBody);

            // console.log('Response data for buy computer: ',responseData2);

            if(responseData2.statusCode === 200){
                console.log('Sold the computer', responseData2);
                setSuccessMessage('Computer has been shipped!');
                await fetchInventory();
                setBuyComputer(null);
            }else{
                console.log('Failed to sell the computer');
                setSuccessMessage('Failed to buy the computer.');
            }
        }
    }
    // const handleBuy = async (computerId) => {
    //     try {
    //         const response = await fetch('https://q15htzftq3.execute-api.us-east-1.amazonaws.com/beta/login', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({
    //                 action: 'buyComputer',
    //                 computer_id: computerId
    //             })
    //         });
    //         const data = await response.json();
    //         if (data.statusCode === 200) {
    //             setSuccessMessage('Computer purchased successfully!');
    //             fetchInventory(); // Refresh inventory
    //         } else {
    //             // Handle error
    //             setSuccessMessage('Failed to purchase computer.');
    //         }
    //     } catch (error) {
    //         console.error('Error buying computer:', error);
    //         // Handle error
    //         setSuccessMessage('Failed to purchase computer.');
    //     }
    // };

    return (
        <div>
            <h1>Store Inventory</h1>
            {successMessage && <p>{successMessage}</p>}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Computer Name</TableCell>
                            <TableCell>Brand</TableCell>
                            <TableCell>Memory</TableCell>
                            <TableCell>Storage</TableCell>
                            <TableCell>Processor</TableCell>
                            <TableCell>Process Generation</TableCell>
                            <TableCell>Graphics</TableCell>
                            <TableCell>Price</TableCell>
                            {/* Add other necessary columns */}
                            <TableCell>Buy</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {inventory.map((item) => (
                            <TableRow key={item.computer_id}>
                                <TableCell>{item.computer_name}</TableCell>
                                <TableCell>{item.brand}</TableCell>
                                <TableCell>{item.memory}</TableCell>
                                <TableCell>{item.storage}</TableCell>
                                <TableCell>{item.processor}</TableCell>
                                <TableCell>{item.process_generation}</TableCell>
                                <TableCell>{item.graphics}</TableCell>
                                <TableCell>{item.price}</TableCell>
                                {/* Add other necessary cells */}
                                <TableCell>
                                    <Button onClick={() => handleBuy(item.computer_id)}>Buy</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
export default StoreDetail;