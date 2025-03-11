from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.views import LoginView
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import CreateView, TemplateView
from rest_framework import generics, status
from rest_framework.response import Response

from api.serializers import RegisterSerializer

from .forms import SignUpForm

# Create your views here.


class SignUpView(CreateView):
    form_class = UserCreationForm
    template_name = "accounts/signup.html"
    success_url = reverse_lazy("login")

    # form送信処理をするメソッド
    def form_valid(self, form):
        # serializers.pyのRegisterSerializerにformのバリデーションを通ったデータを渡す
        serializer = RegisterSerializer(data=form.cleaned_data)
        # serializerで再度バリデーション
        if serializer.is_valid():
            # 保存
            serializer.save()
            # super()で親クラスのform_validを呼び出し、fromの送信処理を実行
            return super().form_valid(form)
        else:
            # form送信を拒否し、エラーメッセージを表示
            return self.form_invalid(form)

    # エラーがある場合
    def form_invalid(self, form):
        # エラーがある場合の処理
        return super().form_invalid(form)


class CustomLoginView(LoginView):
    """
    カスタムログインビュークラス
    LoginViewを継承して、ログイン機能をカスタマイズします
    """

    # ログインページのテンプレートを指定
    template_name = "accounts/login.html"

    # すでにログインしているユーザーがアクセスした場合、リダイレクトする
    redirect_authenticated_user = True

    def get_success_url(self):
        """
        ログイン成功後のリダイレクト先を指定するメソッド
        Returns:
            str: リダイレクト先のURL（この場合はcard:indexビュー）
        """
        return reverse_lazy("card:index")  # ログイン後のリダイレクト先

    def get_context_data(self, **kwargs):
        """
        テンプレートに渡すコンテキストデータを拡張するメソッド
        Args:
            **kwargs: 追加の名前付き引数

        Returns:
            dict: テンプレートで使用するコンテキストデータ
        """
        # 親クラスのget_context_dataを呼び出し
        context = super().get_context_data(**kwargs)
        # テンプレートで使用するタイトルを追加
        context["title"] = "ログイン"
        return context


class SignUpAPIView(TemplateView):
    template_name = "index.html"  # Reactアプリケーションのエントリーポイント
