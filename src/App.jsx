import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import MainLayout from "./containers/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AppRoute from "./pages/routes";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/" component={Home} />
        <Route>
          <MainLayout>
              <AppRoute />
          </MainLayout>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
