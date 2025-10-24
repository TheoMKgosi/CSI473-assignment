from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import UserSerializer, UserProfileSerializer, ForumPostSerializer, PatrolStatSerializer, EmergencyAlertSerializer
from .models import UserProfile, ForumPost, PatrolStat, EmergencyAlert

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class SignupView(APIView):
    def post(self, request):
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            profile_data = {
                'user': user.id,
                'full_name': request.data.get('full_name', ''),
                'phone': request.data.get('phone', ''),
                'address': request.data.get('address', '')
            }
            profile_serializer = UserProfileSerializer(data=profile_data)
            if profile_serializer.is_valid():
                profile_serializer.save()
                token, _ = Token.objects.get_or_create(user=user)
                return Response({'token': token.key}, status=status.HTTP_201_CREATED)
            return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ForumPostView(APIView):
    def get(self, request):
        posts = ForumPost.objects.all()
        serializer = ForumPostSerializer(posts, many=True)
        return Response(serializer.data)
    def post(self, request):
        serializer = ForumPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PatrolStatView(APIView):
    def get(self, request):
        stats = PatrolStat.objects.first()
        serializer = PatrolStatSerializer(stats)
        return Response(serializer.data)

class EmergencyAlertView(APIView):
    def post(self, request):
        serializer = EmergencyAlertSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({'success': True}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PaySubscriptionView(APIView):
    def post(self, request):
        user_profile = UserProfile.objects.get(user=request.user)
        user_profile.subscription_active = True
        user_profile.last_payment_date = request.data.get('payment_date')
        user_profile.save()
        return Response({'success': True}, status=status.HTTP_200_OK)

class CancelSubscriptionView(APIView):
    def post(self, request):
        user_profile = UserProfile.objects.get(user=request.user)
        user_profile.subscription_active = False
        user_profile.save()
        return Response({'success': True}, status=status.HTTP_200_OK)