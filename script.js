//Get store profit
async function getStoreProfit(parsedBody, headers) {
    console.log("parseBody: ", parsedBody)
    const { user_id, credentials } = parsedBody;

    try {

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

    const getstoreProfit = 'SELECT store_profit FROM Store WHERE user_id = ?';
    const getstoreProfitResult = await queryDatabase(getAllComputersQuery, [user_id]);

    console.log("getstoreProfitResult: ", getstoreProfitResult)
} catch (error) {
    console.error("Error: ", error)
}
}
