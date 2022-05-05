import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../slices/users/usersSlices';
import categoryReducer from '../slices/category/categorySlice';
import postReducer from '../slices/posts/postSlices';
import commentReducer from '../slices/comments/commentSlices';
import emailReducer from '../slices/email/emailSlices';

const store = configureStore({
  reducer: {
    users: usersReducer,
    category: categoryReducer,
    post: postReducer,
    comment: commentReducer,
    sendMail: emailReducer,
  },
});

export default store;
