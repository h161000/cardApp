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
    const [searchKeyword, setSearchKeyword] = useState('');

    // カード一覧を取得する
    // useEffect：APIからデータを取得
    useEffect(() => {
        const fetchCards = async () => {
            try {
                // トークンが存在するか確認
                const token = localStorage.getItem('access_token');
                if (!token) {
                    // トークンがない場合はログインページにリダイレクト
                    navigate('/accounts/login');
                    return;
                }
                
                // CardListView(cardView)のgetメソッドにリクエストを送信
                const response = await apiClient.get<cardList[]>('/card/');
                
                // 応答がデータプロパティを持ち、それが配列であることを確認
                if (response && response.data && Array.isArray(response.data)) {
                    setCards(response.data);
                } else {
                    console.error('API response is not an array:', response.data);
                    setCards([]);
                    setError('データの形式が正しくありません。');
                }
                setLoading(false);
            } catch (err: any) {
                console.error('Error fetching cards:', err);
                
                // 認証エラーの場合は適切にハンドリング
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    navigate('/accounts/login');
                    return;
                }
                
                setError('カードの読み込みに失敗しました。');
                setCards([]);
                setLoading(false);
            }
        };
        
        fetchCards();
    }, [navigate]);
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
        const confirmDelete = window.confirm('削除しますか？');
        if (!confirmDelete) {
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
    //カード検索
    const handleSearch = async () => {
        try {
            const response = await apiClient.get<cardList[]>('/api/card/search/',{
                params:{
                    search: searchKeyword
                }
            });
            setCards(response.data);
        } catch (err) {
            setError('カードの検索に失敗しました。');
        }
    }

    return (
        <div>
            <header className="header">
            <nav className="header-nav">
                <a className="header-logo" aria-label="Card">Card</a>
                <div className="header-menu">
                    <a className="header-link" onClick={handleLogout} href="#" role="button">Logout</a>
                </div>
            </nav>
            </header>
            <div className="header-container">
                <button className="blueLink addSubmit" onClick={() => navigate('/card/create/')}>新規作成</button>
                <form className="search-container" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                    <label htmlFor="card-search" className="search-label">Search</label>
                    <div className="search-container-relative">
                        <div className="search-icon-container">
                            <svg className="search-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input
                            type="search"
                            id="card-search"
                            className="search-input-new"
                            placeholder="カードを検索..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                        <button
                            type="submit"
                            onClick={handleSearch}
                            className="search-button-new"
                        >
                            検索
                        </button>
                    </div>
            </form>
            </div>
            <div className="table-container">
                <table className="card-table">
                <thead className="card-thead">
                    <tr className="card-thead-row">
                        <th className="card-th">選択</th>
                        <th className="card-th">タイトル</th>
                        <th className="card-th">説明</th>
                        <th className="card-th">作成日時</th>
                    </tr>
                </thead>
                <tbody className="card-tbody">
                    {cards.map(card => (
                        <tr className="card-tr" key={card.id}>
                            <td className="card-td">
                                <input
                                    type="checkbox"
                                    checked={selectedCards.includes(card.id)}
                                    onChange={() => handleCheckboxChange(card.id)}
                                />
                            </td>
                            <td className="card-td"><Link to={`/card/update/${card.id}/`}>{card.title}</Link></td>
                            <td className="card-td">{card.description}</td>
                            <td className="card-td">{new Date(card.created_at).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
            <div className='leftSide'>
            <a onClick={handleDelete} style={{ display: selectedCards.length === 0 ? 'none' : 'block' }}className="addSubmit blueLink">削除</a>
            </div>
        </div>
    );
};

export default CardList;