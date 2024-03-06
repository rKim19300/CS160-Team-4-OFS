import React from "react";
import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import LogInPage from "./Pages/LogInPage";
import SignUpPage from "./Pages/SignUpPage";
import ProductPage from "./Pages/ProductPage";
import CustomerPage from "./Pages/CustomerPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmployeeDashboard from "./Pages/EmployeeDashboard/EmployeeDashboard";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogInPage />} />
          <Route path="/SignUp" element={<SignUpPage />} />
          <Route path="/StatisticsPage" element={<EmployeeDashboard />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/productInfo/:id" element={<ProductPage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
