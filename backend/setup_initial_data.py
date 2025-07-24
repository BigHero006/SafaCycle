#!/usr/bin/env python3
"""
Script to create initial waste categories and items for testing
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safacycle_backend.settings')
django.setup()

from waste_management.models import WasteCategory, WasteItem

def create_initial_data():
    """Create initial waste categories and items"""
    print("🗂️ Creating initial waste categories and items...")
    
    # Create categories
    categories_data = [
        {
            'name': 'Plastic Bottles',
            'category_type': 'recyclable',
            'description': 'PET plastic bottles and containers',
            'points_per_item': 5,
            'is_active': True
        },
        {
            'name': 'Paper',
            'category_type': 'recyclable',
            'description': 'Newspapers, magazines, office paper',
            'points_per_item': 3,
            'is_active': True
        },
        {
            'name': 'Organic Waste',
            'category_type': 'organic',
            'description': 'Food waste, garden waste, biodegradable items',
            'points_per_item': 2,
            'is_active': True
        },
        {
            'name': 'Metal Cans',
            'category_type': 'recyclable',
            'description': 'Aluminum cans, tin cans',
            'points_per_item': 4,
            'is_active': True
        },
        {
            'name': 'Glass',
            'category_type': 'recyclable',
            'description': 'Glass bottles, jars',
            'points_per_item': 6,
            'is_active': True
        }
    ]
    
    created_categories = []
    for cat_data in categories_data:
        category, created = WasteCategory.objects.get_or_create(
            name=cat_data['name'],
            defaults=cat_data
        )
        if created:
            print(f"✅ Created category: {category.name}")
        else:
            print(f"📋 Category exists: {category.name}")
        created_categories.append(category)
    
    # Create items
    items_data = [
        # Plastic items
        {
            'name': '500ml Water Bottle',
            'category': created_categories[0],  # Plastic
            'description': 'Standard 500ml plastic water bottle',
            'estimated_weight_grams': 25,
            'is_recyclable': True
        },
        {
            'name': '1L Soft Drink Bottle',
            'category': created_categories[0],  # Plastic
            'description': '1 liter plastic soft drink bottle',
            'estimated_weight_grams': 45,
            'is_recyclable': True
        },
        {
            'name': 'Plastic Food Container',
            'category': created_categories[0],  # Plastic
            'description': 'Takeaway food plastic container',
            'estimated_weight_grams': 35,
            'is_recyclable': True
        },
        
        # Paper items
        {
            'name': 'Newspaper',
            'category': created_categories[1],  # Paper
            'description': 'Daily newspaper',
            'estimated_weight_grams': 50,
            'is_recyclable': True
        },
        {
            'name': 'Office Paper',
            'category': created_categories[1],  # Paper
            'description': 'A4 office paper sheets',
            'estimated_weight_grams': 5,
            'is_recyclable': True
        },
        {
            'name': 'Cardboard Box',
            'category': created_categories[1],  # Paper
            'description': 'Delivery cardboard box',
            'estimated_weight_grams': 200,
            'is_recyclable': True
        },
        
        # Organic items
        {
            'name': 'Food Scraps',
            'category': created_categories[2],  # Organic
            'description': 'Kitchen food waste and scraps',
            'estimated_weight_grams': 100,
            'is_recyclable': False
        },
        {
            'name': 'Garden Waste',
            'category': created_categories[2],  # Organic
            'description': 'Leaves, branches, garden trimmings',
            'estimated_weight_grams': 500,
            'is_recyclable': False
        },
        
        # Metal items
        {
            'name': 'Aluminum Can',
            'category': created_categories[3],  # Metal
            'description': 'Aluminum soft drink can',
            'estimated_weight_grams': 15,
            'is_recyclable': True
        },
        {
            'name': 'Tin Can',
            'category': created_categories[3],  # Metal
            'description': 'Food tin can',
            'estimated_weight_grams': 30,
            'is_recyclable': True
        },
        
        # Glass items
        {
            'name': 'Glass Bottle',
            'category': created_categories[4],  # Glass
            'description': 'Glass beverage bottle',
            'estimated_weight_grams': 200,
            'is_recyclable': True
        },
        {
            'name': 'Glass Jar',
            'category': created_categories[4],  # Glass
            'description': 'Food storage glass jar',
            'estimated_weight_grams': 150,
            'is_recyclable': True
        }
    ]
    
    for item_data in items_data:
        item, created = WasteItem.objects.get_or_create(
            name=item_data['name'],
            category=item_data['category'],
            defaults=item_data
        )
        if created:
            print(f"✅ Created item: {item.name} ({item.category.name})")
        else:
            print(f"📋 Item exists: {item.name}")
    
    print(f"\n📊 Summary:")
    print(f"   Categories: {WasteCategory.objects.count()}")
    print(f"   Items: {WasteItem.objects.count()}")
    print("\n🎉 Initial data setup complete!")
    
    return True

def create_admin_user():
    """Create an admin user for testing"""
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        admin_data = {
            'username': 'admin_user',
            'email': 'admin@safacycle.com',
            'phone_number': '+919876543299',
            'is_staff': True,
            'is_superuser': True
        }
        
        user, created = User.objects.get_or_create(
            username=admin_data['username'],
            defaults=admin_data
        )
        
        if created:
            user.set_password('SafaCycle@Admin123')
            user.save()
            print(f"✅ Created admin user: {user.username}")
            print(f"   Password: SafaCycle@Admin123")
        else:
            print(f"📋 Admin user exists: {user.username}")
            
        return user
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        return None

def main():
    """Main execution function"""
    print("🚀 SafaCycle Initial Data Setup")
    print("=" * 40)
    
    try:
        # Create initial waste categories and items
        create_initial_data()
        
        # Create admin user
        print("\n👤 Creating admin user...")
        admin_user = create_admin_user()
        
        print("\n✅ Setup complete! You can now:")
        print("1. Register regular users through API")
        print("2. Use admin_user for admin operations")
        print("3. Create waste scans with the categories and items")
        print("4. Test all MongoDB collections")
        
        print("\n📋 Next steps:")
        print("1. Start Django server: python manage.py runserver")
        print("2. Follow MONGODB_POPULATE_TESTS.md for API testing")
        print("3. Check MongoDB Atlas for data population")
        
    except Exception as e:
        print(f"❌ Error during setup: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
