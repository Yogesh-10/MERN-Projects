import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../slices/users/usersSlices';
import categoryReducer from '../slices/category/categorySlice';
const store = configureStore({
  reducer: {
    users: usersReducer,
    category: categoryReducer,
  },
});

export default store;
