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
                const response = await apiClient.get<card>(`/card/${id}/`);
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

    return(
        <div>
            <h2>カード編集</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={cardSubmit}>
                <div>
                    <label>Title</label>
                    <input type="text" value={title} onChange={(e) =>setTitle(e.target.value)} required></input>

                </div>
                <div>
                    <label>Description</label>
                    <textarea value={description} onChange={(e) =>setDescription(e.target.value)} required></textarea>
                </div>
                <button type="submit">更新</button>
                <button type="button" onClick={() => navigate('/card/')}>キャンセル</button>
            </form>
        </div>

    );
}

export default CardEdit;