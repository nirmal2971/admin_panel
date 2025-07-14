import React from "react";
import { BrowserRouter, Routes, Route ,Navigate} from "react-router-dom";
import Login from "../src/Components/Login";
import Signup from "../src/Components/Signup";
import UserList from "../src/Components/UserList";
import PrivateRoute from "../src/Components/PrivateRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <UserList />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
