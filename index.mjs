import mysql from 'mysql';
import bcrypt from 'bcryptjs';

const connection = mysql.createConnection({
  host: 'lhotse-consignment-shop.ct1ku8wns3fv.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Lhotse2023',
  database: 'computer_consignment'
});

exports.handler = async (event) => {
  const { userid, password } = JSON.parse(event.body);

  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM users WHERE userid = ?', [userid], async (error, results) => {
      if (error) {
        return reject({ statusCode: 500, body: JSON.stringify({ message: 'Database query failed' }) });
      }

      if (results.length === 0) {
        return resolve({ statusCode: 401, body: JSON.stringify({ message: 'Invalid username or password' }) });
      }

      const user = results[0];
      const passwordIsValid = await bcrypt.compare(password, user.hashed_password);

      if (!passwordIsValid) {
        return resolve({ statusCode: 401, body: JSON.stringify({ message: 'Invalid username or password' }) });
      }

      resolve({ statusCode: 200, body: JSON.stringify({ message: 'Login successful' }) });
    });
  });
};