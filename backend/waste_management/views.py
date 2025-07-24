from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import datetime, timedelta
from .models import WasteCategory, WasteItem, WasteScan, WasteCollectionSchedule
from .serializers import (
    WasteCategorySerializer, 
    WasteItemSerializer, 
    WasteScanSerializer,
    WasteScanCreateSerializer,
    WasteCollectionScheduleSerializer,
    UserStatsSerializer
)
from safacycle_backend.mongodb_service import mongodb_service

class WasteCategoryListView(generics.ListAPIView):
    """List all waste categories"""
    queryset = WasteCategory.objects.all()
    serializer_class = WasteCategorySerializer
    permission_classes = [IsAuthenticated]

class WasteItemListView(generics.ListAPIView):
    """List all waste items"""
    queryset = WasteItem.objects.all()
    serializer_class = WasteItemSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = WasteItem.objects.all()
        category = self.request.query_params.get('category', None)
        if category is not None:
            queryset = queryset.filter(category=category)
        return queryset

class WasteScanCreateView(generics.CreateAPIView):
    """Create a new waste scan"""
    serializer_class = WasteScanCreateSerializer
    permission_classes = [IsAuthenticated]

class UserWasteScanListView(generics.ListAPIView):
    """List user's waste scans"""
    serializer_class = WasteScanSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return WasteScan.objects.filter(user=self.request.user).order_by('-created_at')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats(request):
    """Get user waste statistics"""
    user = request.user
    
    # Basic stats
    scans = WasteScan.objects.filter(user=user)
    total_scans = scans.count()
    total_weight = scans.aggregate(Sum('estimated_weight_grams'))['estimated_weight_grams__sum'] or 0
    
    # Category breakdown
    category_breakdown = {}
    for category in WasteCategory.objects.all():
        count = scans.filter(category=category).count()
        category_breakdown[category.name] = count
    
    # This month stats
    start_of_month = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    this_month_scans = scans.filter(created_at__gte=start_of_month).count()
    this_month_points = scans.filter(created_at__gte=start_of_month).aggregate(
        Sum('points_awarded'))['points_awarded__sum'] or 0
    
    stats_data = {
        'total_scans': total_scans,
        'total_points': user.total_points,
        'level': user.level,
        'total_weight_grams': total_weight,
        'category_breakdown': category_breakdown,
        'this_month_scans': this_month_scans,
        'this_month_points': this_month_points,
    }
    
    serializer = UserStatsSerializer(stats_data)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_data(request):
    """Get dashboard data for user"""
    user = request.user
    
    # Recent scans (last 5)
    recent_scans = WasteScan.objects.filter(user=user).order_by('-created_at')[:5]
    recent_scans_data = WasteScanSerializer(recent_scans, many=True).data
    
    # Category breakdown
    scans = WasteScan.objects.filter(user=user)
    category_breakdown = {}
    for category in WasteCategory.objects.all():
        count = scans.filter(category=category).count()
        category_breakdown[category.name] = count
    
    # Monthly progress
    now = timezone.now()
    current_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    previous_month_start = (current_month_start - timedelta(days=1)).replace(day=1)
    
    current_month_points = scans.filter(
        created_at__gte=current_month_start
    ).aggregate(Sum('points_awarded'))['points_awarded__sum'] or 0
    
    previous_month_points = scans.filter(
        created_at__gte=previous_month_start,
        created_at__lt=current_month_start
    ).aggregate(Sum('points_awarded'))['points_awarded__sum'] or 0
    
    dashboard_data = {
        'recent_scans': recent_scans_data,
        'category_breakdown': category_breakdown,
        'total_points': user.total_points,
        'level': user.level,
        'monthly_progress': {
            'current_month': current_month_points,
            'previous_month': previous_month_points,
        }
    }
    
    return Response(dashboard_data, status=status.HTTP_200_OK)

