//Reactのライブラリ"usestate"をインポート
//"useState"は、関数コンポーネントで状態を持つためのReactのフック
import React, { useState } from 'react';
//axiosをインポート
//"axios"は、HTTPクライアントライブラリで、REST APIと連携するためのライブラリ
import axios from 'axios';

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
			const response = await axios.post('/api/register/', {
				username,
				email,
				password1,
				password2,
			});
			console.log(response.data);
			// サインアップ成功後の処理
		} catch (error) {
			setError('サインアップに失敗しました。');
		}
	};

	return (
		<div>
			<h2>サインアップ</h2>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<form onSubmit={handleSubmit}>
				<div>
					<label>ユーザー名:</label>
					<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
				</div>
				<div>
					<label>メールアドレス:</label>
					<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
				</div>
				<div>
					<label>パスワード:</label>
					<input type="password" value={password1} onChange={(e) => setPassword1(e.target.value)} required />
				</div>
				<div>
					<label>パスワード（確認用）:</label>
					<input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} required/>
				</div>
				<button type="submit">サインアップ</button>
			</form>
		</div>
	);
};

export default Signup;