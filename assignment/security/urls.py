from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'security'

router = DefaultRouter()
router.register(r'patrol-routes', views.PatrolRouteViewSet)

urlpatterns = [
    path('signup/', views.security_signup, name='security_signup'),
    path('login/', views.security_login, name='security_login'),
    path('dashboard/', views.security_dashboard, name='security_dashboard'),
    path('logout/', views.security_logout, name='security_logout'),
    path('api/', include(router.urls)),
    path('api/scan-qr/', views.scan_qr_code, name='scan_qr_code'),
    path('api/my-route/', views.my_route, name='my_route'),
]