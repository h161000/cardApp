# Django REST FrameworkとDjangoの必要なモジュールをインポート

from rest_framework import serializers  # Django REST Frameworkのserializersをインポート
from django.contrib.auth.models import User  # Django標準Userモデルをインポート
from django.contrib.auth.password_validation import (  # Django標準パスワードバリデーションモデルをインポート
    validate_password,
)
from accounts.forms import SignUpForm  # accounts/forms.py class SignUpFormをインポート


# ユーザー情報を表示するためのシリアライザー
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # Djangoの標準Userモデルを使用
        fields = ("id", "username", "email")  # APIレスポンスに含めるフィールド


# ユーザー登録用のシリアライザー
class RegisterSerializer(serializers.ModelSerializer):
    # パスワードフィールド：書き込み専用、必須、Djangoの標準バリデーションを使用
    password1 = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={"input_type": "password"},
    )
    # パスワード確認用フィールド：書き込み専用、必須
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"}
    )
    # メールアドレス:必須d
    email = serializers.EmailField(
        required=True,
        max_length=254
    )

    class Meta:
        model = User  # Djangoの標準Userモデルを使用
        fields = ( # 登録時に必要なフィールド
            "username",
            "email",
            "password1",
            "password2",
        )

    # パスワードの一致確認のカスタムバリデーション
    def validate(self, attrs):
        if (attrs["password1"] != attrs["password2"]):  # "attrs"は "RegisterSerializer"の返り値
            # "raise"はPythonの例外発生キーワード
            # "erializers.ValidationError"は Django REST Frameworkが提供するバリデーションエラークラス
            raise serializers.ValidationError({"password": "パスワードが一致しません。"})
        return attrs

    # ユーザー作成のカスタムロジック
    def create(self, validated_data):
        # バリデーション済みのデータからユーザーを作成
        user = User.objects.create_user(  # Djangoの標準的なユーザー作成メソッド
            username=validated_data["username"],
            email=validated_data["email"]
        )
        # パスワードを安全にハッシュ化して保存
        user.set_password(validated_data["password1"])
        user.save()
        return user
