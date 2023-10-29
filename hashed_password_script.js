const bcrypt = require('bcrypt');

async function hashPassword() {
  const password = 'storeowner'; // Replace with your actual password
  const saltRounds = 10; // You can adjust the number of salt rounds as needed

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Hashed Password:', hashedPassword);
  } catch (error) {
    console.error('Error hashing password:', error);
  }
}

hashPassword();
