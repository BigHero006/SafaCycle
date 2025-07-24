from django.contrib import admin
from .models import WasteCategory, WasteItem, WasteScan, WasteCollectionSchedule

@admin.register(WasteCategory)
class WasteCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'category_type', 'points_per_item', 'created_at')
    list_filter = ('category_type', 'created_at')
    search_fields = ('name', 'description')

@admin.register(WasteItem)
class WasteItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'typical_weight_grams', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('name', 'description')

@admin.register(WasteScan)
class WasteScanAdmin(admin.ModelAdmin):
    list_display = ('user', 'category', 'item', 'quantity', 'points_awarded', 'is_verified', 'created_at')
    list_filter = ('category', 'is_verified', 'created_at')
    search_fields = ('user__username', 'description')
    readonly_fields = ('points_awarded', 'bonus_points', 'created_at')

@admin.register(WasteCollectionSchedule)
class WasteCollectionScheduleAdmin(admin.ModelAdmin):
    list_display = ('area', 'waste_type', 'collection_day', 'collection_time', 'frequency', 'is_active')
    list_filter = ('waste_type', 'frequency', 'is_active')
    search_fields = ('area', 'driver_name')
