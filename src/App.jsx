import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./components/landing"
import SignUp from "./pages/signup";
import Login from "./pages/login";
import Home from "./pages/home"
// import Home from "./pages/home";
import axios from "axios" 



export const api = axios.create({
  baseURL: "http://localhost:8000",
});

function App() {
  // socket.on("connect_error", data=>console.log(data))
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Landing/>}/>
        <Route path="signup" element={<SignUp/>}/>
        <Route path="login" element={<Login/>}/>
        <Route path="home" element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
