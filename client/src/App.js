import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Account, Home, SignIn, SignUp } from './components';
import { Provider } from "react-redux";
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/account" component={Account} />
          </Switch>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
