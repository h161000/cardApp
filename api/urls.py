from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView, UserDetailView

app_name = 'api'

urlpatterns = [
    # JWT認証エンドポイント
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # ユーザー関連エンドポイント
    path('register/', RegisterView.as_view(), name='register'),
    path('user/', UserDetailView.as_view(), name='user_detail'),
] 