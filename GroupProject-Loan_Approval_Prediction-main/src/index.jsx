import React from "react";
import { createRoot } from "react-dom/client"; // Update this import
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import FirstPage from "./Pages/FirstPage.jsx";
import SecondPage from "./Pages/SecondPage.jsx";
import ThirdPage from "./Pages/ThirdPage.jsx";
import "./index.css";
import TestPage from "./Pages/test.jsx";
import ResultPage from "./Pages/ResultPage.jsx";
import AnalysisPage from "./Pages/Analysis.jsx";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <ToastContainer />
    <Routes>
      <Route path="/" element={<FirstPage />} />
      <Route path="/first_page" element={<FirstPage />} />
      <Route path="/second_page" element={<SecondPage />} />
      <Route path="/third_page" element={<ThirdPage />} />
      <Route path="/test_page" element={<TestPage />} />
      <Route path="/result_page" element={<ResultPage />} />
      <Route path="/analysis_page" element={<AnalysisPage />} />
    </Routes>
  </BrowserRouter>
);
