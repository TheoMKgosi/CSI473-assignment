from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, ForumPost, PatrolStat, EmergencyAlert

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password']
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class ForumPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumPost
        fields = '__all__'

class PatrolStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatrolStat
        fields = '__all__'

class EmergencyAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyAlert
        fields = '__all__'