from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('signup/', views.signup, name='signup'),
    path('forum/', views.create_post, name='create_post'),
    path('patrol-stats/', views.get_stats, name='get_stats'),
    path('panic/', views.trigger_panic, name='panic'),
    path('pay-subscription/', views.pay_subscription, name='pay'),
    path('cancel-subscription/', views.cancel_subscription, name='cancel'),
]