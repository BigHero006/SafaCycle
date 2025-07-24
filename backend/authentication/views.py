from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from .models import CustomUser, UserProfile
from .serializers import (
    UserRegistrationSerializer, 
    UserLoginSerializer, 
    UserProfileSerializer,
    UserProfileDetailSerializer
)
from safacycle_backend.mongodb_service import MongoDBService
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """User registration endpoint - automatically saves to MongoDB"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        
        # Automatically save user to MongoDB on registration
        try:
            mongodb_service = MongoDBService()
            user_data = {
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'phone_number': getattr(user, 'phone_number', ''),
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_active': user.is_active,
                'is_staff': user.is_staff,
                'date_joined': user.date_joined.isoformat(),
                'last_login': None,
                'total_scans': 0,
                'total_points': 0,
                'level': 'Beginner',
                'achievements': []
            }
            
            mongodb_id = mongodb_service.save_user_data(user_data)
            logger.info(f"User {user.username} automatically saved to MongoDB on registration")
            
            return Response({
                'user': UserProfileSerializer(user).data,
                'token': token.key,
                'message': 'User registered successfully',
                'mongodb_saved': True,
                'mongodb_id': str(mongodb_id) if mongodb_id else None
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Failed to save user to MongoDB on registration: {e}")
            # Still return successful registration even if MongoDB save fails
            return Response({
                'user': UserProfileSerializer(user).data,
                'token': token.key,
                'message': 'User registered successfully (MongoDB save failed)',
                'mongodb_saved': False,
                'mongodb_error': str(e)
            }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """User login endpoint - now automatically saves to MongoDB"""
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        login(request, user)
        
        # Automatically save user to MongoDB on successful login
        try:
            mongodb_service = MongoDBService()
            user_data = {
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'phone_number': getattr(user, 'phone_number', ''),
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_active': user.is_active,
                'is_staff': user.is_staff,
                'date_joined': user.date_joined.isoformat(),
                'last_login': user.last_login.isoformat() if user.last_login else None,
                'total_scans': 0,
                'total_points': 0,
                'level': 'Beginner',
                'achievements': []
            }
            
            mongodb_id = mongodb_service.save_user_data(user_data)
            logger.info(f"User {user.username} automatically saved to MongoDB on login")
            
            return Response({
                'token': token.key,
                'user': UserProfileSerializer(user).data,
                'message': 'Login successful',
                'mongodb_saved': True,
                'mongodb_id': str(mongodb_id) if mongodb_id else None
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Failed to save user to MongoDB on login: {e}")
            # Still return successful login even if MongoDB save fails
            return Response({
                'token': token.key,
                'user': UserProfileSerializer(user).data,
                'message': 'Login successful (MongoDB save failed)',
                'mongodb_saved': False,
                'mongodb_error': str(e)
            }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    """User logout endpoint"""
    try:
        request.user.auth_token.delete()
        logout(request)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
    except:
        return Response({'error': 'Error during logout'}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get and update user profile"""
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    """Get user profile"""
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)
