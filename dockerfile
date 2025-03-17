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

# プロジェクトファイルをコピー
COPY . .

# 静的ファイル用ディレクトリを作成
RUN mkdir -p /app/staticfiles && chmod 755 /app/staticfiles
RUN mkdir -p /app/static && chmod 755 /app/static

# フロントエンドのビルド処理
WORKDIR /app/frontend
RUN npm install

# 本番環境用にReactアプリをビルド
RUN npm run build

# メインディレクトリに戻る
WORKDIR /app

# 本番環境用の環境変数を設定
ENV NODE_ENV=production \
    DEBUG=False

# ビルド成果物を静的ファイルディレクトリにコピー
RUN if [ -d "/app/frontend/build" ]; then \
    mkdir -p /app/static && \
    cp -r /app/frontend/build/* /app/static/ && \
    echo "フロントエンドビルド成果物をコピーしました"; \
else \
    echo "ビルド成果物のディレクトリが存在しません"; \
fi

# 静的ファイル収集
RUN python manage.py collectstatic --noinput

# マイグレーションとサーバー起動
CMD python manage.py migrate && gunicorn project.wsgi:application --bind 0.0.0.0:$PORT --workers 4 --threads 2