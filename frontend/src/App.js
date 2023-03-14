import './App.css';
import clsx from "clsx";
import React, { Suspense } from "react";
import { BrowserRouter, BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import routes from './configs/routes';
import { Box } from '@material-ui/core';
import MainLayout from './pages/Layout/MainLayout';

function App() {
  return (
    <BrowserRouter>
      <Router basename="attendance-system">
        <Switch>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              render={(props) => {
                const LayoutTag = MainLayout;
                return (
                  <Suspense fallback={null}>
                    <LayoutTag>
                      <Box
                        className={clsx({
                          [`animate__animated animate__${route.animation}`]: Boolean(route.animation),
                        })}
                      >
                        <route.component {...props} />
                      </Box>
                    </LayoutTag>
                  </Suspense>
                );
              }}
            />
          ))}
          <Route path="/">
            <Redirect to="/home" />
          </Route>
        </Switch>
      </Router>
    </BrowserRouter>
  );
}
export default App;
