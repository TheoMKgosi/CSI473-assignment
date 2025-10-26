from django.urls import path
from . import views

app_name = 'members'

urlpatterns = [
    path('signup/', views.member_signup, name='member_signup'),
    path('login/', views.member_login, name='member_login'),
    path('dashboard/', views.member_dashboard, name='member_dashboard'),
    path('logout/', views.member_logout, name='member_logout'),
]