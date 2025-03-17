from django.urls import path  # 標準ライブラリの "path"関数をインポート
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import (  # JWT認証システムのログインAPI; JWTアクセストークン取得API
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (  # veiwの "class RegisterView"と"class UserDetailView"をインポート
    LogoutView,
    RegisterView,
    UserDetailView,
)

app_name = "api"


@api_view(["GET"])
def api_root(request):
    return Response(
        {
            "token": "/api/token/",
            "token_refresh": "/api/token/refresh/",
            "register": "/api/register/",
            "user": "/api/user/",
            "logout": "/api/logout/",
        }
    )


urlpatterns = [
    # APIルートエンドポイント
    path("", api_root, name="api-root"),
    # JWT認証エンドポイント
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # ユーザー関連エンドポイント
    path("register/", RegisterView.as_view(), name="register"),
    path("user/", UserDetailView.as_view(), name="user_detail"),
    # ログアウトエンドポイント
    path("logout/", LogoutView.as_view(), name="logout"),
]
