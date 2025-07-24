from django.core.management.base import BaseCommand
from waste_management.models import WasteCategory, WasteItem

class Command(BaseCommand):
    help = 'Create initial waste categories and items'

    def handle(self, *args, **options):
        # Create waste categories
        categories_data = [
            {
                'name': 'Plastic',
                'category_type': 'recyclable',
                'description': 'Plastic items that can be recycled',
                'points_per_item': 5,
                'color_code': '#FF6B6B'
            },
            {
                'name': 'Paper',
                'category_type': 'recyclable',
                'description': 'Paper and cardboard items',
                'points_per_item': 3,
                'color_code': '#4ECDC4'
            },
            {
                'name': 'Glass',
                'category_type': 'recyclable',
                'description': 'Glass bottles and containers',
                'points_per_item': 8,
                'color_code': '#45B7D1'
            },
            {
                'name': 'Organic',
                'category_type': 'organic',
                'description': 'Food waste and organic materials',
                'points_per_item': 2,
                'color_code': '#96CEB4'
            },
            {
                'name': 'Electronic',
                'category_type': 'electronic',
                'description': 'Electronic waste items',
                'points_per_item': 15,
                'color_code': '#FECA57'
            }
        ]

        # Create categories
        for cat_data in categories_data:
            category, created = WasteCategory.objects.get_or_create(
                name=cat_data['name'],
                defaults=cat_data
            )
            if created:
                self.stdout.write(f"Created category: {category.name}")

        # Create waste items
        items_data = [
            # Plastic items
            {'name': 'Plastic Bottle', 'category': 'Plastic', 'weight': 50},
            {'name': 'Plastic Bag', 'category': 'Plastic', 'weight': 10},
            {'name': 'Plastic Container', 'category': 'Plastic', 'weight': 100},
            
            # Paper items
            {'name': 'Newspaper', 'category': 'Paper', 'weight': 200},
            {'name': 'Cardboard Box', 'category': 'Paper', 'weight': 500},
            {'name': 'Office Paper', 'category': 'Paper', 'weight': 5},
            
            # Glass items
            {'name': 'Glass Bottle', 'category': 'Glass', 'weight': 300},
            {'name': 'Glass Jar', 'category': 'Glass', 'weight': 200},
            
            # Organic items
            {'name': 'Food Scraps', 'category': 'Organic', 'weight': 150},
            {'name': 'Garden Waste', 'category': 'Organic', 'weight': 1000},
            
            # Electronic items
            {'name': 'Mobile Phone', 'category': 'Electronic', 'weight': 150},
            {'name': 'Battery', 'category': 'Electronic', 'weight': 50},
            {'name': 'Computer', 'category': 'Electronic', 'weight': 5000},
        ]

        for item_data in items_data:
            try:
                category = WasteCategory.objects.get(name=item_data['category'])
                item, created = WasteItem.objects.get_or_create(
                    name=item_data['name'],
                    category=category,
                    defaults={'typical_weight_grams': item_data['weight']}
                )
                if created:
                    self.stdout.write(f"Created item: {item.name}")
            except WasteCategory.DoesNotExist:
                self.stdout.write(f"Category {item_data['category']} not found")

        self.stdout.write(self.style.SUCCESS('Successfully created initial data'))
