import os
import io
from typing import List, Optional, Tuple, Dict, Any
from PIL import Image


def open_image(path: str) -> Image.Image:
    """Open image file"""
    return Image.open(path)


def save_image(image: Image.Image, path: str, format: Optional[str] = None, quality: int = 95) -> str:
    """Save image to file"""
    image.save(path, format=format, quality=quality)
    return path


def resize_image(
    image: Image.Image,
    width: Optional[int] = None,
    height: Optional[int] = None,
    maintain_aspect: bool = True
) -> Image.Image:
    """Resize image"""
    if width is None and height is None:
        return image
    
    original_width, original_height = image.size
    
    if maintain_aspect:
        if width is None:
            ratio = height / original_height
            width = int(original_width * ratio)
        elif height is None:
            ratio = width / original_width
            height = int(original_height * ratio)
    
    return image.resize((width, height), Image.Resampling.LANCZOS)


def crop_image(
    image: Image.Image,
    left: int,
    top: int,
    right: int,
    bottom: int
) -> Image.Image:
    """Crop image"""
    return image.crop((left, top, right, bottom))


def rotate_image(image: Image.Image, degrees: float, expand: bool = False) -> Image.Image:
    """Rotate image"""
    return image.rotate(degrees, expand=expand)


def flip_image(image: Image.Image, horizontal: bool = False, vertical: bool = False) -> Image.Image:
    """Flip image"""
    if horizontal:
        image = image.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    if vertical:
        image = image.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
    return image


def convert_format(image: Image.Image, format: str) -> Image.Image:
    """Convert image format"""
    if format.upper() == "JPEG":
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")
    elif format.upper() == "PNG":
        if image.mode != "RGBA":
            image = image.convert("RGBA")
    return image


def get_image_info(path: str) -> Dict[str, Any]:
    """Get image information"""
    image = Image.open(path)
    
    return {
        "path": path,
        "width": image.width,
        "height": image.height,
        "format": image.format,
        "mode": image.mode,
        "size": os.path.getsize(path),
    }


def image_to_bytes(image: Image.Image, format: str = "PNG", quality: int = 95) -> bytes:
    """Convert image to bytes"""
    buffer = io.BytesIO()
    image.save(buffer, format=format, quality=quality)
    return buffer.getvalue()


def bytes_to_image(data: bytes) -> Image.Image:
    """Convert bytes to image"""
    buffer = io.BytesIO(data)
    return Image.open(buffer)


def create_thumbnail(
    image: Image.Image,
    size: Tuple[int, int],
    maintain_aspect: bool = True
) -> Image.Image:
    """Create thumbnail"""
    if maintain_aspect:
        image.thumbnail(size, Image.Resampling.LANCZOS)
        return image.copy()
    else:
        return image.resize(size, Image.Resampling.LANCZOS)


def add_watermark(
    image: Image.Image,
    watermark: Image.Image,
    position: Tuple[int, int],
    opacity: float = 0.5
) -> Image.Image:
    """Add watermark to image"""
    if image.mode != "RGBA":
        image = image.convert("RGBA")
    
    if watermark.mode != "RGBA":
        watermark = watermark.convert("RGBA")
    
    watermark_with_opacity = Image.new("RGBA", watermark.size)
    for x in range(watermark.width):
        for y in range(watermark.height):
            r, g, b, a = watermark.getpixel((x, y))
            watermark_with_opacity.putpixel((x, y), (r, g, b, int(a * opacity)))
    
    image.paste(watermark_with_opacity, position, watermark_with_opacity)
    return image


def convert_to_grayscale(image: Image.Image) -> Image.Image:
    """Convert image to grayscale"""
    return image.convert("L")


def adjust_brightness(image: Image.Image, factor: float) -> Image.Image:
    """Adjust image brightness"""
    from PIL import ImageEnhance
    enhancer = ImageEnhance.Brightness(image)
    return enhancer.enhance(factor)


def adjust_contrast(image: Image.Image, factor: float) -> Image.Image:
    """Adjust image contrast"""
    from PIL import ImageEnhance
    enhancer = ImageEnhance.Contrast(image)
    return enhancer.enhance(factor)


def adjust_saturation(image: Image.Image, factor: float) -> Image.Image:
    """Adjust image saturation"""
    from PIL import ImageEnhance
    enhancer = ImageEnhance.Color(image)
    return enhancer.enhance(factor)


def apply_blur(image: Image.Image, radius: int) -> Image.Image:
    """Apply blur to image"""
    from PIL import ImageFilter
    return image.filter(ImageFilter.GaussianBlur(radius))


def apply_sharpen(image: Image.Image) -> Image.Image:
    """Apply sharpen to image"""
    from PIL import ImageFilter
    return image.filter(ImageFilter.SHARPEN)


def get_dominant_color(image: Image.Image) -> Tuple[int, int, int]:
    """Get dominant color in image"""
    image = image.convert("RGB")
    image = image.resize((100, 100))
    
    colors = image.getcolors(10000)
    if not colors:
        return (128, 128, 128)
    
    dominant = max(colors, key=lambda x: x[0])
    return dominant[1]


def is_image_file(path: str) -> bool:
    """Check if file is an image"""
    try:
        Image.open(path)
        return True
    except:
        return False


def get_supported_formats() -> List[str]:
    """Get supported image formats"""
    return ["PNG", "JPEG", "JPG", "GIF", "BMP", "TIFF", "WEBP", "ICO"]
