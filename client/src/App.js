import { Switch, Route, Router } from "react-router-dom";
import { Account, Home, SignIn, SignUp } from "./components";
import { Provider } from "react-redux";
import store from "./store";
import history from "./history";

function App() {
  return (
    <Router history={history}>
      <Provider store={store}>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/account" component={Account} />
          </Switch>
        </div>
      </Provider>
    </Router>
  );
}

export default App;