class WasteCollectionScheduleView(generics.ListAPIView):
    """List waste collection schedules"""
    queryset = WasteCollectionSchedule.objects.filter(is_active=True)
    serializer_class = WasteCollectionScheduleSerializer
    permission_classes = [IsAuthenticated]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mongodb_status(request):
    """Get MongoDB connection status and database statistics"""
    try:
        # Check connection status
        is_connected = mongodb_service.is_connected()
        
        if is_connected:
            # Get database stats
            stats = mongodb_service.get_db_stats()
            
            response_data = {
                'status': 'connected',
                'message': 'MongoDB connection is active',
                'database_info': stats if stats else None
            }
        else:
            response_data = {
                'status': 'disconnected',
                'message': 'MongoDB connection failed',
                'database_info': None
            }
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': f'Error checking MongoDB status: {str(e)}',
            'database_info': None
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_analytics(request):
    """Get user analytics from MongoDB"""
    try:
        user_id = str(request.user.id)
        analytics_data = mongodb_service.get_user_analytics(user_id)
        
        return Response({
            'user_id': user_id,
            'analytics_count': len(analytics_data),
            'analytics': analytics_data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Error fetching user analytics: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def test_mongodb_save(request):
    """Test endpoint to manually save data to MongoDB"""
    try:
        # Create test analytics data
        test_data = {
            'user_id': str(request.user.id),
            'username': request.user.username,
            'scan_id': 'manual_test_' + str(timezone.now().timestamp()),
            'category': 'Test Category',
            'category_type': 'test',
            'item': 'Test Item',
            'quantity': 1,
            'estimated_weight_grams': 50,
            'points_awarded': 5,
            'bonus_points': 0,
            'ml_prediction': 'test_prediction',
            'ml_confidence': 0.85,
            'is_verified': False,
            'location': 'Test Location',
            'description': 'Manual MongoDB test from API',
            'timestamp': timezone.now().isoformat(),
            'created_at': timezone.now().isoformat(),
            'test_data': True,
        }
        
        # Save to MongoDB
        result_id = mongodb_service.save_scan_analytics(test_data)
        
        if result_id:
            # Also test ML prediction save
            ml_test_data = {
                'model_version': '1.0',
                'input_data': 'manual_test_data',
                'prediction': 'test_prediction',
                'confidence': 0.85,
                'processing_time': 0.5,
                'timestamp': timezone.now().isoformat(),
                'test_data': True,
            }
            
            ml_result_id = mongodb_service.save_ml_prediction(ml_test_data)
            
            return Response({
                'success': True,
                'message': 'Test data saved to MongoDB successfully',
                'scan_analytics_id': str(result_id),
                'ml_prediction_id': str(ml_result_id) if ml_result_id else None,
                'mongodb_status': mongodb_service.is_connected()
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'success': False,
                'message': 'Failed to save test data to MongoDB',
                'mongodb_status': mongodb_service.is_connected()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Error in MongoDB test: {str(e)}',
            'mongodb_status': False
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_user_to_mongodb(request):
    """Save user data to MongoDB users collection"""
    try:
        user = request.user
        user_data = {
            'user_id': str(user.id),
            'username': user.username,
            'email': user.email,
            'phone_number': getattr(user, 'phone_number', ''),
            'total_points': user.total_points,
            'level': user.level,
            'date_joined': user.date_joined.isoformat(),
            'last_login': user.last_login.isoformat() if user.last_login else None,
            'is_active': user.is_active,
            'profile': {
                'bio': getattr(user.profile, 'bio', '') if hasattr(user, 'profile') else '',
                'location': getattr(user.profile, 'location', '') if hasattr(user, 'profile') else ''
            },
            'saved_from': 'django_api',
            'api_save': True
        }
        
        result_id = mongodb_service.save_user_data(user_data)
        
        if result_id:
            return Response({
                'success': True,
                'message': 'User data saved to MongoDB users collection',
                'user_id': str(user.id),
                'mongodb_id': str(result_id)
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'success': False,
                'message': 'Failed to save user data to MongoDB'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Error saving user data: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_from_mongodb(request):
    """Get user data from MongoDB users collection"""
    try:
        user_id = str(request.user.id)
        user_data = mongodb_service.get_user_data(user_id)
        
        if user_data:
            # Convert ObjectId to string for JSON serialization
            user_data['_id'] = str(user_data['_id'])
            
            return Response({
                'success': True,
                'user_data': user_data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'message': 'User data not found in MongoDB'
            }, status=status.HTTP_404_NOT_FOUND)
            
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Error retrieving user data: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_admin_action(request):
    """Save admin action to MongoDB admin collection"""
    try:
        # Check if user has admin permissions (you can customize this check)
        if not request.user.is_staff:
            return Response({
                'error': 'Admin permissions required'
            }, status=status.HTTP_403_FORBIDDEN)
        
        admin_data = {
            'admin_id': str(request.user.id),
            'admin_username': request.user.username,
            'action_type': request.data.get('action_type', 'api_action'),
            'action_description': request.data.get('description', 'Action performed via API'),
            'target_user_id': request.data.get('target_user_id'),
            'metadata': {
                'ip_address': request.META.get('REMOTE_ADDR'),
                'user_agent': request.META.get('HTTP_USER_AGENT'),
                'method': request.method
            },
            'saved_from': 'django_api',
            'api_save': True
        }
        
        result_id = mongodb_service.save_admin_action(admin_data)
        
        if result_id:
            return Response({
                'success': True,
                'message': 'Admin action saved to MongoDB',
                'action_id': str(result_id)
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'success': False,
                'message': 'Failed to save admin action'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Error saving admin action: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_admin_actions(request):
    """Get admin actions from MongoDB admin collection"""
    try:
        # Check if user has admin permissions
        if not request.user.is_staff:
            return Response({
                'error': 'Admin permissions required'
            }, status=status.HTTP_403_FORBIDDEN)
        
        admin_id = request.GET.get('admin_id')
        limit = int(request.GET.get('limit', 50))
        
        actions = mongodb_service.get_admin_actions(admin_id, limit)
        
        # Convert ObjectIds to strings for JSON serialization
        for action in actions:
            action['_id'] = str(action['_id'])
        
        return Response({
            'success': True,
            'actions_count': len(actions),
            'actions': actions
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Error retrieving admin actions: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_driver_data(request):
    """Save driver data to MongoDB drivers collection"""
    try:
        # Check if user has appropriate permissions
        if not (request.user.is_staff or request.user.has_perm('waste_management.add_driver')):
            return Response({
                'error': 'Insufficient permissions'
            }, status=status.HTTP_403_FORBIDDEN)
        
        driver_data = {
            'driver_id': request.data.get('driver_id', str(request.user.id)),
            'username': request.data.get('username', ''),
            'full_name': request.data.get('full_name', ''),
            'employee_id': request.data.get('employee_id', ''),
            'vehicle_number': request.data.get('vehicle_number', ''),
            'vehicle_type': request.data.get('vehicle_type', 'garbage_truck'),
            'vehicle_capacity_kg': request.data.get('vehicle_capacity_kg', 0),
            'status': request.data.get('status', 'active'),
            'current_location': {
                'latitude': request.data.get('latitude'),
                'longitude': request.data.get('longitude'),
                'area': request.data.get('area', ''),
                'city': request.data.get('city', '')
            },
            'route_assigned': request.data.get('route_assigned', ''),
            'shift_timing': request.data.get('shift_timing', ''),
            'contact_number': request.data.get('contact_number', ''),
            'emergency_contact': request.data.get('emergency_contact', ''),
            'hire_date': request.data.get('hire_date', timezone.now().isoformat()),
            'saved_from': 'django_api',
            'api_save': True
        }
        
        result_id = mongodb_service.save_driver_data(driver_data)
        
        if result_id:
            return Response({
                'success': True,
                'message': 'Driver data saved to MongoDB',
                'driver_id': driver_data['driver_id'],
                'mongodb_id': str(result_id)
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'success': False,
                'message': 'Failed to save driver data'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Error saving driver data: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_driver_data(request):
    """Get driver data from MongoDB drivers collection"""
    try:
        driver_id = request.GET.get('driver_id')
        
        if driver_id:
            driver_data = mongodb_service.get_driver_data(driver_id)
            if driver_data:
                driver_data['_id'] = str(driver_data['_id'])
                return Response({
                    'success': True,
                    'driver_data': driver_data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'message': 'Driver not found'
                }, status=status.HTTP_404_NOT_FOUND)
        else:
            # Get all drivers
            drivers = mongodb_service.get_driver_data()
            for driver in drivers:
                driver['_id'] = str(driver['_id'])
            
            return Response({
                'success': True,
                'drivers_count': len(drivers),
                'drivers': drivers
            }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Error retrieving driver data: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
