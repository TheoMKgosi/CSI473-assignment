import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-neighborhood-watch-2024-secret-key-12345'
DEBUG = True
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'backend.api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# FIX CSRF AND CORS SETTINGS
CORS_ALLOWED_ORIGINS = [
    "https://super-palm-tree-69499prjx6rp24xg7-8081.app.github.dev",
    "https://super-palm-tree-69499prjx6rp24xg7-8000.app.github.dev",
    "http://localhost:8081",
    "https://localhost:8081",
    "http://127.0.0.1:8081",
    "https://127.0.0.1:8081",
    "http://0.0.0.0:8081",
    "https://0.0.0.0:8081",
]

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    "https://super-palm-tree-69499prjx6rp24xg7-8081.app.github.dev",
    "https://super-palm-tree-69499prjx6rp24xg7-8000.app.github.dev",
    "http://localhost:8081",
    "https://localhost:8081", 
    "http://127.0.0.1:8081",
    "https://127.0.0.1:8081",
    "http://0.0.0.0:8081",
    "https://0.0.0.0:8081",
    "http://localhost:8000",
    "https://localhost:8000",
    "http://0.0.0.0:8000",
    "https://0.0.0.0:8000",
]

# Disable CSRF for API views (since we're using token auth)
CSRF_USE_SESSIONS = False
CSRF_COOKIE_HTTPONLY = False

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'