import React from "react";
import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import LogInPage from "./Pages/LogInPage";
import SignUpPage from "./Pages/SignUpPage";
import ProductPage from "./Pages/ProductPage";
import CustomerPage from "./Pages/CustomerPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmployeeDashboard from "./Pages/EmployeeDashboard";
import ProfilePage from "./Pages/ProfilePage";
import OrdersMap from "./Pages/OrdersMap";
import CheckoutPage from "./Pages/CheckoutPage";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogInPage />} />
          <Route path="/SignUp" element={<SignUpPage />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/productInfo/:id" element={<ProductPage />} />
          <Route path="/EmployeeDashboard" element={<EmployeeDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/OrdersMap" element={<OrdersMap />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
