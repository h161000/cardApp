// Reactコンポーネントをエクスポート
import React from 'react';
// react-router-domからBrowserRouter、Route、Routesをインポート(Reactのルーティングライブラリ)
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// accounts/signup.tsxをインポート
import Signup from './accounts/signup';
// card/cardList.tsxをインポート
import CardList from './card/cardList';
// card/cardCreate.tsxをインポート
import CardCreate from './card/cardCreate';
// card/cardEdit.tsxをインポート
import CardEdit from './card/cardEdit';

// ログインページをインポート
import Login from './accounts/login';

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

          {/* ログインページのルートを追加 */}
          <Route path='/accounts/login' element={<Login />} />
          <Route path='/accounts/login/' element={<Login />} />

          {/* ルートを定義し "/card"にアクセス時にCardListコンポーネントを表示する */}
          <Route path='/card/' element={<CardList />} />
          {/* ルートを定義し "//card/create/"にアクセス時にCardCreateコンポーネントを表示する */}
          <Route path='/card/create/' element={<CardCreate />} />
          {/* ルートを定義し "/card/update/:id/"にアクセス時にCardEditコンポーネントを表示する */}
          <Route path='/card/update/:id/' element={<CardEdit />} />

          {/* 他のルートもここに追加 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
