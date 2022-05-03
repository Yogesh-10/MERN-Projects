import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AddNewCategory from './components/Categories/AddNewCategory';
import CategoryList from './components/Categories/CategoryList';
import UpdateCategory from './components/Categories/UpdateCategory';
import HomePage from './components/HomePage/HomePage';
import Navbar from './components/Navigation/Navbar';
import Login from './components/Users/Login/Login';
import Register from './components/Users/Register/Register';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route exact path='/update-category/:id' component={UpdateCategory} />
        <Route exact path='/add-category' component={AddNewCategory} />
        <Route exact path='/category-list' component={CategoryList} />
        <Route exact path='/' component={HomePage} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
