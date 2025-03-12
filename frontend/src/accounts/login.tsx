import React, { useState } from 'react';
// apiClientをインポート
import apiClient from '../services/api';
import { useNavigate } from 'react-router-dom';

interface ResponseData {
    access: string;
    refresh: string;
}

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const loginSubmit = async(e: React.FormEvent)=> {
        e.preventDefault();

        try {
            const responce = await apiClient.post<ResponseData>('/token/',{
                username,
                password
            });
            if(responce.data.access && responce.data.refresh){
                localStorage.setItem('access_token', responce.data.access);
                localStorage.setItem('refresh_token', responce.data.refresh);
            }
            navigate('/card/');
        } catch (error:any) {
            setError('ログインに失敗しました。ユーザー名とパスワードを確認してください。');
        }
    };
    return (
    <div>
        <h2>ログイン</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={loginSubmit}>
        <div>
            <label>ユーザー名:</label>
            <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            />
        </div>
        <div>
            <label>パスワード:</label>
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        </div>
        <button type="submit">ログイン</button>
        </form>
        <div>
        <p>アカウントをお持ちでない方は<a href="/accounts/signup">サインアップ</a>してください。</p>
        </div>
    </div>
    );
}
export default Login;