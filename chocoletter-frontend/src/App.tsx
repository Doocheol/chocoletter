import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login/index";
import ErrorPage from "./pages/error/index";
import TutorialFocus from "./pages/tutorial/focus";
import MainMyBefore from "./pages/main/my/before";

function App() {
  return (
    <div className="App bg-pink-100 text-gray-800">
      <BrowserRouter>
        <Routes>
          {/* 로그인 페이지 */}
          <Route path="/login" element={<Login />} />

          {/* 로그인 후 페이지 */}
          <Route path="/tutorial-focus" element={<TutorialFocus />} />
          <Route path="/main-my-before" element={<MainMyBefore />} />

          {/* 에러 페이지 */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
