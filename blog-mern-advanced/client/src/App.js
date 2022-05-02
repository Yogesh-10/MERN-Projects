import { BrowserRouter, Switch, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={HomePage} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
