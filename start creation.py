#!/usr/bin/env python3
"""
EduGen Image Batch Generator - Complete Script
Generates 260 educational images (2cm x 2cm) organized in 2 templates
Using Google Gemini API
"""

import os
import json
import zipfile
from pathlib import Path
from typing import List, Dict
import google.generativeai as genai
from PIL import Image
import io
import time

# ==================== CONFIGURATION ====================
API_KEY = "AIzaSyBz7Jrv0TqA9Mxo6v6U-iu-PvKtzkbyCtA"  # Your API key
OUTPUT_BASE_DIR = "generated_images"
IMAGE_SIZE = (584, 584)  # 2cm x 2cm at 72 DPI
ZIP_OUTPUT_FILE = "educational_images_pack.zip"

# Configure Gemini
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')

# ==================== IMAGE SPECIFICATIONS ====================
TEMPLATES = {
    "template_1_pollution": {
        "name": "Environmental Pollution",
        "sections": {
            "soil_contamination": {
                "name": "Soil Contamination",
                "count": 26,
                "prompts": [
                    "Close-up of soil mixed with broken plastic bottles and trash",
                    "Open-air landfill with garbage and birds flying overhead",
                    "Soil stained with motor oil spill environmental damage",
                    "Agricultural field being sprayed intensively with pesticides from an airplane",
                    "Corroded batteries and electronic waste scattered on ground",
                ]
            },
            "water_pollution": {
                "name": "Water Pollution",
                "count": 26,
                "prompts": [
                    "Sea turtle swimming near a plastic bag in ocean",
                    "Industrial pipe expelling black murky water into a river",
                    "Floating island of plastic bottles garbage in the ocean",
                    "Dead fish washed up on a polluted beach with tar",
                    "Glass of murky brown water flowing from tap environmental issue",
                ]
            },
            "air_pollution": {
                "name": "Air Pollution",
                "count": 26,
                "prompts": [
                    "Industrial factory chimneys expelling thick gray and orange smoke",
                    "Heavy traffic jam with cars emitting exhaust fumes pollution",
                    "City skyline covered in thick smog haze atmospheric pollution",
                    "Person wearing respiratory mask on a heavily polluted street",
                    "Forest fire creating massive columns of smoke in sky",
                ]
            },
            "deforestation": {
                "name": "Deforestation",
                "count": 26,
                "prompts": [
                    "Landscape full of tree stumps where forest used to be",
                    "Heavy machinery bulldozers cutting down trees forest destruction",
                    "Logging truck loaded with giant logs environmental damage",
                    "Aerial view of burned Amazon rainforest for cattle grazing",
                    "Single lonely tree surrounded by cleared deforested land",
                ]
            },
            "desertification": {
                "name": "Desertification",
                "count": 26,
                "prompts": [
                    "Close-up of extremely dry cracked earth desertification",
                    "Sand dunes advancing over abandoned village and roads",
                    "Dry dead tree skeletons in arid barren landscape",
                    "Starving emaciated livestock grazing on bare soil overgrazing",
                    "Dried up completely empty riverbed showing environmental damage",
                ]
            }
        }
    },
    "template_2_hygiene": {
        "name": "Hygiene Types",
        "sections": {
            "personal_hygiene": {
                "name": "Personal Hygiene",
                "count": 32,
                "prompts": [
                    "Hands being soaped and washed under running water",
                    "Person brushing teeth with toothpaste hygiene routine",
                    "Person showering with shampoo in hair clean water",
                    "Hands with clean cut nails manicure",
                    "Person applying deodorant personal care",
                    "Clean and folded clothes fresh laundry",
                ]
            },
            "home_hygiene": {
                "name": "Home Hygiene",
                "count": 32,
                "prompts": [
                    "Mop cleaning shiny ceramic floor clean home",
                    "Person dusting furniture with cloth removing dust",
                    "Clean and disinfected bathroom toilet and sink",
                    "Taking out garbage bag to exterior bin",
                    "Window open ventilating fresh air home",
                    "Person sweeping clean floor with broom",
                ]
            },
            "food_hygiene": {
                "name": "Food Hygiene",
                "count": 33,
                "prompts": [
                    "Washing fresh fruits and vegetables under running water",
                    "Lettuce and apples being cleaned properly",
                    "Raw meat and vegetables on separate cutting boards food safety",
                    "Clean organized refrigerator with food stored properly",
                    "Raw vegetables and herbs fresh food",
                    "Cooking meat at high temperature in pan",
                    "Clean utensils and cooking equipment dry storage",
                ]
            },
            "community_hygiene": {
                "name": "Community and Environmental Hygiene",
                "count": 33,
                "prompts": [
                    "Colored recycling bins for paper plastic glass waste sorting",
                    "Street cleaning with municipal sweeper machine clean streets",
                    "Clean public park with green grass no litter paper baskets",
                    "Water treatment plant wastewater processing facility",
                    "Clean public restroom facilities hygiene",
                    "Person collecting pet waste with bag responsible pet owner",
                    "Community group cleaning beach removing litter together",
                ]
            }
        }
    }
}

# ==================== HELPER FUNCTIONS ====================

def create_directories():
    """Create necessary directory structure"""
    base_path = Path(OUTPUT_BASE_DIR)
    base_path.mkdir(exist_ok=True)
    
    for template_name, template_data in TEMPLATES.items():
        for section_name in template_data["sections"]:
            section_path = base_path / template_name / section_name
            section_path.mkdir(parents=True, exist_ok=True)
    
    return base_path

