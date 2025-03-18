import React, { useState } from 'react';
// apiClientをインポート
import apiClient from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

interface ResponseData {
    access: string;
    refresh: string;
}

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const accountsSubmit = async(e: React.FormEvent)=> {
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
        <section className="accountsSection">
            <div className="accountsContainer">
                <div className="accountsCard">
                <h2 className="accountsHeading">CardApp</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form className="accountsForm" onSubmit={accountsSubmit}>
                    <div className="formGroup">
                    <label className="formLabel">ユーザー名</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="formInput"
                    />
                    </div>
                    <div className="formGroup">
                    <label className="formLabel">パスワード</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="formInput"
                    />
                    </div>
                    <button type="submit" className="submitButton">ログイン</button>
                </form>
                <div className="signupLink">
                    <Link to="/accounts/signup" className="blueLink">サインアップ</Link>
                </div>
                </div>
            </div>
        </section>
    );
}
export default Login;