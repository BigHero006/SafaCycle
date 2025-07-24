from django.urls import path
from . import views

urlpatterns = [
    path('', views.UserNotificationListView.as_view(), name='user-notifications'),
    path('<int:notification_id>/read/', views.mark_notification_read, name='mark-read'),
    path('mark-all-read/', views.mark_all_read, name='mark-all-read'),
    path('unread-count/', views.unread_count, name='unread-count'),
    path('system/', views.SystemNotificationListView.as_view(), name='system-notifications'),
]
