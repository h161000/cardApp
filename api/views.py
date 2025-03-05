from rest_framework import generics, permissions
from django.contrib.auth.models import User
from .serializers import UserSerializer, RegisterSerializer
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

# Create your views here.

class RegisterView(generics.CreateAPIView): #ユーザー登録のveiwクラス
    queryset = User.objects.all() #全てのUserモデルのオブジェクトを操作対象とする
    permission_classes = (permissions.AllowAny,)#ユーザを作成するAPIの権限設定(AllowAny：誰でもアクセスできる)
    serializer_class = RegisterSerializer #ユーザー登録用のシリアライザー

    def post(self, request, *args, **kwargs): #新規ユーザー登録のリクエストを受け取り
        serializer = self.get_serializer(data=request.data) #入力されたユーザ情報をRegisterSerializerに渡す
        serializer.is_valid(raise_exception=True) #serializer.pyのvalidateでチェック
        user = serializer.save() #バリデーション成功後の新しいユーザをDBに登録、アカウントが作成される
        refresh = RefreshToken.for_user(user) #JWTトークンを作成されたユーザに発行

        return Response({ #UserSerializerに渡す
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })

class UserDetailView(generics.RetrieveAPIView): #関数「post」で発行されてるJWTトークンかつ有効なトークンであるかチェックし、ユーザー情報取得し、クライアントに返す
    permission_classes = (permissions.IsAuthenticated,) 
    serializer_class = UserSerializer #

    def get_object(self):
        return self.request.user
