const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables connecting to MongoDB
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const email = process.argv[2];
    
    if (!email) {
      console.log('\n❌ Please provide the email address of the account.');
      console.log('Usage: node makeAdmin.js <your-email@example.com>\n');
      process.exit(1);
    }

    // Find user by email and upgrade role to admin
    const user = await User.findOneAndUpdate(
      { email: email }, 
      { role: 'admin' }, 
      { new: true }
    );
    
    if (user) {
      console.log(`\n✅ Success! The user [${email}] has been upgraded to an ADMIN.`);
      console.log(`Please log out and log back in on the website to see the Admin Dashboard!\n`);
    } else {
      console.log(`\n❌ Could not find an account with the email: [${email}]\n`);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ Database connection error. Check your .env file.\nError details:', err.message, '\n');
    process.exit(1);
  });
