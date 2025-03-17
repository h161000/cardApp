import axios from 'axios';
import Cookies from 'js-cookie';
interface TokenResponse {
    access: string; // 新しいアクセストークン
    refresh: string; // 新しいリフレッシュトークン
}

//APIURL
const API_URL = process.env.REACT_APP_API_URL || '/api';

// APIクライアントの構成
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
});

// リクエスト時にトークンを追加する
apiClient.interceptors.request.use(config => {
    //ローカルストレージからアクセストークンを取得
    const token = localStorage.getItem('access_token');
    // Django の CSRF トークンを取得
    const csrfToken = Cookies.get('csrftoken');

    // ヘッダーが存在しない場合は初期化
    if (!config.headers) {
        config.headers = {};
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }

    return config;
});

// レスポンスとエラーハンドリング
// HTTPレスポンスが処理される前に、エラーハンドリングを追加
apiClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        
        // レスポンスがない場合はネットワークエラーなどの可能性
        if (!error.response) {
            return Promise.reject(error);
        }
        
        // 認証エラーでリトライしていない場合
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                
                // リフレッシュトークンがない場合はログイン画面へ
                if (!refreshToken) {
                    localStorage.removeItem('access_token');
                    window.location.href = '/accounts/login';
                    return Promise.reject(error);
                }
                
                const response = await axios.post(
                    `${API_URL}/token/refresh/`, 
                    { refresh: refreshToken },
                    { baseURL: API_URL }
                );
                
                const data = response.data as TokenResponse;
                localStorage.setItem('access_token', data.access);
                
                // 新しいトークンで元のリクエストを再試行
                originalRequest.headers.Authorization = `Bearer ${data.access}`;
                return axios(originalRequest);
            } catch (refreshError) {
                // リフレッシュに失敗したらログアウト
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/accounts/login';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default apiClient;