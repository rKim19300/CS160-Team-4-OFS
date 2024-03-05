import React from "react";
import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import LogInPage from "./Pages/LogInPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StatisticsPage from "./Pages/StatisticsPage";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogInPage />} />
          <Route path="/StatisticsPage" element={<StatisticsPage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
