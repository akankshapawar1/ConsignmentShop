//Delete computer function
async function editPrice(parsedBody, headers) {

    console.log("parseBody: ", parsedBody)
    const { user_id, computer_id, newPrice, credentials } = parsedBody;

    //Request validation
    connection.query('SELECT user_id, password FROM Login_Credentials WHERE user_id = ?', [user_id], async (error, results) => {
        if (error) {
            console.error('Database query failed:', error);
            return JSON.stringify({ statusCode: 500, headers, body: JSON.stringify({ message: 'Database query failed' }) });
        }
        if (results.length === 0) {
            return JSON.stringify({ statusCode: 401, headers, body: JSON.stringify({ message: 'Invalid username or password' }) });
        }

        const user = results[0]
        let passwordIsValid

        try {
            passwordIsValid = await bcrypt.compare(credentials, user.password);
        } catch (error) {
            console.error('Error comparing passwords:', error);
            return JSON.stringify({ statusCode: 500, headers, body: JSON.stringify({ message: 'Error comparing passwords' }) });
        }
        if (!passwordIsValid) {
            return JSON.stringify({ statusCode: 401, headers, body: JSON.stringify({ message: 'Invalid password' }) });
        }
    })

        // Start a transaction
    await queryDatabase('START TRANSACTION');

    // Step 2: Delete the computer from Computer table using computer_id
    const updatePriceQuery = 'UPDATE Computers SET price = ? WHERE computer_id = ?;';
    const updatePriceQueryResult = await queryDatabase(updatePriceQuery, [newPrice, computer_id]);
    
    if (updatePriceQueryResult.affectedRows === 0) {
        // Computer not found, roll back and return an error message
        await queryDatabase('ROLLBACK');
        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ message: 'Computer not found', queryResult: [computer_id] }),
        };
    }

    await queryDatabase('COMMIT');

    return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ message: 'Updated price successfully' }),
    };
    
}

