import axios from 'axios';

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
    }
});

// リクエスト時にトークンを追加する
apiClient.interceptors.request.use(config => {
    //ローカルストレージからアクセストークンを取得
    const token = localStorage.getItem('access_token');
    if (token) {
        if (!config.headers) {
            config.headers = {};
        }
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// レスポンスとエラーハンドリング
// HTTPレスポンスが処理される前に、エラーハンドリングを追加
apiClient.interceptors.response.use(
    // " response => response" は成功したレスポンスを返す
    // " async error => "はリクエストでエラーが発生した時に実行される非同期ハンドラー
    response => response,async error => {
        // エラーが発生したリクエスト情報
        const originalRequest = error.config;
        // ステータスが401かつリトライフラグがfalseの場合("._retry"は無限ループ防ぐプロパティ)
        if (error.response.status === 401 && !originalRequest._retry) {
        // 無限ループ阻止
        originalRequest._retry = true;
        try {
            // ローカルストレージからリフレッシュトークンを取得
            const refreshToken = localStorage.getItem('refresh_token');
            // await:非同期関数
            // axios.post:POSTリクエスト送信
            // `${API_URL}/token/refresh/`:リフレッシュトークンを送信するエンドポイント
            // { refresh: refreshToken }:送信するリフレッシュトークン
            const response = await apiClient.post('/register/', {
            refresh: refreshToken
            });
            const data = response.data as TokenResponse;
            // レスポンスからアクセストークンを取得し、ローカルストレージに保存
            localStorage.setItem('access_token', data.access);
            return apiClient(originalRequest);
        } catch (refreshError) {
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