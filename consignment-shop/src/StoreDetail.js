import Customer from "./customer/customer";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox } from '@material-ui/core'
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
function StoreDetail(){
    const { storeId } = useParams();
    console.log(storeId); // Assuming you're passing the store ID in the URL
    const [inventory, setInventory] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [compVisible, setCompVisible] = useState(false);
    const [buyComputer, setBuyComputer] = useState(null)
    const [compareList, setCompareList] = useState([]);
    const [computerList, setComputerList] = useState([]);
    const [brandList, setBrandList] = useState([])
    const [memoryList, setMemoryList] = useState([])
    const [storageList, setStorageList] = useState([])
    const [processorList, setProcessorList] = useState([])
    const [processGenList, setProcessGenList] = useState([])
    const [graphicsList, setGraphicsList] = useState([]);
    const [customerLocation, setCustomerLocation] = useState(null);

    useEffect(() => {
        fetchInventory();
    }, []);
    useEffect(() => {
        console.log('compare list ',compareList);
    },[compareList]);
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCustomerLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
            
          },
          (error) => {
            console.error("Error getting location", error);
          }
        );
        
      }, []);
    //   console.log("customer", customerLocation);
      function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; // Distance in km
      }
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
                // const tempList = responseBody.computerList;
                const tempList = responseBody.computerList.map(item => ({
                    ...item,
                    distance: null, // Initialize distance as null
                    shippingCost: null // Initialize shipping cost as null
                }));
                setComputerList(tempList);
                const brandArray = tempList.map(item => item.brand);
                setBrandList([...new Set(brandArray)]);

                const memArr = tempList.map(item=>item.memory);
                setMemoryList([...new Set(memArr)]);

                const storArr = tempList.map(item=>item.storage);
                setStorageList([...new Set(storArr)]);

                const procArr = tempList.map(item=>item.processor);
                setProcessorList([...new Set(procArr)]);

                const pgArr = tempList.map(item=>item.process_generation);
                setProcessGenList([...new Set(pgArr)]);

                const grArr = tempList.map(item=>item.graphics);
                setGraphicsList([...new Set(grArr)]);

                // const du
                setInventory(tempList);
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
   
    function computeUpdatedListWithShipping(computers, customerLocation) {
        return computers.map(computer => {
            const distance = calculateDistance(
                customerLocation.latitude,
                customerLocation.longitude,
                computer.latitude,
                computer.longitude
            );
            const shippingCost = distance * 0.03;
            // console.log("shippingCost ",shippingCost);
            return { ...computer, distance, shippingCost };
        });
    }
    useEffect(() => {
        if (customerLocation && computerList.some(computer => computer.distance === null)) {
            const updatedList = computeUpdatedListWithShipping(computerList, customerLocation);
            setComputerList(updatedList);
        }
    }, [customerLocation, computerList]);
    console.log(computerList);
    const handleCheckboxChange = (event, computerId) =>{
        const isChecked = event.target.checked;

        if (isChecked) {
            // Checkbox is checked, add computer ID to the compareList
            setCompareList((prevList) => [...prevList, computerId]);
        } else {
            // Checkbox is unchecked, remove computer ID from the compareList
            setCompareList((prevList) => prevList.filter((id) => id !== computerId));
        }
    }
    const handleCompareButtonClick = () => {
        // Update the visibility state when the button is clicked
        if(compareList.length > 1){
            setCompVisible(true);
        }
      };
      function renderFeatureCell(compare, index, feature) {
        // console.log("compare : ", compare)
        // console.log("index: ", index)
        const matchingComp = computerList.find(
            (computer) => computer.computer_id === compare
        );
        return (
            <TableCell key={index}>
                {matchingComp && matchingComp[feature] ? matchingComp[feature] : 'N/A'}
            </TableCell>
        );
    }
    // console.log("inventory ", inventory);
    return (
        <div>
            <h1>Store Inventory</h1>
            {successMessage && <p>{successMessage}</p>}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>Compare</TableCell>
                            <TableCell>Computer Name</TableCell>
                            <TableCell>Brand</TableCell>
                            <TableCell>Memory</TableCell>
                            <TableCell>Storage</TableCell>
                            <TableCell>Processor</TableCell>
                            <TableCell>Process Generation</TableCell>
                            <TableCell>Graphics</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Distance</TableCell>
                            <TableCell>Shipping</TableCell>
                            
                            <TableCell>Buy</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {computerList.map((item) => (
                            <TableRow key={item.computer_id}>
                                <TableCell>
                                <Checkbox
                                    onChange={(event) =>
                                    handleCheckboxChange(event, item.computer_id)
                                  }
                                />
                                </TableCell>
                                <TableCell>{item.computer_name}</TableCell>
                                <TableCell>{item.brand}</TableCell>
                                <TableCell>{item.memory}</TableCell>
                                <TableCell>{item.storage}</TableCell>
                                <TableCell>{item.processor}</TableCell>
                                <TableCell>{item.process_generation}</TableCell>
                                <TableCell>{item.graphics}</TableCell>
                                <TableCell>{item.price}</TableCell>
                                <TableCell>{item.distance ? `${item.distance.toFixed(2)} miles` : 'N/A'}</TableCell>
                                <TableCell>{item.shippingCost ? `$${item.shippingCost.toFixed(2)}` : 'N/A'}</TableCell>
                                {/* Add other necessary cells */}
                                <TableCell>
                                    <Button onClick={() => handleBuy(item.computer_id)}>Buy</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button variant='contained' sx={{top: 15, left: 25}} onClick={handleCompareButtonClick}>Compare selected computers</Button>
            {compVisible && compareList.length > 1 ? (
            <>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{fontWeight: 'bold'}}>Features</TableCell>
                                {compareList.map((compare, index) => (
                                    <TableCell key={index} style={{fontWeight: 'bold'}}>{compare}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell style={{fontWeight: 'bold'}}>Brand</TableCell>
                                {compareList.map((compare, index) => renderFeatureCell(compare, index, 'brand'))}
                            </TableRow>
                            <TableRow>
                                <TableCell style={{fontWeight: 'bold'}}>Price</TableCell>
                                {compareList.map((compare, index) => renderFeatureCell(compare, index, 'price'))}
                            </TableRow>
                            <TableRow>
                                <TableCell style={{fontWeight: 'bold'}}>Shipping Price</TableCell>
                                {compareList.map((compare, index) => renderFeatureCell(compare, index, 'shippingCost'))}
                            </TableRow>
                            <TableRow>
                                <TableCell style={{fontWeight: 'bold'}}>Memory</TableCell>
                                {compareList.map((compare, index) => renderFeatureCell(compare, index, 'memory'))}
                            </TableRow>
                            <TableRow>
                                <TableCell style={{fontWeight: 'bold'}}>Storage</TableCell>
                                {compareList.map((compare, index) => renderFeatureCell(compare, index, 'storage'))}
                            </TableRow>
                            <TableRow>
                                <TableCell style={{fontWeight: 'bold'}}>Processor</TableCell>
                                {compareList.map((compare, index) => renderFeatureCell(compare, index, 'processor'))}
                            </TableRow>
                            <TableRow>
                                <TableCell style={{fontWeight: 'bold'}}>Processor Generation</TableCell>
                                {compareList.map((compare, index) => renderFeatureCell(compare, index, 'process_generation'))}
                            </TableRow>
                            <TableRow>
                                <TableCell style={{fontWeight: 'bold'}}>Graphics</TableCell>
                                {compareList.map((compare, index) => renderFeatureCell(compare, index, 'graphics'))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        ) : (
            <p>No computers selected for comparison.</p>
        )}
        </div>
    );
}
export default StoreDetail;