#!/bin/bash
if [ "$NODE_ENV" = "development" ]; then
    cd /app/frontend && npm start &
    cd /app && python manage.py runserver 0.0.0.0:8000
else
    cd /app && gunicorn project.wsgi:application --bind 0.0.0.0:$PORT --workers 4 --threads 2
fi