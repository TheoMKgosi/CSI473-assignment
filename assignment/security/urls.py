# security/urls.py
from django.urls import path
from . import views

app_name = 'security'

urlpatterns = [
    path('signup/', views.security_signup, name='security_signup'),
    path('login/', views.security_login, name='security_login'),
    path('profile/', views.security_profile, name='security_profile'),
    path('compliance/', views.security_compliance, name='security_compliance'),
    path('route/', views.security_route, name='security_route'),
    path('validate-qr/', views.security_validate_qr, name='security_validate_qr'),
    path('scan-qr/', views.security_scan_qr, name='security_scan_qr'),
    path('log-scan/', views.security_log_scan, name='security_log_scan'),
    path('panic-alerts/', views.get_panic_alerts, name='get_panic_alerts'),
    path('resolve-alert/', views.resolve_panic_alert, name='resolve_panic_alert'),
]