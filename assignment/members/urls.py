from django.urls import path
from . import views

app_name = 'members'

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('forum/', views.forum, name='forum'),
    path('patrol-stats/', views.patrol_stats, name='patrol_stats'),
    path('panic/', views.panic, name='panic'),
    path('pay-subscription/', views.pay_subscription, name='pay_subscription'),
    path('cancel-subscription/', views.cancel_subscription, name='cancel_subscription'),
]