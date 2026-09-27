import "./App.css";

import React from "react";
import NavBar from "./componets/NavBar";
import News from "./componets/News";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Router>
        <NavBar />

        <Switch>
          <Route path="/sports">
            <News pageSize={6} country="us" category="sports" />
          </Route>

          <Route path="/business">
            <News pageSize={6} country="us" category="business" />
          </Route>

          <Route path="/entertainment">
            <News pageSize={6} country="us" category="entertainment" />
          </Route>

          <Route path="/general">
            <News pageSize={6} country="us" category="general" />
          </Route>

          <Route path="/health">
            <News pageSize={6} country="us" category="health" />
          </Route>

          <Route path="/science">
            <News pageSize={6} country="us" category="science" />
          </Route>

          <Route path="/technology">
            <News pageSize={6} country="us" category="technology" />
          </Route>

          {/* Home */}
          <Route path="/">
            <News pageSize={6} country="us" category="general" />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
