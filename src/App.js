import './App.scss';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";
import { SelectRoute } from './Pages';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <Container>
      <Router>
        <nav className="d-flex justify-content-center my-5">
          <Link to="/routes">
            <img alt="metro transit home" src="https://www.metrotransit.org/img/MetroTransitLogo.svg" className="logo d-inline-block m-3" />
          </Link>
        </nav>
        <Switch>
          <Route
            exact
            path="/"
            render={() => /* Redirect '/' to routes page */ <Redirect to="/routes" />}
          />
          <Route path="/routes">
            <SelectRoute />
          </Route>
        </Switch>
      </Router>
    </Container>
  );
}

export default App;
