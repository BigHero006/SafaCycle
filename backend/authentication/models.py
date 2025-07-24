from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    total_points = models.IntegerField(default=0)
    level = models.CharField(max_length=20, default='Beginner')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.username
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
    
    def get_level(self):
        """Calculate user level based on points"""
        if self.total_points < 100:
            return 'Beginner'
        elif self.total_points < 500:
            return 'Intermediate'
        elif self.total_points < 1000:
            return 'Advanced'
        else:
            return 'Expert'
    
    def update_level(self):
        """Update user level based on current points"""
        old_level = self.level
        new_level = self.get_level()
        
        if new_level != old_level:
            self.level = new_level
            self.save(update_fields=['level'])
            return True
        return False

class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"
