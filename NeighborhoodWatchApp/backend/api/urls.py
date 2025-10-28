from django.urls import path
from backend.api import views

urlpatterns = [
    path('signup/', views.signup),
    path('login/', views.login),
    path('patrol-stats/', views.patrol_stats),
    path('panic/', views.panic),
    path('pay-subscription/', views.pay_subscription),
    path('cancel-subscription/', views.cancel_subscription),
]