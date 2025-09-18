import { Routes, Route } from "react-router-dom";
import UserHome from "./pages/UserHome.jsx";   // your current App.jsx logic moved here
import Auth from "./pages/Auth.jsx";   
import Creator from "./pages/Creator.jsx";        
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />         
      <Route path="/user" element={<UserHome />} />
      <Route path="/creator" element={<Creator />} />  
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}
