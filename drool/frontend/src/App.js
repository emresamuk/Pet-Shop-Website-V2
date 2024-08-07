import React from "react";
import Routes from "./Routes";
import "./Routes";
import Footer from "./pages/components/Footer/Footer";
import Navbar from "./pages/components/Navbar/Navbar";


function App() {
  return (
    <div >
      <br /><br />
      <Navbar />
      <Routes />
      <Footer />
    </div>
  );
}

export default App;
