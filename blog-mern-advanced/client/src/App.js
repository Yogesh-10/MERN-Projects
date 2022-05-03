import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AddNewCategory from './components/Categories/AddNewCategory';
import CategoryList from './components/Categories/CategoryList';
import UpdateCategory from './components/Categories/UpdateCategory';
import HomePage from './components/HomePage/HomePage';
import Navbar from './components/Navigation/Navbar';
import AdminRoute from './components/Navigation/ProtectedRoutes/AdminRoute';
import PrivateProtectRoute from './components/Navigation/ProtectedRoutes/PrivateProtectRoute';
import CreatePost from './components/Posts/CreatePost';
import Login from './components/Users/Login/Login';
import Register from './components/Users/Register/Register';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <AdminRoute
          exact
          path='/update-category/:id'
          component={UpdateCategory}
        />
        <PrivateProtectRoute exact path='/create-post' component={CreatePost} />
        <AdminRoute exact path='/add-category' component={AddNewCategory} />
        <AdminRoute exact path='/category-list' component={CategoryList} />
        <Route exact path='/' component={HomePage} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
