const mongoose = require('mongoose');

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB connected ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error ${error.message}`);
    process.exit(1);
  }
};

module.exports = dbConnect;
