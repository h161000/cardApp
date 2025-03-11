// Reactコンポーネントをエクスポート
import React from 'react';
// react-router-domからBrowserRouter、Route、Routesをインポート(Reactのルーティングライブラリ)
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// accounts/signup.tsxをインポート
import Signup from './accounts/signup';
// card/cardList.tsxをインポート
import CardList from './card/cardList';
import './App.css';

function App() {
  return (
    // ルーティングの設定
    <Router>
      <div className='App'>
        <Routes>
          {/* ルートを定義し "/signup"にアクセス時にSignupコンポーネントを表示する */}
          <Route path='/accounts/signup' element={<Signup />} />
          <Route path='/accounts/signup/' element={<Signup />} />

          {/* ルートを定義し "/card"にアクセス時にCardListコンポーネントを表示する */}
          <Route path='/card/' element={<CardList />} />
          {/* <Route path='/card/create/' element={<CardCreate />} />
          <Route path='/card/update/:id/' element={<CardUpdate />} /> */}
          {/* 他のルートもここに追加 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
