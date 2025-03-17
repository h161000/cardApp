import React, { useEffect, useState } from 'react';
import { useNavigate , useParams} from 'react-router-dom';
import apiClient from '../services/api';

interface card {
    id:number;
    title:string;
    description:string;
    created_at: string;
    updated_at: string;
}

const CardEdit: React.FC = () =>{
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams<{id:string}>();
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        const fetchCard = async () =>{
            try{
                const response = await apiClient.get<card>(`/api/card/${id}/`);
                setTitle(response.data.title);
                setDescription(response.data.description);
                setLoading(false);
            }catch(err){
                setError('カードの読み込みに失敗しました。');
                setLoading(false);
            }
        }
        fetchCard();
    },[id]);

    // カード更新処理
    const cardSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!title){
            setError('タイトルを入力してください。');
            return;
        }else if(!description){
            setError('説明を入力してください。');
            return;
        }

        try{
            const response = await apiClient.put<card>(`/card/${id}/`,{
                title,
                description,
            });
            if(response.status === 201 || response.status === 200){
                // カード一覧画面に遷移
                navigate('/card/');
            }
        } catch (error:any){
            setError('カードの作成に失敗しました: ' + (error.response?.data?.message || '不明なエラー'));
        }
    };

    if (loading) return <p>読み込み中...</p>;

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

    return(
        <div>
            <header className="header">
                <nav className="header-nav">
                    <a className="header-logo" onClick={() => navigate('/card/')} aria-label="Card">Card</a>
                    <div className="header-menu">
                        {/* <a className="header-link" onClick={handleLogout} href="#" role="button">Logout</a> */}
                    </div>
                </nav>
            </header>
            <div className="form-container">
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={cardSubmit} className="form-left" id="cardForm">
                    <div className="formGroup">
                        <label className="formLabel">Title</label>
                        <input className="formInput form-full-width" type="text" value={title} onChange={(e) =>setTitle(e.target.value)} required></input>
                    </div>
                    <div className="formGroup">
                        <label className="formLabel">Description</label>
                        <textarea className="formInput form-full-width" value={description} onChange={(e) =>setDescription(e.target.value)} required></textarea>
                    </div>
                    <div className="button-group">
                        <button className="submitButton button-group-item button-equal-width" type="submit" form="cardForm">更新</button>
                        <button className="blueLink button-group-item button-equal-width" type="button" onClick={() => navigate('/card/')}>キャンセル</button>
                    </div>
                </form>
            </div>
        </div>

    );
}

export default CardEdit;