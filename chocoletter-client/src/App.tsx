import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './styles/App.css'
import { BrowserRouter, Route, Routes } from 'react-router';
import LoginView from './pages/LoginView';
import { isLoginAtom } from './atoms/auth/userAtoms';
import { useRecoilValue } from 'recoil';
import ErrorPage from './pages/ErrorPage';

declare global {
  interface Window {
    Kakao: any;
  }
}

function App() {

  const isLogin = useRecoilValue(isLoginAtom)

  // if (isLogin) {
    
  // } else {

  // }

  function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`); //"--vh"라는 속성으로 정의해준다.
  }
  
  useEffect(() => {
    setScreenSize();
  }, []); 

  return (
    <div className="App bg-hrtColorBackground text-hrtColorOutline">
      <BrowserRouter>
      <Routes>
          <Route index element={<LoginView />} />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
