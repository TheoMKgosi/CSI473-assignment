from django.urls import path
from . import views

app_name = 'members'

urlpatterns = [
    path('signup/', views.member_signup, name='member_signup'),
    path('login/', views.member_login, name='member_login'),
    path('dashboard/', views.member_dashboard, name='member_dashboard'),
    path('logout/', views.member_logout, name='member_logout'),
    # API endpoints
    path('api/signup/', views.api_signup, name='api_signup'),
    path('api/login/', views.api_login, name='api_login'),
    path('api/forum/', views.api_forum, name='api_forum'),
    path('api/patrol-stats/', views.api_patrol_stats, name='api_patrol_stats'),
    path('api/panic/', views.api_panic, name='api_panic'),
    path('api/pay-subscription/', views.api_pay_subscription, name='api_pay_subscription'),
    path('api/cancel-subscription/', views.api_cancel_subscription, name='api_cancel_subscription'),
]