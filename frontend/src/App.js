import React from "react";
import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import ProtectedRoutes from "./CustomComponents/ProtectedRoutes";
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

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogInPage />} />
          <Route path="/SignUp" element={<SignUpPage />} />

          <Route element={<ProtectedRoutes isStaff={false} />}>
              <Route path="/customer" element={<CustomerPage />}>
                <Route path=":category" element={<CustomerPage />} />
                <Route path="orders" element={<CustomerOrders />} />
                <Route path="info/:id" element={<OrderInfoPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="productInfo/:id" element={<ProductPage />} />
              </Route>
              <Route path="/checkout" element={<CheckoutPage />} />
          </Route>

          <Route element={<ProtectedRoutes isStaff={true} />}>
              <Route path="/EmployeeDashboard" element={<EmployeeDashboard />} />
              <Route path="/changeProduct/:id" element={<ChangeProductPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
