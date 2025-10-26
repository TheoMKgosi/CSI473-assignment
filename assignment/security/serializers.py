from rest_framework import serializers
from .models import PatrolRoute

class PatrolRouteSerializer(serializers.ModelSerializer):
    houses_addresses = serializers.SerializerMethodField()
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    assigned_guards = serializers.SerializerMethodField()

    class Meta:
        model = PatrolRoute
        fields = ['id', 'name', 'description', 'houses', 'houses_addresses', 'assigned_guards', 'created_by', 'created_by_username', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at', 'created_by_username', 'assigned_guards']

    def get_houses_addresses(self, obj):
        return [house.address for house in obj.houses.all()]

    def get_assigned_guards(self, obj):
        guards = obj.assigned_guards.filter(status='approved')
        return [{'id': guard.id, 'username': guard.user.username, 'employee_id': guard.employee_id} for guard in guards]

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)