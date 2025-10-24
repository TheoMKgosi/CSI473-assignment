from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('signup/', views.SignupView.as_view(), name='signup'),
    path('forum/', views.ForumPostView.as_view(), name='forum'),
    path('patrol-stats/', views.PatrolStatView.as_view(), name='patrol-stats'),
    path('panic/', views.EmergencyAlertView.as_view(), name='panic'),
    path('pay-subscription/', views.PaySubscriptionView.as_view(), name='pay-subscription'),
    path('cancel-subscription/', views.CancelSubscriptionView.as_view(), name='cancel-subscription'),
]