import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

// カードの型定義
interface cardList {
id: number;
title: string;
description: string;
created_at: string;
}

const CardList: React.FC = () => {
const [cards, setCards] = useState<cardList[]>([]);
const [selectedCards, setSelectedCards] = useState<number[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const navigate = useNavigate();

// カード一覧を取得する
// useEffect：APIからデータを取得
useEffect(() => {
    const fetchCards = async () => {
        try {
            // CardListView(cardView)のgetメソッドにリクエストを送信
            const response = await apiClient.get<cardList[]>('/card/');
            setCards(response.data);
            setLoading(false);
        } catch (err) {
            setError('カードの読み込みに失敗しました。');
            setLoading(false);
        }
    };
    // fetchCards関数を実行
    fetchCards();
// 空の配列を渡すことで、初めて表示される時だけ実行される
}, []);

// チェックボックスの状態を更新する
const handleCheckboxChange = (cardId: number) => {
    //"prevSelected":選択されているカードIDの配列
    setSelectedCards(prevSelected => {
        if (prevSelected.includes(cardId)) {
            // 選択されている　IDを配列から削除
            return prevSelected.filter(id => id !== cardId);
        } else {
            // 選択されている　IDを配列に追加
            return [...prevSelected, cardId];
        }
    });
};

// 選択したカードを削除する
const handleDelete = async () => {
    if (selectedCards.length === 0) {
    setError('削除するカードを選択してください。');
    return;
    }

    try {
        // card"DeleteSelectedView"classを呼び出す
    await apiClient.post('/card/delete-selected/', {
        selected_cards: selectedCards
    });
    // 削除後にカード一覧を再取得
    const response = await apiClient.get<cardList[]>('/card/');
    setCards(response.data);
    setSelectedCards([]); // 選択をリセット
    } catch (err) {
    setError('カードの削除に失敗しました。');
    }
};

// ログアウト
const handleLogout = async () => {
    const confirmLogout = window.confirm('ログアウトしますか？');
    if(!confirmLogout) {
        return;
    }


    try{
        // ローカルストレージからリフレッシュトークンを取得
        const refreshToken = localStorage.getItem('refresh_token');
        // LogOutViewのpostメソッドにリクエストを送信
        await apiClient.post('/logout/', {
            refresh: refreshToken
        });
        // ローカルストレージからアクセストークンとリフレッシュトークンを削除
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/accounts/login');
    }catch(err){
        setError('ログアウトに失敗しました。');
    }
}

if (loading) return <p>読み込み中...</p>;
if (error) return <p className="error">{error}</p>;

return (
    <div className="card-list-container">
    <h1>Card List</h1>
    <button onClick={() => navigate('/card/create/')}>新規作成</button>
    <button onClick={handleLogout}>ログアウト</button>

    <div className="card-table-container">
        <table className="card-table">
        <thead>
            <tr>
                <th>選択</th>
                <th>タイトル</th>
                <th>説明</th>
                <th>作成日時</th>
                <th>編集</th>
            </tr>
        </thead>
        <tbody>
            {cards.map(card => (
                <tr key={card.id}>
                    <td>
                        <input
                            type="checkbox"
                            checked={selectedCards.includes(card.id)}
                            onChange={() => handleCheckboxChange(card.id)}
                        />
                    </td>
                    <td>{card.title}</td>
                    <td>{card.description}</td>
                    <td>{new Date(card.created_at).toLocaleString()}</td>
                    <td>
                    <Link to={`/card/update/${card.id}/`}>編集</Link>
                    </td>
                </tr>
            ))}
        </tbody>
        </table>
    </div>

    <button
        onClick={handleDelete}
        disabled={selectedCards.length === 0}
        className="delete-button"
    >
        選択したカードを削除
    </button>
    </div>
);
};

export default CardList;