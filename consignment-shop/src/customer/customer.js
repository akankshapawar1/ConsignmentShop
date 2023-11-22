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

function Customer(){
    const [buyComputer, setBuyComputer] = useState(null)
    const [computerList, setComputerList] = useState([])

    const navigate = useNavigate();

    // brandList, memoryList ,storageList, processorList, processGenList, graphicsList
    const priceFilter = ['$2001 or more', '$1501 - $2000', '$1001 - $1500', '$501 - $1000', '$500 or less']
    const brandFilter = ['Dell','HP','Lenovo', 'Apple', 'Acer', 'Asus', 'Toshiba'];
    const memoryFilter = ['32GB or more', '16GB', '8GB', '4GB or less']
    const storageFilter = ['2TB or more', '1TB', '512GB', '256GB or less']
    const processorFilter = ['Intel', 'AMD']
    const processGenFilter = ['13th Gen Intel','12th Gen Intel','11th Gen Intel','AMD Ryzen 7000 Series','AMD Ryzen 6000 Series']
    const graphicsFilter = ['NVIDIA','AMD','Intel']

    const [graphicsSelected, setGraphicsSelected] = useState([]);
    const [generationSelected, setGenerationSelected] = useState([]);
    const [filteredComputers, setFilteredComputers] = useState([]);

    // display all stores
    const [storeId, setStoreId] = useState([]);
    const [storeName, setStoreName] = useState([]);

    // compare computers
    const [compareList, setCompareList] = useState([]);
    const [compVisible, setCompVisible] = useState(false);

    const [successMessage, setSuccessMessage] = useState('');

    const [selectedValue, setSelectedValue] = React.useState('');

    const navigateToLogin = () => {
        navigate('/login');
    };

    useEffect(() => {
        // Call the displayAllComputers function when the component mounts
        displayAllComputers();
    }, []);

    useEffect(() => {
        filterList();
    }, [graphicsSelected]);

    const handleRadioChange = (event) =>{
        setBuyComputer(event.target.value);
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
    
    const filterList = () => {
        if (graphicsSelected.length === 0 && generationSelected === 0) {
            setFilteredComputers(computerList); // No filter applied
        } else {
            const filteredList = computerList.filter(computer => 
                graphicsSelected.includes(computer.graphics)
            );
            /* const filteredList2 = computerList.filter(computer => 
                generationSelected.includes(computer.process_generation)
            ); */
            setFilteredComputers(filteredList);
        }
    }
    
    const generationCheckboxChange = (event, generation) =>{
        const isChecked = event.target.isChecked;
        if (isChecked){
            setGenerationSelected((prevList) => [...prevList, generation])
        }else{
            setGenerationSelected((prevList) => prevList.filter(generation => !generation))
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
            const tempList = parsedList.computerList
            setComputerList(tempList);
            setFilteredComputers(tempList)
        } else {
            console.log('Failed');
        }
    }

    async function buyComputerAction(){
        if(buyComputer){
            const requestBody = { body : JSON.stringify({
                action:'buyComputer',
                computer_id : buyComputer
                })
            }; 
            console.log('Computer to be sold: ',requestBody.computer_id);

            const responseData2 = await fetchData(requestBody);

            // console.log('Response data for buy computer: ',responseData2);

            if(responseData2.statusCode === 200){
                console.log('Sold the computer', responseData2);
                setSuccessMessage('Computer has been shipped!');
                await displayAllComputers();
                setBuyComputer(null);
            }else{
                console.log('Failed to sell the computer');
                setSuccessMessage('Failed to buy the computer.');
            }
        }
    }

    // computer_id, store_id, brand, price, memory, storage, processor, process_generation, graphics
    return(
        <><div className="flex-container">
            <div className="flex-filter">
                {/* <p><b>Filters</b></p> */}
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
                                    <td><label><input type='checkbox'
                                        value={price}
                                        name='checkPrice'
                                    ></input></label>
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
                                    <td><label><input type='checkbox'
                                        value={brand}
                                        name='checkBrand'
                                    ></input></label>
                                    {brand}</td>
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
                            {storageFilter.map((storage, index3) => (
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
                            {processorFilter.map((processor, index4) => (
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
                            {processGenFilter.map((process_generation, index5) => (
                                <tr key={index5}>
                                    <td><label>
                                        {/* <input type='checkbox'
                                        value={process_generation}
                                        name='checkProcessGen'/> */}
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
                                    <td><label>{/* <input type='checkbox'
                                        value={graphics}
                                        name='checkProcessGen'
                                    ></input> */}
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
                <Button variant='contained' sx={{top: 25}}>Filter</Button>
            </div>
            
            <div className="flex-list">
            <TextField id="search" label="location" variant="filled" fullWidth/>
            <br></br>
            <br></br>
            {successMessage && <div>{successMessage}</div>}
                {/* {computerList && computerList.length > 0 ? (  */}
                {filteredComputers && filteredComputers.length > 0 ? (
                    <><TableContainer component={Paper}>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ fontWeight: 'bold' }}>Compare</TableCell>
                          <TableCell style={{ fontWeight: 'bold' }}>Computer Name</TableCell>
                          <TableCell style={{ fontWeight: 'bold' }}>Brand</TableCell>
                          <TableCell style={{ fontWeight: 'bold' }}>Price</TableCell>
                          <TableCell style={{ fontWeight: 'bold' }}>Memory</TableCell>
                          <TableCell style={{ fontWeight: 'bold' }}>Storage</TableCell>
                          <TableCell style={{ fontWeight: 'bold' }}>Processor</TableCell>
                          <TableCell style={{ fontWeight: 'bold' }}>Processor Generation</TableCell>
                          <TableCell style={{ fontWeight: 'bold' }}>Graphics</TableCell>
                          <TableCell style={{ fontWeight: 'bold' }}>Shipping</TableCell>
                          <TableCell style={{ fontWeight: 'bold' }}>Buy</TableCell> 
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredComputers.map((computer, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Checkbox
                                onChange={(event) =>
                                    handleCheckboxChange(event, computer.computer_id)
                                  }
                              />
                            </TableCell>
                            <TableCell>{computer.computer_name}</TableCell>
                            <TableCell>{computer.brand}</TableCell>
                            <TableCell>{computer.price}</TableCell>
                            <TableCell>{computer.memory}</TableCell>
                            <TableCell>{computer.storage}</TableCell>
                            <TableCell>{computer.processor}</TableCell>
                            <TableCell>{computer.process_generation}</TableCell>
                            <TableCell>{computer.graphics}</TableCell>
                            <TableCell>1.99</TableCell>
                            <TableCell>
                              <Radio
                                onChange={handleRadioChange}
                                checked = {selectedValue === computer.computer_id}
                                value = {computer.computer_id}
                                name = "buyComputer"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                        <Button variant='contained' onClick={() => buyComputerAction()} 
                        sx={{top: 25}}>Buy selected computer</Button>

                        <Button variant='contained' sx={{top: 25, left: 25}} onClick={handleCompareButtonClick}>Compare selected computers</Button>
                    </>
                ) : (
                    <p>No computers to display</p>
                )}
            </div>
        </div>
        <div>
        <Box textAlign='right'>
            <Button variant='contained' sx={{ position: "fixed", top: 50, right: 50, zIndex: 2000 }} onClick={()=> showAllStores()}>
            Show all stores
            </Button>
            <Button variant='contained' sx={{ position: "fixed", top: 50, right: 250, zIndex: 2000 }} onClick={navigateToLogin}>
            Login
            </Button>
        </Box>
        </div>
        <div style={{display: 'flex', justifyContent: 'right', alignItems: 'center'}}>
        <div style={{ width: '70%' }}>
        {storeId && storeId.length > 0 ? (
            <>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                          <TableCell style={{ fontWeight: 'bold' }}>Store ID</TableCell>
                          <TableCell style={{ fontWeight: 'bold' }}>Store Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {storeId.map((store_id, index)=>(
                            <TableRow key={index}>
                                <TableCell>{store_id}</TableCell>
                                <TableCell>{storeName[index]}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* <table>
            <thead>
                <tr>
                    <th>Store ID</th>
                    <th>Store Name</th>
                </tr>
            </thead>
            <tbody>
                {storeId.map((store_id, index) => (
                    <tr key={index}>
                        <td>{store_id}</td>
                        <td>{storeName[index]}</td>
                    </tr>
                ))}
            </tbody>
        </table> */}</>
        ):(
            <p></p>
        )}

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
            <p></p>
        )}




        </div>
        </div>
        </>
    ) 
}
export default Customer;
