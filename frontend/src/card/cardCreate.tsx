import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

interface card {
    title:String;
    description:String;
}

const CardCreate: React.FC = () =>{
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
            const response = await apiClient.post<card>('/card/',{
                title,
                description,
            });
            if(response.status === 201 || response.status === 200){
                // 成功した場合は入力フィールドをクリア
                setTitle('');
                setDescription('');
                // カード一覧画面に遷移
                navigate('/card/');
            }
        } catch (error:any){
            setError('カードの作成に失敗しました: ' + (error.response?.data?.message || '不明なエラー'));
        }
    };
    return(
        <div>
            <h2>カード登録</h2>
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
                <button type="submit">登録</button>
                <button type="button" onClick={() => navigate('/card/')}>キャンセル</button>
            </form>
        </div>

    );
}
export default CardCreate;