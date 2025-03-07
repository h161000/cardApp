# ベースイメージ指定
FROM python:3.11-slim

# 環境変数設定
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# システム依存関係をインストール
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Node.jsのインストール（最新の安定版）
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# 作業ディレクトリ設定
WORKDIR /app

# Python依存関係
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# プロジェクトファイルをコピー（先にコピーしてからfrontendを処理）
COPY . .

# 静的ファイル用ディレクトリ
RUN mkdir -p /app/staticfiles && chmod 755 /app/staticfiles
RUN mkdir -p /app/data && chmod 777 /app/data

# フロントエンドディレクトリがない場合は作成
RUN if [ ! -d "/app/frontend" ]; then mkdir -p /app/frontend; fi

# Reactアプリの初期化（frontendが空の場合）
RUN cd /app/frontend && \
    if [ ! -f "package.json" ]; then \
    npx create-react-app . --template typescript && \
    echo 'REACT_APP_API_URL=/api' > .env && \
    echo 'REACT_APP_BASENAME=/' >> .env; \
    fi

# Reactの依存関係をインストール
WORKDIR /app/frontend
RUN npm install
RUN npm run build || echo "ビルド失敗。開発中は無視してください。"

# メインディレクトリに戻る
WORKDIR /app

# エントリポイントスクリプトをコピー
COPY docker-entrypoint.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# フロントエンドのビルド成果物をDjangoの静的ファイルディレクトリにコピー
RUN if [ -d "/app/frontend/build" ]; then \
    cp -r /app/frontend/build/* /app/staticfiles/ || echo "ビルド成果物がありません"; \
    fi

# 静的ファイル収集
RUN python manage.py collectstatic --noinput || echo "静的ファイル収集に失敗しました"

# データベースマイグレーション（開発環境では実行時に行う）
CMD python manage.py migrate && gunicorn project.wsgi:application --bind 0.0.0.0:$PORT --workers 4 --threads 2

# エントリポイント設定
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]