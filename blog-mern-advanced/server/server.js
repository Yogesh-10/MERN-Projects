const express = require('express');
const dotenv = require('dotenv');
const dbConnect = require('./config/db/dbConnect');
const userRoutes = require('./routes/users/userRoutes');
const postRoutes = require('./routes/posts/postRoutes');
const commentRoutes = require('./routes/comments/commentRoutes');
const emailMsgRoutes = require('./routes/emailMsg/emailMsgRoutes');
const { errorHandler, notFound } = require('./middlewares/error/errorHandler');
const categoryRoutes = require('./routes/category/categoryRoutes');

dotenv.config();

const app = express();

//DB
dbConnect();

//Middlewares
app.use(express.json());

//Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/email', emailMsgRoutes);
app.use('/api/categories', categoryRoutes);

//Err handlers
app.use(notFound);
app.use(errorHandler);

//server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
