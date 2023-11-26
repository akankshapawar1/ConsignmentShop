import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { AppBar, Toolbar, makeStyles, TextField } from '@material-ui/core';
import Button from '@mui/material/Button';
import './customer.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import laptopImage from './laptop.png'; 

const libraries = ["places"];

const useStyles = makeStyles((theme) => ({
    appBar: {
      backgroundColor: theme.palette.primary.main, // Customize the background color
    },
    title: {
      flexGrow: 1,
    },
    button: {
      marginLeft: theme.spacing(2),
    },
  }));

const API_KEY = 'AIzaSyD6BrH9vtqJr84LBDRpy1f-_0g0sGAl0Eo';

function Customer(){
    const navigate = useNavigate();
    const classes = useStyles();

    const [computerList, setComputerList] = useState([])
    // brandList, memoryList ,storageList, processorList, processGenList, graphicsList
    const priceFilter = ['$2001 or more', '$1501 - $2000', '$1001 - $1500', '$501 - $1000', '$500 or less']
    const brandFilter = ['Dell','HP','Lenovo', 'Apple', 'Acer', 'Asus', 'Toshiba'];
    const memoryFilter = ['32GB or more', '16GB', '12GB', '8GB', '4GB or less']
    const storageFilter = ['2TB or more', '1TB', '512GB', '256GB or less']
    const processorFilter = ['Intel', 'AMD']
    const processGenFilter = ['13th Gen Intel','12th Gen Intel','11th Gen Intel','AMD Ryzen 7000 Series','AMD Ryzen 6000 Series']
    const graphicsFilter = ['NVIDIA','AMD','Intel']

    const [graphicsSelected, setGraphicsSelected] = useState([]);
    const [generationSelected, setGenerationSelected] = useState([]);
    const [processorSelected, setProcessorSelected] = useState([]);
    const [storageSelected, setStorageSelected] = useState([]);
    const [memorySelected, setMemorySelected] = useState([]);
    const [brandSelected, setBrandSelected] = useState([]);
    const [priceSelected, setPriceSelected] = useState([]);
    const [filteredComputers, setFilteredComputers] = useState([]);
    const [showAlert, setShowAlert] = useState(false);

    // display all stores
    const [storeId, setStoreId] = useState([]);
    const [storeName, setStoreName] = useState([]);

    // compare computers
    const [compareList, setCompareList] = useState([]);
    const [compVisible, setCompVisible] = useState(false);

    const [successMessage, setSuccessMessage] = useState('');
    const [showStores, setShowStores] = useState(false);
    const [showCompare, setShowCompare] = useState(false);
    const [address, setAddress] = useState("");
    const [customerLocation, setCustomerLocation] = useState(null);
    const autocompleteRef = useRef(null);

    const navigateToLogin = () => {
        navigate('/login');
    };

    useEffect(() => {
        displayAllComputers();
    }, [customerLocation]);

    useEffect(() => {
        if (showAlert) {
            alert(successMessage);
            setShowAlert(false);
        }
    }, [showAlert, successMessage]);

    useEffect(() => {
        filterList();
    }, [graphicsSelected, generationSelected, processorSelected, storageSelected, memorySelected, brandSelected, priceSelected]);

    const updatedListWithShipping = useMemo(() => {
        return customerLocation && filteredComputers.some(computer => computer.distance === null)
            ? computeUpdatedListWithShipping(filteredComputers, customerLocation)
            : filteredComputers;
    }, [customerLocation, filteredComputers]);

    useEffect(() => {
        setFilteredComputers(updatedListWithShipping);
    }, [updatedListWithShipping]); 
    
    const handleLoad = (autoC) => {
        autocompleteRef.current = autoC;
    };
    
    const handlePlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            setAddress(place.formatted_address);
            const latitude = place.geometry.location.lat();
            const longitude = place.geometry.location.lng();
            setCustomerLocation({
                latitude: latitude,
                longitude: longitude
            });
        }
    };

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

    function computeUpdatedListWithShipping(computers, customerLocation) {
        return computers.map(computer => {
            const distance = calculateDistance(
                customerLocation.latitude,
                customerLocation.longitude,
                computer.latitude,
                computer.longitude
            );
            const shippingCost = distance * 0.03;
            const shippingCost2 = shippingCost.toFixed(2)
            return { ...computer, distance, shippingCost2 };
        });
    }

    const handleCheckboxChange = (event, computerId) =>{
        const isChecked = event.target.checked;
        if (isChecked) {
            setCompareList((prevList) => [...prevList, computerId]);
        } else {
            setCompareList((prevList) => prevList.filter((id) => id !== computerId));
        }
    }

    const handleCompareButtonClick = () => {
        if(showCompare)
        {
            setShowCompare(false);
        }
        else{
        setShowCompare(true);
        }
        setShowStores(false);
        setTimeout(() => {
            const element = document.querySelector(".store-display");
            if (element) {
                window.scrollTo({
                    left: 0,
                    top: element.offsetTop,
                    behavior: "smooth"
                });
            }
        }, 0);
        if(compareList.length > 1){
            setCompVisible(true);
        }
    };

    const graphicsCheckboxChange = (event, graphics) => {
        const isChecked = event.target.checked;
        let gList = [];
        if (graphics === 'AMD') {
            gList = ['AMD Radeon Pro W6300', 'AMD Radeon Pro W6400'];
        } else if (graphics === 'Intel') {
            gList = ['Intel Integrated Graphics', 'Intel UHD Graphics 730', 'Intel UHD Graphics 770'];
        } else {
            gList = ['NVIDIA GeForce RTX 4090', 'NVIDIA GeForce RTX 4080'];
        }
    
        if (isChecked) {
            setGraphicsSelected(prevList => [...new Set([...prevList, ...gList])]);
        } else {
            setGraphicsSelected(prevList => prevList.filter(g => !gList.includes(g)));
        }
    }
    
    const generationCheckboxChange = (event, generation) =>{
        const isChecked = event.target.checked;
        if (isChecked){
            setGenerationSelected((prevList) => [...prevList, generation])
        }else{
            setGenerationSelected((prevList) => prevList.filter(g => g !== generation))
        }
    }

    const processorCheckboxChange = (event, processor) =>{
        const isChecked = event.target.checked;
        let gList = [];
        if (processor === 'Intel') {
            gList = ['Intel Xion', 'Intel i9', 'Intel i7'];
        } else {
            gList = ['AMD Ryzen 9', 'AMD Ryzen 7'];
        }
        if (isChecked){
            setProcessorSelected(prevList => [...new Set([...prevList, ...gList])])
        }else{
            setProcessorSelected((prevList => prevList.filter(g => !gList.includes(g))))
        }
    }

    const storageCheckboxChange = (event, storage) =>{
        const isChecked = event.target.checked;
        let gList = [];
        if (storage === '2TB or more'){
            gList = ['2TB']
        }else if (storage === '1TB'){
            gList = ['1TB']
        }else if(storage === '512GB'){
            gList = ['512GB']
        }else{
            gList = ['256GB', '128GB']
        }
        if (isChecked){
            setStorageSelected(prevList => [...new Set([...prevList, ...gList])])
        }else{
            setStorageSelected((prevList => prevList.filter(g => !gList.includes(g))))
        }
    }

    const memoryCheckboxChange = (event, memory) =>{
        const isChecked = event.target.checked;
        let gList = [];
        // '32GB or more', '16GB', '8GB', '4GB or less'
        if (memory === '32GB or more'){
            gList = ['32GB']
        }else if (memory === '16GB'){
            gList = ['16GB']
        }else if (memory === '12GB'){
            gList = ['12GB']
        }else if(memory === '8GB'){
            gList = ['8GB']
        }else{
            gList = ['4GB', '1GB']
        }
        if (isChecked){
            setMemorySelected(prevList => [...new Set([...prevList, ...gList])])
        }else{
            setMemorySelected((prevList => prevList.filter(g => !gList.includes(g))))
        }
    }

    const brandCheckboxChange = (event, brand) =>{
        const isChecked = event.target.checked;
        if (isChecked){
            setBrandSelected((prevList) => [...prevList, brand])
        }else{
            setBrandSelected((prevList) => prevList.filter(g => g !== brand))
        }
    }

    const parsePriceRange = (range) => {
        if (range.includes("or less")) {
            const max = Number(range.replace(/[$ or less]/g, ''));
            return { min: 0, max };
        } else if (range.includes("or more")) {
            const min = Number(range.replace(/[$ or more]/g, ''));
            return { min, max: Number.MAX_SAFE_INTEGER };
        } else {
            const [min, max] = range.split(' - ').map(price => {
                return price.replace(/[$,]/g, '');
            }).map(Number);
    
            return { min: min || 0, max: max || Number.MAX_SAFE_INTEGER };
        }
    };
    

    const priceCheckboxChange = (event, priceRange) =>{
        const isChecked = event.target.checked;
        if (isChecked){
            setPriceSelected((prevList) => [...prevList, priceRange])
        }else{
            setPriceSelected((prevList) => prevList.filter(range => range !== priceRange))
        }
    }

    const filterList = () => {
        let filteredList = computerList;

        if (graphicsSelected.length > 0) {
            filteredList = filteredList.filter(computer => 
                graphicsSelected.includes(computer.graphics)
            );
        }

        if (generationSelected.length > 0) {
            filteredList = filteredList.filter(computer => 
                generationSelected.includes(computer.process_generation)
            );
        }

        if(processorSelected.length > 0){
            filteredList = filteredList.filter(computer =>
                processorSelected.includes(computer.processor)
            );
        }

        if(storageSelected.length > 0){
            filteredList = filteredList.filter(computer =>
                storageSelected.includes(computer.storage)
            );
        }

        if(memorySelected.length > 0){
            filteredList = filteredList.filter(computer =>
                memorySelected.includes(computer.memory)
            );
        }

        if(brandSelected.length > 0){
            filteredList = filteredList.filter(computer =>
                brandSelected.includes(computer.brand)
            );
        }

        if (priceSelected.length > 0) {
            filteredList = filteredList.filter(computer => {
                return priceSelected.some(range => {
                    const { min, max } = parsePriceRange(range);
                    return computer.price >= min && computer.price <= max;
                });
            });
        }

        setFilteredComputers(filteredList);
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

    function renderFeatureCell(compare, index, feature) {
        const matchingComp = filteredComputers.find(
            (computer) => computer.computer_id === compare
        );
        return (
            <TableCell key={index}>
                {matchingComp && matchingComp[feature] ? matchingComp[feature] : 'N/A'}
            </TableCell>
        );
    }

    const handleStoreClick = (storeId) => {
        navigate(`/store-detail/${storeId}`);
    }

    async function showAllStores(){
        if(showStores)
        {
            setShowStores(false);
        }
        else{
            setShowStores(true);
        }
        setShowCompare(false);
        setTimeout(() => {
            const element = document.querySelector(".store-display");
            if (element) {
                window.scrollTo({
                    left: 0,
                    top: element.offsetTop,
                    behavior: "smooth"
                });
            }
        }, 250);
        const requestBody = { body : JSON.stringify({
            action: 'displayStoresToDelete'
            })
        };

        const responseData = await fetchData(requestBody);

        if (responseData.statusCode === 200){
            const parsedList = JSON.parse(responseData.body);
            const temp = parsedList.storeList
            const names = temp.map(item => item.store_name);
            setStoreName(names)
            const ids = temp.map(item=>item.store_id)
            setStoreId(ids)
        }else{
            console.log('Failed');
        }
    }

    const sortedComputerList = filteredComputers.sort((a, b) => {
        return a.distance - b.distance;
    });

    async function displayAllComputers(){
        const requestBody = { body : JSON.stringify({
            action: 'displayAllComputers'
            })
        };

        const responseData = await fetchData(requestBody);

        if (responseData.statusCode === 200) {
            const parsedList = JSON.parse(responseData.body);
            const tempList = parsedList.computerList.map(item => ({
                ...item,
                distance: null, 
                shippingCost: null 
            }));
            setComputerList(tempList);
            setFilteredComputers(tempList)
        } else {
            console.log('Failed');
        }
    }

    async function buyComputerAction(computerId) {
        if(computerId) {
            const requestBody = {
                body: JSON.stringify({
                    action: 'buyComputer',
                    computer_id: computerId 
                })
            }; 
            console.log('Computer to be sold: ', computerId); 
    
            const responseData = await fetchData(requestBody);
            if(responseData.statusCode === 200){
                console.log('Sold the computer', responseData);
                setSuccessMessage('Computer has been shipped!');
                setShowAlert(true);
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

        <AppBar position="static" className={classes.appBar}>
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                Lhotse Computer Consignment Shop
                </Typography>
                <Button color="inherit" className={classes.button} onClick={navigateToLogin}>
                Login
                </Button>
                <Button color="inherit" className={classes.button} onClick={()=> showAllStores()}>
                Show all stores
                </Button>
            </Toolbar>
            </AppBar>
        <div className="flex-container">
        <div className="flex-filter">
                    <>
                    <table>
                        <thead>
                            <tr>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {priceFilter.map((price, index) => (
                                <tr key={index}>
                                    <td><label>
                                            <Checkbox
                                                value={price}
                                                name='checkPrice'
                                                onChange={(event) =>
                                                priceCheckboxChange(event, price)
                                            }/>
                                        </label>
                                    {price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Brand</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brandFilter.map((brand, index) => (
                                <tr key={index}>
                                    <td><label>
                                            <Checkbox
                                                value={brand}
                                                name='checkBrand'
                                                onChange={(event) =>
                                                brandCheckboxChange(event, brand)
                                            }/>
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
                            {memoryFilter.map((memory, index2) => (
                                <tr key={index2}>
                                    <td><label>
                                        <Checkbox
                                            value={memory}
                                            name='checkMemory'
                                            onChange={(event) =>
                                            memoryCheckboxChange(event, memory)
                                        }/>
                                    </label>
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
                            {storageFilter.map((storage, index3) => (
                                <tr key={index3}>
                                    <td><label>
                                        <Checkbox
                                            value={storage}
                                            name='checkStorage'
                                            onChange={(event) =>
                                            storageCheckboxChange(event, storage)
                                        }/>
                                    </label>
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
                            {processorFilter.map((processor, index4) => (
                                <tr key={index4}>
                                    <td><label>
                                        <Checkbox
                                            value={processor}
                                            name='checkProc'
                                            onChange={(event) =>
                                            processorCheckboxChange(event, processor)
                                        }/>
                                    </label>
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
                            {processGenFilter.map((process_generation, index5) => (
                                <tr key={index5}>
                                    <td><label>
                                        <Checkbox
                                        value={process_generation}
                                        name='checkGen'
                                        onChange={(event) =>
                                        generationCheckboxChange(event, process_generation)
                                    }/>
                                    </label>
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
                            {graphicsFilter.map((graphics, index6) => (
                                <tr key={index6}>
                                    <td><label>
                                    <Checkbox
                                    value={graphics}
                                    name='checkGraphics'
                                    onChange={(event) =>
                                        graphicsCheckboxChange(event, graphics)
                                    }
                                    /></label>
                                    {graphics}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table> 
                    </>
            </div>

            <div className="flex-list">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <LoadScript
                    googleMapsApiKey={API_KEY}
                    libraries={libraries}>
                <Autocomplete
                    onLoad={handleLoad}
                    onPlaceChanged={handlePlaceChanged}>
                <TextField id="outlined-basic" label="Enter address" variant="outlined" fullWidth style={{ width: '600px' }} 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}/>
                </Autocomplete></LoadScript>
                {/* {successMessage && <div style={{ color: 'red', fontWeight: 'bold' }}>{successMessage}</div>} */}
                {filteredComputers && filteredComputers.length > 0 ? (
                    sortedComputerList.map((computer, index) => (
                        <Card className="product-card" key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', maxWidth: '1200px', overflow: 'hidden' }}>
                            <img src={laptopImage} alt="Computer" style={{ width: '50%', objectFit: 'cover' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', width: '50%', padding: '20px' }}>
                                <CardContent className="product-details">
                                    <Typography gutterBottom variant="h6" component="div">
                                        {computer.computer_name}
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
                                        Price: {computer.price}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Distance: {computer.distance ? `${computer.distance.toFixed(2)} miles` : 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Shipping Cost: {computer.shippingCost2 ? `$${computer.shippingCost2}` : 'N/A'}
                                    </Typography>
                                </CardContent>
                                <CardActions disableSpacing style={{ marginTop: 'auto' }}>
                                    <Checkbox onChange={(event) => handleCheckboxChange(event, computer.computer_id)} />
                                    <Button size="small" variant='contained' onClick={() => buyComputerAction(computer.computer_id)}>Buy</Button>
                                    <Typography variant="h6" color="primary" sx={{ marginLeft: 'auto' }} className="product-price">
                                        ${computer.price}
                                    </Typography>
                                </CardActions>
                            </div>
                        </Card>
                    ))
                ) : (
                    <p>No computers to display</p>
                )}
                </div>
        </div>
        </div>
        <Button variant='contained' onClick={handleCompareButtonClick} sx={{ position: "fixed", top: 100, right: 50, zIndex: 2000 }}>Compare Selected Computers</Button>

        <div className="store-display">
            <div style={{ width: '100%' }}>
                {showStores&& storeId && storeId.length > 0 ? (
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

                {showCompare && compVisible && compareList.length > 1 ? (
                    <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{fontWeight: 'bold'}}>Features</TableCell>
                                {compareList.map((compare, index) => renderFeatureCell(compare, index, 'computer_name'))}
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
                                {compareList.map((compare, index) => renderFeatureCell(compare, index, 'shippingCost2'))}
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
