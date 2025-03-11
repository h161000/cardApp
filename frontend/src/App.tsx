// Reactコンポーネントをエクスポート
import React from 'react';
// react-router-domからBrowserRouter、Route、Routesをインポート(Reactのルーティングライブラリ)
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// accounts/signup.tsxをインポート
import Signup from './accounts/signup';
import './App.css';

function App() {
  return (
    // ルーティングの設定
    <Router>
      <div className='App'>
        <Routes>
          {/* ルートを定義し "/signup"にアクセス時にSignupコンポーネントを表示する */}
          <Route path='/signup' element={<Signup />} />
          {/* 他のルートもここに追加 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
