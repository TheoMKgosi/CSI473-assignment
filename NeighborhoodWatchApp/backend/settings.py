cd /workspaces/CSI473-assignment/NeighborhoodWatchApp
cat backend/settings.py | grep -i "cors\|middleware"
    'corsheaders',
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
# FIX CSRF AND CORS SETTINGS
CORS_ALLOWED_ORIGINS = [
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
(.venv) @ramokhua ➜ /workspaces/CSI473-assignment/NeighborhoodWatchApp (main) $ 