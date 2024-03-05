import React from "react";
import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LogInPage from "./Pages/LogInPage";
import CustomerPage from "./Pages/CustomerPage";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogInPage />} />
          <Route path="/customer" element={<CustomerPage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
