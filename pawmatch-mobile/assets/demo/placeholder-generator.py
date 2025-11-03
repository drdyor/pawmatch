#!/usr/bin/env python3
"""
Demo Image Placeholder Generator for PawMatch
Creates simple colored rectangles with breed names for testing
"""

import os
import random

def create_placeholder_image(breed_name, filename):
    """Create a simple HTML placeholder for a dog breed"""
    colors = ['#FFD700', '#FF6B35', '#F7931E', '#8B4513', '#DC143C', '#4169E1', '#32CD32', '#9370DB', '#FF69B4', '#00CED1']

    # Random color for each breed
    color = random.choice(colors)

    html_content = f"""<!DOCTYPE html>
<html>
<head>
    <title>{breed_name} Placeholder</title>
    <style>
        body {{
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 800px;
            height: 600px;
            background-color: {color};
            font-family: Arial, sans-serif;
            color: white;
            text-align: center;
        }}
        .content {{
            padding: 20px;
        }}
        h1 {{
            font-size: 48px;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }}
        p {{
            font-size: 24px;
            opacity: 0.9;
        }}
    </style>
</head>
<body>
    <div class="content">
        <h1>{breed_name}</h1>
        <p>Placeholder Image</p>
        <p>PawMatch Demo</p>
    </div>
</body>
</html>"""

    with open(filename.replace('.jpg', '.html'), 'w') as f:
        f.write(html_content)

    print(f"Created placeholder for {breed_name}")

def main():
    # List of all breeds we need placeholders for
    breeds_images = [
        ('golden-retriever', ['Luna', 'Max', 'Sunny', 'Rex']),
        ('maltese', ['Bella', 'Charlie', 'Coco', 'Prince']),
        ('poodle', ['Princess', 'Dior', 'Chanel']),
        ('labrador', ['Buddy', 'Daisy', 'Max', 'Lucy']),
        ('german-shepherd', ['Zeus', 'Athena', 'Bruno', 'Luna']),
        ('french-bulldog', ['Pierre', 'Coco', 'Rex']),
        ('yorkshire-terrier', ['Teddy', 'Bella', 'Max']),
        ('mixed-breed', ['Rocky', 'Duke']),
        ('cat', ['Mia'])
    ]

    os.makedirs('assets/demo', exist_ok=True)

    for breed, dogs in breeds_images:
        for i, dog in enumerate(dogs, 1):
            filename = f'assets/demo/{breed}-{i}.html'
            create_placeholder_image(f'{breed.replace("-", " ").title()} - {dog}', filename)

    print("\nAll placeholder images created!")
    print("Note: These are HTML files. Replace with actual JPG images when available.")

if __name__ == '__main__':
    main()
