"""
PDF Master Editor - Icon Generator
Generates app icons using Pillow (PIL)
Run: python generate_icons.py
"""

import os
import math

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Installing Pillow...")
    os.system("pip install Pillow")
    from PIL import Image, ImageDraw, ImageFont


def draw_rounded_rect(draw, xy, radius, fill):
    """Draw a rounded rectangle."""
    x1, y1, x2, y2 = xy
    draw.rectangle([x1 + radius, y1, x2 - radius, y2], fill=fill)
    draw.rectangle([x1, y1 + radius, x2, y2 - radius], fill=fill)
    draw.ellipse([x1, y1, x1 + radius * 2, y1 + radius * 2], fill=fill)
    draw.ellipse([x2 - radius * 2, y1, x2, y1 + radius * 2], fill=fill)
    draw.ellipse([x1, y2 - radius * 2, x1 + radius * 2, y2], fill=fill)
    draw.ellipse([x2 - radius * 2, y2 - radius * 2, x2, y2], fill=fill)


def generate_icon(size):
    """Generate a PDF Master icon at the given size."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background - deep navy with slight gradient effect
    bg_color = (15, 15, 26)       # #0F0F1A
    accent_color = (99, 102, 241)  # #6366F1 indigo
    accent2_color = (139, 92, 246) # #8B5CF6 violet
    white = (255, 255, 255)
    light_indigo = (165, 180, 252) # #A5B4FC

    # Outer rounded rect (background)
    margin = int(size * 0.04)
    radius = int(size * 0.18)
    draw_rounded_rect(draw, (margin, margin, size - margin, size - margin), radius, bg_color)

    # Decorative accent strip (top)
    strip_h = int(size * 0.04)
    strip_y = margin + int(size * 0.12)
    draw_rounded_rect(draw, (margin + int(size * 0.08), strip_y, size - margin - int(size * 0.08), strip_y + strip_h), strip_h // 2, accent_color)

    # PDF icon shape (document with folded corner)
    doc_w = int(size * 0.44)
    doc_h = int(size * 0.54)
    doc_x = int(size * 0.14)
    doc_y = int(size * 0.24)
    fold = int(size * 0.12)

    # Document body
    doc_points = [
        (doc_x, doc_y),
        (doc_x + doc_w - fold, doc_y),
        (doc_x + doc_w, doc_y + fold),
        (doc_x + doc_w, doc_y + doc_h),
        (doc_x, doc_y + doc_h),
    ]
    draw.polygon(doc_points, fill=(25, 25, 50))
    draw.line(doc_points + [doc_points[0]], fill=accent_color, width=max(2, int(size * 0.008)))

    # Folded corner triangle
    fold_pts = [
        (doc_x + doc_w - fold, doc_y),
        (doc_x + doc_w, doc_y + fold),
        (doc_x + doc_w - fold, doc_y + fold),
    ]
    draw.polygon(fold_pts, fill=accent2_color)

    # Lines on document (content representation)
    line_x1 = doc_x + int(size * 0.05)
    line_x2 = doc_x + doc_w - int(size * 0.07)
    line_color = (60, 60, 100)
    for i in range(5):
        ly = doc_y + int(size * 0.14) + i * int(size * 0.07)
        if i == 0:
            lw = max(2, int(size * 0.006))
            draw.line([(line_x1, ly), (line_x2 - int(size * 0.08), ly)], fill=light_indigo, width=lw)
        else:
            lw = max(1, int(size * 0.004))
            x2 = line_x2 if i % 2 == 0 else line_x2 - int(size * 0.1)
            draw.line([(line_x1, ly), (x2, ly)], fill=line_color, width=lw)

    # "PDF" text on right side
    right_x = int(size * 0.64)
    center_y = int(size * 0.42)

    # Try to use a bold font, fall back to default
    try:
        font_large = ImageFont.truetype("arial.ttf", int(size * 0.14))
        font_small = ImageFont.truetype("arial.ttf", int(size * 0.07))
        font_tiny = ImageFont.truetype("arial.ttf", int(size * 0.055))
    except Exception:
        try:
            font_large = ImageFont.truetype("DejaVuSans-Bold.ttf", int(size * 0.14))
            font_small = ImageFont.truetype("DejaVuSans.ttf", int(size * 0.07))
            font_tiny = ImageFont.truetype("DejaVuSans.ttf", int(size * 0.055))
        except Exception:
            font_large = ImageFont.load_default()
            font_small = font_large
            font_tiny = font_large

    # "PDF" label
    draw.text((right_x, center_y - int(size * 0.12)), "PDF", fill=accent_color, font=font_large, anchor="mm" if hasattr(font_large, 'getbbox') else None)
    draw.text((right_x, center_y + int(size * 0.07)), "MASTER", fill=white, font=font_small, anchor="mm" if hasattr(font_small, 'getbbox') else None)

    # Bottom accent bar
    bar_y = int(size * 0.84)
    bar_h = int(size * 0.045)
    bar_x1 = margin + int(size * 0.08)
    bar_x2 = size - margin - int(size * 0.08)
    bar_w = bar_x2 - bar_x1
    # Gradient simulation: two rectangles
    draw_rounded_rect(draw, (bar_x1, bar_y, bar_x1 + bar_w // 2, bar_y + bar_h), bar_h // 2, accent_color)
    draw_rounded_rect(draw, (bar_x1 + bar_w // 2, bar_y, bar_x2, bar_y + bar_h), bar_h // 2, accent2_color)

    # Version dot
    dot_r = int(size * 0.025)
    dot_x = size - margin - int(size * 0.07)
    dot_y = margin + int(size * 0.07)
    draw.ellipse([dot_x - dot_r, dot_y - dot_r, dot_x + dot_r, dot_y + dot_r], fill=accent2_color)

    return img


def main():
    output_dir = os.path.join(os.path.dirname(__file__), "frontend", "public")
    android_dir = os.path.join(os.path.dirname(__file__), "android", "assets")
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(android_dir, exist_ok=True)

    sizes = {
        "icon-512.png": 512,
        "icon-192.png": 192,
        "favicon.png": 32,
    }

    for filename, size in sizes.items():
        print(f"Generating {filename} ({size}x{size})...")
        icon = generate_icon(size)
        # Save as PNG with RGBA
        out_path = os.path.join(output_dir, filename)
        icon.save(out_path, "PNG")
        print(f"  Saved: {out_path}")

    # Also save copies for Android
    icon512 = generate_icon(512)
    icon512.save(os.path.join(android_dir, "icon.png"), "PNG")

    # Splash: landscape 1280x720 with centered icon
    print("Generating Android splash screen (1280x720)...")
    splash = Image.new("RGBA", (1280, 720), (15, 15, 26, 255))
    icon_on_splash = generate_icon(256)
    offset_x = (1280 - 256) // 2
    offset_y = (720 - 256) // 2
    splash.paste(icon_on_splash, (offset_x, offset_y), icon_on_splash)

    draw = ImageDraw.Draw(splash)
    try:
        font = ImageFont.truetype("arial.ttf", 42)
        font_sub = ImageFont.truetype("arial.ttf", 24)
    except Exception:
        try:
            font = ImageFont.truetype("DejaVuSans-Bold.ttf", 42)
            font_sub = ImageFont.truetype("DejaVuSans.ttf", 24)
        except Exception:
            font = ImageFont.load_default()
            font_sub = font

    draw.text((640, offset_y + 270), "PDF Master Editor", fill=(255, 255, 255), font=font, anchor="mm" if hasattr(font, 'getbbox') else None)
    draw.text((640, offset_y + 310), "Full-Featured PDF Editing Suite", fill=(99, 102, 241), font=font_sub, anchor="mm" if hasattr(font_sub, 'getbbox') else None)

    splash.save(os.path.join(android_dir, "splash.png"), "PNG")
    print(f"  Saved: {os.path.join(android_dir, 'splash.png')}")

    print("\nAll icons generated successfully!")
    print(f"  Web icons: {output_dir}")
    print(f"  Android assets: {android_dir}")


if __name__ == "__main__":
    main()
