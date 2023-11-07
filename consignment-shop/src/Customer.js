import React, { useState, useEffect } from 'react';
import './customer.css';

function Customer(){
    const [buyComputer, setBuyComputer] = useState(null)
    const [computerList, setComputerList] = useState([])
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        // Call the displayAllComputers function when the component mounts
        displayAllComputers();
    }, []);

    /* useEffect(() => {
        console.log('Selected computer: ', buyComputer);
    }, [buyComputer]);  */   

    const handleRadioChange = (event) =>{
        setBuyComputer(event.target.value);
    }

    async function displayAllComputers(){
        const requestBody = { body : JSON.stringify({
            action: "displayAllComputers"
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
                const parsedList = JSON.parse(responseData.body);
                console.log("Parsed list: ",parsedList);
                setComputerList(parsedList.computerList);
            } else {
                console.log('Failed');
            }

        }catch(error){
            console.log('Error fetching computer list ',error);
        }

    }

    async function buyComputerAction(){
        if(buyComputer){
            
            const requestBody = { body : JSON.stringify({
                action:'buyComputer',
                computer_id : buyComputer
                })
            }; 

            console.log("Computer to be sold ",requestBody.computer_id);

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
                    console.log('Sold the computer', responseData2);
                    setSuccessMessage('Computer has been shipped!');
                    await displayAllComputers();
                    setBuyComputer(null);
                }else{
                    console.log('Failed to sell the computer');
                    setSuccessMessage('Failed to buy the computer.');
                }
            }catch(error){
                console.log('Failed to sell the computer', error);
                setSuccessMessage('Error occurred while trying to buy the computer.');
            }
        }
    }
    // computer_id, store_id, brand, price, memory, storage, processor, process_generation, graphics
    return(
        
        <><div className="container">
            <div className="filter-section">
                {/* Filters will go here */}
            </div>
            <div className="main-content">
                {/* Existing content will go here, like your table and other components */}
            </div>
        
                {successMessage && <div className='successmessage'>{successMessage}</div>}
                <div className='cust'><h1>Customer</h1></div>
                {/*<button className='button' onClick={() => displayAllComputers()}>Display All Computers</button>*/}
                <div>
                    {computerList && computerList.length > 0 ? (
                        <><table>
                            <thead>
                                <tr>
                                    <th>Computer ID</th>
                                    <th>Store ID</th>
                                    <th>Brand</th>
                                    <th>Price</th>
                                    <th>Memory</th>
                                    <th>Storage</th>
                                    <th>Processor</th>
                                    <th>Process Generation</th>
                                    <th>Graphics</th>
                                    <th>Buy</th>
                                </tr>
                            </thead>
                            <tbody>
                                {computerList.map((computer, index) => (
                                    <tr key={index}>
                                        <td>{computer.computer_id}</td>
                                        <td>{computer.store_id}</td>
                                        <td>{computer.brand}</td>
                                        <td>{computer.price}</td>
                                        <td>{computer.memory}</td>
                                        <td>{computer.storage}</td>
                                        <td>{computer.processor}</td>
                                        <td>{computer.process_generation}</td>
                                        <td>{computer.graphics}</td>
                                        <td><label><input type='radio'
                                            value={computer.computer_id}
                                            name='buyComputer'
                                            onChange={handleRadioChange}
                                        ></input></label>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                            <button className='button' onClick={() => buyComputerAction()}>Buy selected computer</button>
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