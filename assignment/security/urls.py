from django.urls import path
from . import views

app_name = 'security'

urlpatterns = [
    path('signup/', views.security_signup, name='security_signup'),
    path('login/', views.security_login, name='security_login'),
]