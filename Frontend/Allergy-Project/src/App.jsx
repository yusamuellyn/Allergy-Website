import { Routes, Route } from "react-router";
import { HomePage } from "./pages/HomePage";
import { AboutUs } from "./pages/AboutUs";
import { HowItWorks } from "./pages/HowItWorks";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="about-us" element={<AboutUs />} />
      <Route path="how-works" element={<HowItWorks />} />
    </Routes>
  );
}

export default App
