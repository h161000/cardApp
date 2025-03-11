import React, { useState, useEffect } from 'react';
import { Link, useParams ,useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

interface Card {
    Title:String;
    Description:String;
}

const cardCreate: React.FC = () =>{
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const cardSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!title){
            setError('タイトルを入力してください。');
            return;
        }
        try{
            const response = await apiClient.post<Card>('/card/api/',{
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
            <form onSubmit={cardSubmit}></form>
            <div>
                <label>title</label>
                <input type="text" value={title} onChange={(e) =>setTitle(e.target.value)} required></input>
            </div>
        </div>
    );
}