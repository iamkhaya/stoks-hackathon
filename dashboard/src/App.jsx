import React, { Suspense } from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import routes from "./routes";

import { CSpinner } from "@coreui/react";
import "./scss/style.scss";

// Containers

const App = () => {
  return (
    <Router>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.element />}
            />
          ))}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
