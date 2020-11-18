import { Switch, Route, Router } from "react-router-dom";
import { Home, SignIn, SignUp } from "./components";
import { Provider } from "react-redux";
import store from "./store";
import history from "./history";
import { NavBar } from "./components/layout";
import "antd/dist/antd.css";

function App() {
  return (
    <Router history={history}>
      <Provider store={store}>
        <div className="App container">
          <NavBar/>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={SignIn} />
            <Route path="/register" component={SignUp} />            
            <Route path="/*" component={Home} />
          </Switch>
        </div>
      </Provider>
    </Router>
  );
}

export default App;
