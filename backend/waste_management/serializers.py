from rest_framework import serializers
from .models import WasteCategory, WasteItem, WasteScan, WasteCollectionSchedule

class WasteCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = WasteCategory
        fields = '__all__'

class WasteItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = WasteItem
        fields = '__all__'

class WasteScanCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WasteScan
        fields = ['category', 'item', 'quantity', 'estimated_weight_grams', 
                 'description', 'location', 'image']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class WasteScanSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    item_name = serializers.CharField(source='item.name', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    scanned_at = serializers.DateTimeField(source='created_at', read_only=True)
    
    class Meta:
        model = WasteScan
        fields = '__all__'

class WasteCollectionScheduleSerializer(serializers.ModelSerializer):
    waste_type_name = serializers.CharField(source='waste_type.name', read_only=True)
    
    class Meta:
        model = WasteCollectionSchedule
        fields = '__all__'

class UserStatsSerializer(serializers.Serializer):
    total_scans = serializers.IntegerField()
    total_points = serializers.IntegerField()
    level = serializers.CharField()
    total_weight_grams = serializers.IntegerField()
    category_breakdown = serializers.DictField()
    this_month_scans = serializers.IntegerField()
    this_month_points = serializers.IntegerField()
