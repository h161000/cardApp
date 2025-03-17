//Reactのライブラリ"usestate"をインポート
//"useState"は、関数コンポーネントで状態を持つためのReactのフック
import React, { useState } from 'react';
// apiClientをインポート
import apiClient from '../services/api';


interface ResponseData {
	access: string;
	refresh: string;
}

//signupコンポーネント(HTMLなどを作るためのパーツ)を作成
//React.FCはReact.FunctionComponentの略で、関数コンポーネントの型を定義するための型エイリアス
const Signup: React.FC = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password1, setPassword1] = useState('');
	const [password2, setPassword2] = useState('');
	const [error, setError] = useState('');
	//Reactのformイベントをasync(非同期)で定義
	const handleSubmit = async (e: React.FormEvent) => {
		//formのデフォルトの送信イベントをキャンセル
		e.preventDefault();
		if (password1 !== password2) {
			setError('パスワードが一致しません。');
			return;
		}

		try {
			//"class RegisterView(APIView)"のpostメソッドにリクエストを送信し、例外をキャッチ
			//axios.postメソッドは、POSTリクエストを送信するためのメソッド
			const response = await apiClient.post<ResponseData>('api/register/', {
				username,
				email,
				password1,
				password2,
			});
			// 成功したらトークンを保存
			if(response.data.access && response.data.refresh){
				localStorage.setItem('access_token', response.data.access);
				localStorage.setItem('refresh_token', response.data.refresh);
			}
			// ログインページへリダイレクト
			setTimeout(() => {
				window.location.href = '/accounts/login';
			}, 2000);
			// サインアップ成功後の処理
		} catch (error:any) {
			if(error.response && error.response.data){
				setError(Object.values(error.response.data).flat().join(''))
			}else{
				setError('サインアップに失敗しました。');
			}
		}
	};

	return (
		<section className="accountsSection">
			<div className="accountsContainer">
				<div className="accountsCard">
					<h2 className="accountsHeading">サインアップ</h2>
					{error && <p style={{ color: 'red' }}>{error}</p>}
					<form className="accountsForm" onSubmit={handleSubmit}>
						<div className="formGroup">
							<label className="formLabel">ユーザー名</label>
							<input className="formInput" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
						</div>
						<div className="formGroup">
							<label className="formLabel">メールアドレス</label>
							<input className="formInput" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
						</div>
						<div className="formGroup">
							<label className="formLabel">パスワード</label>
							<input className="formInput" type="password" value={password1} onChange={(e) => setPassword1(e.target.value)} required />
						</div>
						<div className="formGroup">
							<label>パスワード（確認用）</label>
							<input className="formInput" type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} required/>
						</div>
						<button className="submitButton" type="submit">サインアップ</button>
						<a href="/accounts/login" className="blueLink">キャンセル</a>
					</form>
				</div>
			</div>
		</section>
	);
};


export default Signup;