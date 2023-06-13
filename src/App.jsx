import { BrowserRouter, Route, Routes } from "react-router-dom";

import Todos from "./components/Todo/Todos";
import Auth from "./components/Auth/Auth";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Todos />} />
        <Route path="/login" element={<Auth type="login" />} />
        <Route path="/signup" element={<Auth type="signup" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
