from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


class SignUpForm(UserCreationForm):
# ユーザー名のエラーメッセージをさらにカスタマイズする場合
    username = forms.CharField(
        label='ユーザー名',
        help_text='必須。150文字以下。英数字と@/./+/-/_のみ使用可能。',
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'username'
        }),
        error_messages={
            'required': 'ユーザー名は必須です。',
            'unique': 'このユーザー名は既に使用されています。',
            'invalid': '英数字と@/./+/-/_のみ使用可能です。'
        }
    )

    email = forms.EmailField(
        max_length=254,
        required=True,
        label='メールアドレス',
        help_text='必須。有効なメールアドレスを入力してください。',
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'example@example.com'
        }),
        error_messages={
            'required': 'メールアドレスは必須です。',
            'invalid': '有効なメールアドレスを入力してください。'
        }
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # パスワードフィールドのカスタマイズ
        self.fields['password1'].label = 'パスワード'
        self.fields['password2'].label = 'パスワード（確認用）'
        self.fields['password1'].help_text = '以下の条件を満たすパスワードを設定してください：<br>' \
                                           '・8文字以上<br>' \
                                           '・数字を含める<br>' \
                                           '・ユーザー名と似ていない<br>' \
                                           '・一般的なパスワードは使用不可'
        self.fields['password2'].help_text = '確認のため、再度パスワードを入力してください。'
        
        # パスワードフィールドのエラーメッセージをカスタマイズ
        self.fields['password1'].error_messages = {
            'required': 'パスワードは必須です。',
        }
        self.fields['password2'].error_messages = {
            'required': '確認用パスワードは必須です。',
        }
        # パスワード不一致のエラーメッセージ
        self.error_messages['password_mismatch'] = 'パスワードが一致しません。'

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')