from django.contrib import admin
from security.models import SecurityProfile
from .models import Route

@admin.register(SecurityProfile)
class SecurityProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'employee_id', 'status', 'phone_number', 'date_of_birth']
    list_filter = ['status', 'role']
    search_fields = ['user__username', 'user__email', 'employee_id']
    readonly_fields = ['role']
    actions = ['approve_selected', 'reject_selected']
    
    def approve_selected(self, request, queryset):
        updated = queryset.update(status='approved')
        self.message_user(request, f'{updated} security guards have been approved.')
    
    def reject_selected(self, request, queryset):
        updated = queryset.update(status='rejected')
        self.message_user(request, f'{updated} security guards have been rejected.')


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ['name', 'assigned_security_guard', 'created_at', 'updated_at']
    list_filter = ['assigned_security_guard', 'created_at']
    search_fields = ['name', 'description']
    filter_horizontal = ['checkpoints']  # For many-to-many field
