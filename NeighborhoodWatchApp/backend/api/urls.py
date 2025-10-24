from django.urls import path
from backend.api import views

urlpatterns = [
    path('api/signup/', views.signup, name='signup'),
    path('api/login/', views.login, name='login'),
    path('api/forum/', views.forum, name='forum'),
    path('api/patrol-stats/', views.patrol_stats, name='patrol_stats'),
    path('api/panic/', views.panic, name='panic'),
    path('api/pay-subscription/', views.pay_subscription, name='pay_subscription'),
    path('api/cancel-subscription/', views.cancel_subscription, name='cancel_subscription'),
]