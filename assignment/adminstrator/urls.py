from django.urls import path
from . import views

app_name = 'adminstrator'

urlpatterns = [
    path('login/', views.administrator_login, name='administrator_login'),
    path('dashboard/', views.administrator_dashboard, name='administrator_dashboard'),
    path('logout/', views.administrator_logout, name='administrator_logout'),
    path('approve/<int:security_id>/', views.approve_security, name='approve_security'),
    path('reject/<int:security_id>/', views.reject_security, name='reject_security'),
    path('subscription-statistics/', views.subscription_statistics, name='subscription_statistics'),
    path('security-compliance/', views.security_compliance_dashboard, name='security_compliance'),
    path('user-management/', views.user_management, name='user_management'),
    path('user/<int:user_id>/activate/', views.activate_user, name='activate_user'),
    path('user/<int:user_id>/deactivate/', views.deactivate_user, name='deactivate_user'),
    path('user/<int:user_id>/delete/', views.delete_user, name='delete_user'),
    path('create-admin/', views.create_administrator, name='create_administrator'),
    path('approve-member/<int:member_id>/', views.approve_member, name='approve_member'),
    path('reject-member/<int:member_id>/', views.reject_member, name='reject_member'),
    path('user/<int:user_id>/print-qr/', views.print_qr_code, name='print_qr_code'),
    path('routes/', views.route_list, name='route_list'),
    path('routes/create/', views.route_create, name='route_create'),
    path('routes/<int:route_id>/edit/', views.route_edit, name='route_edit'),
    path('routes/<int:route_id>/delete/', views.route_delete, name='route_delete'),
    path('routes/<int:route_id>/assign/', views.assign_route, name='assign_route'),
]