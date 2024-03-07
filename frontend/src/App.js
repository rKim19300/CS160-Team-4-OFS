import React from "react";
import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import LogInPage from "./Pages/LogInPage";
import ProductPage from "./Pages/ProductPage";
import CustomerPage from "./Pages/CustomerPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmployeeDashboard from "./Pages/EmployeeDashboard/EmployeeDashboard";
import OrderPage from "./Pages/OrderPage";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogInPage />} />
          <Route path="/StatisticsPage" element={<EmployeeDashboard />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/productInfo/:id" element={<ProductPage />} />
          <Route path="/order" element={<OrderPage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
