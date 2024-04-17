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
import CheckoutPage from "./Pages/CheckoutPage";
import ChangeProductPage from "./Pages/ChangeProductPage";
import CustomerOrders from "./Pages/CustomerOrders";
import OrderInfoPage from "./Pages/OrderInfoPage";
import InventoryPage from "./Pages/InventoryPage";
import OrdersPage from "./Pages/OrdersPage";
import EmployeesInfoPage from "./Pages/EmployeesInfoPage";
import Analytics from "./Pages/Analytics";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogInPage />} />
          <Route path="/SignUp" element={<SignUpPage />} />
          <Route path="/customer" element={<CustomerPage />}>
            <Route path=":category" element={<CustomerPage />} />
            <Route path="orders" element={<CustomerOrders />} />
            <Route path="info/:id" element={<OrderInfoPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="productInfo/:id" element={<ProductPage />} />
          </Route>

          <Route path="/employee" element={<EmployeeDashboard />}>
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="changeProduct/:id" element={<ChangeProductPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="ordersinfo/:id" element={<OrderInfoPage />} />
            <Route path="staff" element={<EmployeesInfoPage />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>

          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/changeProduct/:id" element={<ChangeProductPage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
