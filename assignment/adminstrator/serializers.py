from rest_framework import serializers
from .models import House

class HouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = House
        fields = ['id', 'address', 'owner', 'date_registered', 'qr_code_data', 'house_number', 'bedrooms', 'bathrooms', 'square_footage', 'property_type', 'is_occupied']
        read_only_fields = ['date_registered', 'qr_code_data']