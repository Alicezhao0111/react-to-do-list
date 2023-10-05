import { useState } from "react";
import { Route, Routes, NavLink, HashRouter } from "react-router-dom";
import SignUp from "./views/SignUp";
import Login from "./views/Login";
import Todo from "./views/Todo";

function App() {
  return (
    <>
      <HashRouter>
        <Routes>     
            <Route path="/"element={<Login/>} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/to-do" element={<Todo />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
