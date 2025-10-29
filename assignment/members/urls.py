from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup),
    path('login/', views.login),
    path('forum/', views.forum),
    path('patrol-stats/', views.patrol_stats),
    path('panic/', views.panic),
    path('pay-subscription/', views.pay_subscription),
    path('cancel-subscription/', views.cancel_subscription),
]