from django.urls import path #標準ライブラリの "path"関数をインポート
from rest_framework_simplejwt.views import (
    TokenObtainPairView, #JWT認証システムのログインAPI
    TokenRefreshView, #JWTアクセストークン取得API
)
from .views import RegisterView, UserDetailView, LogoutView #veiwの "class RegisterView"と"class UserDetailView"をインポート

app_name = 'api'

urlpatterns = [
    # JWT認証エンドポイント
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ユーザー関連エンドポイント
    path('register/', RegisterView.as_view(), name='register'),
    path('user/', UserDetailView.as_view(), name='user_detail'),

    #ログアウトエンドポイント
    path('logout/',LogoutView.as_view(), name='logout'),
]