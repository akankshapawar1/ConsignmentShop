import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import './customer.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import laptopImage from './laptop.png';

function Customer(){
    const [buyComputer, setBuyComputer] = useState(null)
    const [computerList, setComputerList] = useState([])

    // brandList, memoryList ,storageList, processorList, processGenList, graphicsList
    const [brandList, setBrandList] = useState([])
    const [memoryList, setMemoryList] = useState([])
    const [storageList, setStorageList] = useState([])
    const [processorList, setProcessorList] = useState([])
    const [processGenList, setProcessGenList] = useState([])
    const [graphicsList, setGraphicsList] = useState([])

    // display all stores
    const [storeId, setStoreId] = useState([]);
    const [storeName, setStoreName] = useState([]);

    // compare computers
    const [compareList, setCompareList] = useState([]);
    const [compVisible, setCompVisible] = useState(false);

    const [successMessage, setSuccessMessage] = useState('');

    // searchbar
    const [searchInput, setSearchInput] = useState("");
    const [selectedValue, setSelectedValue] = React.useState('');
    const [customerLocation, setCustomerLocation] = useState(null);
    const searchBar = () => {}

    useEffect(() => {
        // Call the displayAllComputers function when the component mounts
        displayAllComputers();
    }, []);

    useEffect(() => {
        console.log('compare list ',compareList);
    },[compareList]);

    const handleRadioChange = (event) =>{
        setBuyComputer(event.target.value);
    }
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
    //   console.log(customerLocation)
      
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

    function renderFeatureCell(compare, index, feature) {
        const matchingComp = computerList.find(
            (computer) => computer.computer_id === compare
        );
        return (
            <TableCell key={index}>
                {matchingComp && matchingComp[feature] ? matchingComp[feature] : 'N/A'}
            </TableCell>
        );
    }
    const navigate = useNavigate();
    const handleStoreClick = (storeId) => {
        
        // Navigate to a new route, you can replace '/store-detail' with your desired path
        // Pass storeId as a state or parameter depending on your routing setup
        navigate(`/store-detail/${storeId}`);
    }
    async function showAllStores(){
        const requestBody = { body : JSON.stringify({
            action: 'displayStoresToDelete'
            })
        };

        const responseData = await fetchData(requestBody);

        if (responseData.statusCode === 200){
            const parsedList = JSON.parse(responseData.body);
            // console.log('Retrieved stores: ', parsedList.storeList)
            const temp = parsedList.storeList
            const names = temp.map(item => item.store_name);
            setStoreName(names)
            const ids = temp.map(item=>item.store_id)
            setStoreId(ids)
        }else{
            console.log('Failed');
        }
    }

    async function displayAllComputers(){
        const requestBody = { body : JSON.stringify({
            action: 'displayAllComputers'
            })
        };

        const responseData = await fetchData(requestBody);

        // console.log('Response data computer list: ',responseData);

        if (responseData.statusCode === 200) {
            const parsedList = JSON.parse(responseData.body);
            console.log(parsedList);
            const tempList = parsedList.computerList.map(item => ({
                ...item,
                distance: null, // Initialize distance as null
                shippingCost: null // Initialize shipping cost as null
            }));
            setComputerList(tempList);

            // brandList, memoryList ,storageList, processorList, processGenList, graphicsList
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

        } else {
            console.log(responseData);  
            console.log('Failed');
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
            return { ...computer, distance, shippingCost };
        });
    }
    
    useEffect(() => {
        if (customerLocation && computerList.some(computer => computer.distance === null)) {
            const updatedList = computeUpdatedListWithShipping(computerList, customerLocation);
            setComputerList(updatedList);
        }
    }, [customerLocation, computerList]);
    async function buyComputerAction(computerId) {
        // Use `computerId` directly instead of `buyComputer` state.
        if(computerId) {
            const requestBody = {
                body: JSON.stringify({
                    action: 'buyComputer',
                    computer_id: computerId // Modified line
                })
            }; 
            console.log('Computer to be sold: ', computerId); // Modified line
    
            const responseData = await fetchData(requestBody);
            if(responseData.statusCode === 200){
                console.log('Sold the computer', responseData);
                setSuccessMessage('Computer has been shipped!');
                await displayAllComputers();
            } else {
                console.log('Failed to sell the computer');
                setSuccessMessage('Failed to buy the computer.');
            }
        }
    }
    // computer_id, store_id, brand, price, memory, storage, processor, process_generation, graphics
    return (
        <>
        <div className="flex-container">
            <aside className="flex-filter">
                <p><b>Filters</b></p>
                {brandList && brandList.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Brand</th>
                                </tr>
                            </thead>
                            <tbody>
                                {brandList.map((brand, index) => (
                                    <tr key={index}>
                                        <td>
                                            <label>
                                                <input type='checkbox' value={brand} name='checkBrand' />
                                            </label>
                                            {brand}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <table>
                        <thead>
                            <tr>
                                <th>Memory</th>
                            </tr>
                        </thead>
                        <tbody>
                            {memoryList.map((memory, index2) => (
                                <tr key={index2}>
                                    <td><label><input type='checkbox'
                                        value={memory}
                                        name='checkMemory'
                                    ></input></label>
                                    {memory}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table> 

                    <table>
                        <thead>
                            <tr>
                                <th>Storage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {storageList.map((storage, index3) => (
                                <tr key={index3}>
                                    <td><label><input type='checkbox'
                                        value={storage}
                                        name='checkStorage'
                                    ></input></label>
                                    {storage}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table> 

                    <table>
                        <thead>
                            <tr>
                                <th>Processor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processorList.map((processor, index4) => (
                                <tr key={index4}>
                                    <td><label><input type='checkbox'
                                        value={processor}
                                        name='checkProcessor'
                                    ></input></label>
                                    {processor}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table> 

                    <table>
                        <thead>
                            <tr>
                                <th>Processor Generation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processGenList.map((process_generation, index5) => (
                                <tr key={index5}>
                                    <td><label><input type='checkbox'
                                        value={process_generation}
                                        name='checkProcessGen'
                                    ></input></label>
                                    {process_generation}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table> 

                    <table>
                        <thead>
                            <tr>
                                <th>Graphics</th>
                            </tr>
                        </thead>
                        <tbody>
                            {graphicsList.map((graphics, index6) => (
                                <tr key={index6}>
                                    <td><label><input type='checkbox'
                                        value={graphics}
                                        name='checkProcessGen'
                                    ></input></label>
                                    {graphics}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                        {/* Repeat the structure for Memory, Storage, Processor, Processor Generation, Graphics */}
                        {/* ... */}
                    </>
                ) : (
                    <p>No filters available.</p>
                )}
                <Button variant='contained' sx={{ top: 25 }}>Filter</Button>
            </aside>
            <main className="flex-main">
            <section className="flex-list">
                
                {successMessage && <div>{successMessage}</div>}
                <div style={{ display: 'block', gap: '10px', justifyContent: 'center'  }}>
                    {computerList.map((computer, index) => (
                        <Card className="product-card" key={index}>
                             <img src={laptopImage} alt="Computer" className="product-image" />
                            <CardContent className="product-details">
                            <Typography gutterBottom variant="h6" component="div">
                                        {computer.computer_name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Store ID: {computer.store_id}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Brand: {computer.brand}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Memory: {computer.memory}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Storage: {computer.storage}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Processor: {computer.processor}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Process Generation: {computer.process_generation}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Graphics: {computer.graphics}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Distance: {computer.distance ? `${computer.distance.toFixed(2)} miles` : 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Shipping Cost: {computer.shippingCost ? `$${computer.shippingCost.toFixed(2)}` : 'N/A'}
                                    </Typography>
                                    {/* <Typography variant="body2" color="text.secondary">
                                        Price: {computer.price}
                                    </Typography> */}
                            </CardContent>
                            <CardActions disableSpacing>
                                <Checkbox onChange={(event) => handleCheckboxChange(event, computer.computer_id)} />
                                {/* <Button size="small" onClick={() => setBuyComputer(computer.computer_id)} sx={{ mt: 2 }}>Buy</Button> */}
                                <Button size="small" onClick={() => buyComputerAction(computer.computer_id)}>Buy</Button>
                                <Typography variant="h6" color="primary" sx={{ marginLeft: 'auto' }} className="product-price">
                                        ${computer.price}
                                    </Typography>
                            </CardActions>

                        </Card>
                    ))}
                </div>
                {/* <Button variant='contained' onClick={buyComputerAction} sx={{ mt: 2 }}>Buy Selected Computer</Button> */}
                
            </section>
            </main>
            
        </div>
        <Button variant='contained' onClick={handleCompareButtonClick} sx={{ position: "fixed", top: 100, right: 50, zIndex: 2000 }}>Compare Selected Computers</Button>

        <div>
            <Box textAlign='right'>
                <Button variant='contained' sx={{ position: "fixed", top: 50, right: 50, zIndex: 2000 }} onClick={showAllStores}>
                    Show all stores
                </Button>
            </Box>
        </div>

        <div className="store-display">
            <div style={{ width: '100%' }}>
                {storeId && storeId.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold' }}>Store ID</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Store Name</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {storeId.map((store_id, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{store_id}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleStoreClick(store_id)}>
                                                {storeName[index]}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <p></p>
                )}

                {compVisible && compareList.length > 1 ? (
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
                                <TableCell style={{fontWeight: 'bold'}}>Shipping Cost</TableCell>
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
                ) : (
                    <p></p>
                )}
                
            </div>
            
        </div>
        
        
        </>
        
    );
}
export default Customer;
