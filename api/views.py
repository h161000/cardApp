# Django core
from django.contrib.auth.models import User

# Django REST Framework
from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

# Local imports
from .serializers import RegisterSerializer, UserSerializer


# ユーザー登録のveiwクラス
class RegisterView(generics.CreateAPIView):
    # 全てのUserモデルのオブジェクトを操作対象とする
    queryset = User.objects.all()
    # ユーザを作成するAPIの権限設定(AllowAny：誰でもアクセスできる)
    permission_classes = (permissions.AllowAny,)
    # ユーザー登録用のシリアライザー
    serializer_class = RegisterSerializer

    # 新規ユーザー登録のリクエストを受け取り
    def post(self, request, *args, **kwargs):
        # 入力されたユーザ情報をRegisterSerializerに渡す
        serializer = self.get_serializer(data=request.data)
        # serializer.pyのvalidateでチェック
        serializer.is_valid(raise_exception=True)
        # バリデーション成功後の新しいユーザをDBに登録、アカウントが作成される
        user = serializer.save()
        # JWTトークンを作成されたユーザに発行
        refresh = RefreshToken.for_user(user)

        return Response(
            {  # UserSerializerに渡す
                "user": UserSerializer(user).data,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
        )


# 関数「post」で発行されてるJWTトークンかつ有効なトークンであるかチェックし、ユーザー情報取得し、クライアントに返す
class UserDetailView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer  #

    def get_object(self):
        return self.request.user


# ログアウト処理
class LogoutView(generics.GenericAPIView):
    # 認証済みユーザのみアクセス可能
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            # POSTの帰ってきた値のrefresh_token
            refresh_token = request.data.get("refresh")
            # トークンオブジェクトを生成
            token = RefreshToken(refresh_token)
            # トークンを無効化
            token.blacklist()
            return Response(
                {"message": "ログアウトしました"}, status=status.HTTP_200_OK
            )
        except TokenError as e:
            return Response(
                {"message": "無効なトークンです", "error_details": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
