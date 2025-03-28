"""
Django settings for project project.

Generated by 'django-admin startproject' using Django 5.1.6.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

import os
from pathlib import Path

import dj_database_url
from dotenv import load_dotenv

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv(
    "SECRET_KEY", "django-insecure-cuxr0fycsujj_c-%+5^zfjhxa-hqdjb2!ji0f24$9uhljz^3lz"
)

# SECURITY WARNING: don't run with debug turned on in production!
# DEBUG = os.getenv("DEBUG", "False") == "True"
# 一時的に本番環境でもデバッグを有効化
DEBUG = False
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "*").split(",")

# Application definition

INSTALLED_APPS = [
    # Django標準アプリケーション
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # サードパーティアプリケーション
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "webpack_loader",
    # プロジェクト固有のアプリケーション
    "card",
    "accounts",
    "api",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # CORSミドルウェアを先頭に追加
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    # "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "project.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "project.wsgi.application"


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = (
    {
        "default": dj_database_url.config(
            default="sqlite:///" + str(BASE_DIR / "db.sqlite3"), conn_max_age=600
        )
    }
    # if not DEBUG or os.getenv("DATABASE_URL")
    # else {
    #     "default": {
    #         "ENGINE": "django.db.backends.postgresql",
    #         "NAME": os.getenv("POSTGRES_DB", "django_db"),
    #         "USER": os.getenv("POSTGRES_USER", "django_user"),
    #         "PASSWORD": os.getenv("POSTGRES_PASSWORD", "django_password"),
    #         "HOST": os.getenv("POSTGRES_HOST", "db"),
    #         "PORT": os.getenv("POSTGRES_PORT", "5432"),
    #     }
    # }
)


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = "ja"

TIME_ZONE = "Asia/Tokyo"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

# 本番環境と開発環境で異なる設定を使用

# # 開発環境: webpack-dev-serverからの提供
# STATICFILES_DIRS = [
#     os.path.join(BASE_DIR, "static"),
# ]

# 本番環境: ビルド済みReactアプリを使用
STATICFILES_DIRS = [
    # フロントエンドのビルドディレクトリを追加
    os.path.join(BASE_DIR, "frontend", "build"),
]
# 明示的にMIMEタイプのマッピングを追加
import mimetypes
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# CSRF settings
CSRF_TRUSTED_ORIGINS = [
    "https://cardapp-1ruk.onrender.com",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://0.0.0.0:3000",  # Docker開発環境用に追加
    "http://0.0.0.0:8000",  # Docker開発環境用に追加
]

# WhiteNoiseの設定を修正

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
# WhiteNoiseのMIMEタイプ設定を明示的に指定
WHITENOISE_MIMETYPES = {
    '.js': 'application/javascript',
    '.css': 'text/css',
}
import mimetypes
mimetypes.add_type("application/javascript", ".js", True)
mimetypes.add_type("text/css", ".css", True)
# Security settings

SECURE_SSL_REDIRECT = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
# CSRF設定を無効化または緩和（APIエンドポイント用）
if "cardapp-1ruk.onrender.com" in ALLOWED_HOSTS:
    CSRF_COOKIE_SAMESITE = None
    CSRF_COOKIE_SECURE = True
    CSRF_COOKIE_HTTPONLY = True
    CSRF_USE_SESSIONS = False
    SESSION_COOKIE_SAMESITE = None

# Authentication settings
LOGIN_URL = "login"
LOGIN_REDIRECT_URL = "/"
LOGOUT_REDIRECT_URL = "/"

# REST Framework settings
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        # "rest_framework.authentication.SessionAuthentication",
        # "rest_framework.authentication.BasicAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
}

DJANGO_REST_FRAMEWORK_TOKEN_LENGTH = 35

# JWT settings
from datetime import timedelta

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,  # リフレッシュトークンのローテーションを有効化
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "UPDATE_LAST_LOGIN": True,  # ログイン時に最終ログイン時間を更新
}

# CORS settings
CORS_ALLOW_ALL_ORIGINS = DEBUG  # 開発環境のみTrue
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = ["DELETE", "GET", "OPTIONS", "PATCH", "POST", "PUT"]

# 開発環境

# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000",
#     "http://127.0.0.1:3000",
#     "http://localhost:8000",
#     "http://0.0.0.0:3000",  # Docker開発環境用に追加
#     "http://0.0.0.0:8000",  # Docker開発環境用に追加
# ]
# 本番環境でのCORS設定
CORS_ALLOWED_ORIGINS = [
    "https://cardapp-1ruk.onrender.com",
    *[f"https://{host.strip()}" for host in ALLOWED_HOSTS if host.strip() != "*"],
]
# 本番
CORS_ALLOW_HEADERS = [
    'x-csrftoken',
    'authorization',
    'content-type',
    'access-control-allow-origin',
    'origin',
]
WEBPACK_LOADER = {
    "DEFAULT": {
        "CACHE": not DEBUG,
        "BUNDLE_DIR_NAME": "static/",
        "STATS_FILE": os.path.join(BASE_DIR, "frontend", "webpack-stats.json"),
        "POLL_INTERVAL": 0.1,
        "TIMEOUT": None,
        "IGNORE": [r".+\.hot-update.js", r".+\.map"],
    }
}
# 本番環境でのセキュリティ設定を調整
# # デバッグモードがオンの場合、いくつかのセキュリティ設定を一時的に無効化
# if DEBUG:
#     # デバッグモード時はSSLリダイレクトを無効化
#     SECURE_SSL_REDIRECT = False
#     SESSION_COOKIE_SECURE = False
#     CSRF_COOKIE_SECURE = False