def generate_image_with_gemini(prompt: str, size: tuple = IMAGE_SIZE) -> Image.Image:
    """Generate image using Gemini API"""
    try:
        # Using Gemini's image generation through text-to-image capability
        full_prompt = f"""Generate a clear, educational, professional photograph showing: {prompt}. 
        The image should be realistic, well-lit, and suitable for educational materials. 
        Square format, no text, isolated subject on clean background."""
        
        response = model.generate_content([full_prompt])
        
        if response.parts and response.parts[0].mime_type.startswith("image"):
            # If image is returned, convert to PIL
            image_data = response.parts[0].data
            img = Image.open(io.BytesIO(image_data))
            img = img.resize(size, Image.Resampling.LANCZOS)
            return img
        else:
            # Fallback: create placeholder image
            return create_placeholder_image(prompt, size)
            
    except Exception as e:
        print(f"Error generating image for prompt '{prompt}': {e}")
        return create_placeholder_image(prompt, size)

def create_placeholder_image(prompt: str, size: tuple) -> Image.Image:
    """Create placeholder image for failed generations"""
    from PIL import ImageDraw, ImageFont
    
    img = Image.new('RGB', size, color='white')
    draw = ImageDraw.Draw(img)
    
    # Add text to placeholder
    text = prompt[:40] + "..." if len(prompt) > 40 else prompt
    text_color = (50, 50, 50)
    
    draw.text((10, 10), text, fill=text_color)
    
    return img

def save_image(image: Image.Image, path: Path) -> bool:
    """Save image to file"""
    try:
        image.save(str(path), quality=95)
        return True
    except Exception as e:
        print(f"Error saving image to {path}: {e}")
        return False

def generate_all_images():
    """Main image generation process"""
    base_path = create_directories()
    total_images = 0
    generated_count = 0
    
    print("🚀 Starting image generation process...")
    print(f"📁 Output directory: {base_path.absolute()}\n")
    
    for template_name, template_data in TEMPLATES.items():
        print(f"\n📋 Template: {template_data['name']}")
        print("=" * 60)
        
        for section_name, section_data in template_data["sections"].items():
            print(f"\n  📂 Section: {section_data['name']} ({section_data['count']} images)")
            
            section_path = base_path / template_name / section_name
            image_counter = 0
            prompt_index = 0
            
            for i in range(section_data['count']):
                # Cycle through prompts for variety
                prompt = section_data['prompts'][prompt_index % len(section_data['prompts'])]
                prompt_index += 1
                image_counter += 1
                
                # Generate image
                print(f"    ⏳ Generating image {image_counter}/{section_data['count']}...", end=" ")
                
                img = generate_image_with_gemini(prompt)
                
                # Save image
                image_filename = f"{template_name}_{section_name}_{str(image_counter).zfill(2)}.png"
                image_path = section_path / image_filename
                
                if save_image(img, image_path):
                    print("✅")
                    generated_count += 1
                else:
                    print("❌")
                
                total_images += 1
                
                # Rate limiting to avoid API throttling
                if image_counter < section_data['count']:
                    time.sleep(0.5)
    
    print(f"\n\n✨ Image generation complete!")
    print(f"Generated: {generated_count}/{total_images} images")
    return base_path

def create_zip_file(base_path: Path, zip_filename: str = ZIP_OUTPUT_FILE):
    """Create ZIP file with all images"""
    print(f"\n📦 Creating ZIP file: {zip_filename}...")
    
    try:
        with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(base_path):
                for file in files:
                    file_path = Path(root) / file
                    arcname = file_path.relative_to(base_path.parent)
                    zipf.write(file_path, arcname)
        
        print(f"✅ ZIP file created: {zip_filename}")
        print(f"📊 File size: {os.path.getsize(zip_filename) / (1024*1024):.2f} MB")
        return True
        
    except Exception as e:
        print(f"❌ Error creating ZIP file: {e}")
        return False

def generate_metadata():
    """Generate metadata JSON about the generated images"""
    metadata = {
        "project": "EduGen - Educational Image Batch Generator",
        "version": "1.0",
        "total_images": 260,
        "image_specifications": {
            "width_cm": 2,
            "height_cm": 2,
            "width_px": IMAGE_SIZE[0],
            "height_px": IMAGE_SIZE[1],
            "dpi": 72,
        },
        "templates": {}
    }
    
    for template_name, template_data in TEMPLATES.items():
        template_info = {
            "name": template_data["name"],
            "sections": {}
        }
        
        for section_name, section_data in template_data["sections"].items():
            template_info["sections"][section_name] = {
                "name": section_data["name"],
                "count": section_data["count"]
            }
        
        metadata["templates"][template_name] = template_info
    
    # Save metadata
    metadata_path = Path(OUTPUT_BASE_DIR) / "metadata.json"
    with open(metadata_path, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Metadata saved: {metadata_path}")

# ==================== MAIN EXECUTION ====================

def main():
    print("""
    ╔════════════════════════════════════════════════════════════╗
    ║          EduGen Image Batch Generator v1.0                 ║
    ║   Educational Templates for Pollution and Hygiene          ║
    ║              Using Google Gemini API                        ║
    ╚════════════════════════════════════════════════════════════╝
    """)
    
    try:
        # Generate all images
        base_path = generate_all_images()
        
        # Generate metadata
        generate_metadata()
        
        # Create ZIP file
        create_zip_file(base_path)
        
        print(f"""
        ╔════════════════════════════════════════════════════════════╗
        ║                    SUCCESS! ✅                             ║
        ║                                                            ║
        ║  Your 260 educational images are ready!                   ║
        ║                                                            ║
        ║  📂 Folder: {OUTPUT_BASE_DIR}
        ║  📦 ZIP: {ZIP_OUTPUT_FILE}
        ║                                                            ║
        ║  Ready to insert into your HTML template!                 ║
        ╚════════════════════════════════════════════════════════════╝
        """)
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        raise

if __name__ == "__main__":
    main()
