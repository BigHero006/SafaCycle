from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from safacycle_backend.mongodb_service import mongodb_service
import logging

logger = logging.getLogger(__name__)

class WasteCategory(models.Model):
    CATEGORY_TYPES = [
        ('recyclable', 'Recyclable'),
        ('organic', 'Organic'),
        ('hazardous', 'Hazardous'),
        ('electronic', 'Electronic'),
    ]
    
    name = models.CharField(max_length=100, unique=True)
    category_type = models.CharField(max_length=20, choices=CATEGORY_TYPES)
    description = models.TextField(blank=True)
    points_per_item = models.IntegerField(default=5)
    color_code = models.CharField(max_length=7, default='#000000')  # Hex color
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Waste Categories"

class WasteItem(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(WasteCategory, on_delete=models.CASCADE, related_name='items')
    typical_weight_grams = models.IntegerField(default=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.category.name})"
    
    class Meta:
        unique_together = ['name', 'category']

class WasteScan(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='scans')
    category = models.ForeignKey(WasteCategory, on_delete=models.CASCADE)
    item = models.ForeignKey(WasteItem, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    estimated_weight_grams = models.IntegerField(null=True, blank=True)
    points_awarded = models.IntegerField(default=0)
    bonus_points = models.IntegerField(default=0)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=200, blank=True)
    image = models.ImageField(upload_to='waste_scans/', null=True, blank=True)
    
    # ML Integration fields
    ml_prediction = models.CharField(max_length=100, blank=True)
    ml_confidence = models.FloatField(
        null=True, 
        blank=True,
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
    )
    is_verified = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.category.name} - {self.quantity} items"
    
    def save(self, *args, **kwargs):
        # Check if this is a new record
        is_new = self.pk is None
        
        # Calculate points if not already set
        if not self.points_awarded:
            base_points = self.category.points_per_item * self.quantity
            self.points_awarded = base_points
            
            # Bonus points for high ML confidence
            if self.ml_confidence and self.ml_confidence > 0.9:
                self.bonus_points = int(base_points * 0.1)
        
        # Save the record first
        super().save(*args, **kwargs)
        
        # Update user points only for new records
        if is_new:
            self.user.total_points += (self.points_awarded + self.bonus_points)
            self.user.update_level()  # This will save the user as well
            
            # Save analytics data to MongoDB for new records
            self._save_to_mongodb()
    
    def _save_to_mongodb(self):
        """Save analytics data to MongoDB"""
        try:
            analytics_data = {
                'user_id': str(self.user.id),
                'username': self.user.username,
                'scan_id': str(self.id),
                'category': self.category.name,
                'category_type': self.category.category_type,
                'item': self.item.name if self.item else None,
                'quantity': self.quantity,
                'estimated_weight_grams': self.estimated_weight_grams,
                'points_awarded': self.points_awarded,
                'bonus_points': self.bonus_points,
                'ml_prediction': self.ml_prediction,
                'ml_confidence': self.ml_confidence,
                'is_verified': self.is_verified,
                'location': self.location,
                'description': self.description,
                'timestamp': timezone.now().isoformat(),
                'created_at': self.created_at.isoformat() if self.created_at else timezone.now().isoformat(),
            }
            
            result = mongodb_service.save_scan_analytics(analytics_data)
            if result:
                logger.info(f"Analytics data saved to MongoDB for scan {self.id} with ObjectId: {result}")
            else:
                logger.warning(f"Failed to save analytics data to MongoDB for scan {self.id}")
                
        except Exception as e:
            logger.error(f"MongoDB save error for scan {self.id}: {str(e)}")
            # Don't raise the exception to avoid breaking the scan save

class WasteCollectionSchedule(models.Model):
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('bi_weekly', 'Bi-weekly'),
        ('monthly', 'Monthly'),
    ]
    
    area = models.CharField(max_length=200)
    waste_type = models.ForeignKey(WasteCategory, on_delete=models.CASCADE)
    collection_day = models.CharField(max_length=20)
    collection_time = models.TimeField()
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    driver_name = models.CharField(max_length=100, blank=True)
    driver_phone = models.CharField(max_length=15, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.area} - {self.waste_type.name} - {self.collection_day}"
