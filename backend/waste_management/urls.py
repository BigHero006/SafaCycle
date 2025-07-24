from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.WasteCategoryListView.as_view(), name='waste-categories'),
    path('items/', views.WasteItemListView.as_view(), name='waste-items'),
    path('scans/', views.UserWasteScanListView.as_view(), name='user-scans'),
    path('scans/create/', views.WasteScanCreateView.as_view(), name='create-scan'),
    path('stats/', views.user_stats, name='user-stats'),
    path('dashboard/', views.dashboard_data, name='dashboard'),
    path('collection-schedule/', views.WasteCollectionScheduleView.as_view(), name='collection-schedule'),
    path('mongodb-status/', views.mongodb_status, name='mongodb-status'),
    path('analytics/', views.user_analytics, name='user-analytics'),
    path('test-mongodb/', views.test_mongodb_save, name='test-mongodb'),
    
    # New MongoDB collection endpoints
    path('users/save-to-mongodb/', views.save_user_to_mongodb, name='save-user-mongodb'),
    path('users/get-from-mongodb/', views.get_user_from_mongodb, name='get-user-mongodb'),
    path('admin/save-action/', views.save_admin_action, name='save-admin-action'),
    path('admin/get-actions/', views.get_admin_actions, name='get-admin-actions'),
    path('drivers/save-data/', views.save_driver_data, name='save-driver-data'),
    path('drivers/get-data/', views.get_driver_data, name='get-driver-data'),
]
