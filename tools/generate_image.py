#!/usr/bin/env python3
"""
generate_image.py — Image generation tool using Hugging Face Inference Providers.

Provider:  Hugging Face Inference Providers
Model:     black-forest-labs/FLUX.1-schnell
Client:    huggingface_hub.InferenceClient

Usage:
    python tools/generate_image.py --prompt "..." --output output/images/frame_01.png
    python tools/generate_image.py --prompt "..." --output output/images/frame_01.png --aspect-ratio 16:9
    python tools/generate_image.py --prompt "..." --output output/images/frame_01.png --aspect-ratio 16:9 --image-size 2K

Environment:
    HF_TOKEN — Required. Hugging Face API token.
"""

import argparse
import os
import sys
from pathlib import Path

from huggingface_hub import InferenceClient


DEFAULT_MODEL = "black-forest-labs/FLUX.1-schnell"

SUPPORTED_ASPECT_RATIOS = {
    "1:1", "3:2", "2:3", "3:4", "4:3",
    "4:5", "5:4", "9:16", "16:9", "21:9",
}

SIZE_BASE_RESOLUTION = {
    "0.5K": 512,
    "1K": 1024,
    "2K": 2048,
    "4K": 4096,
}

SUPPORTED_IMAGE_SIZES = {"0.5K", "1K", "2K", "4K"}


def get_token() -> str:
    token = os.environ.get("HF_TOKEN")
    if not token:
        print(
            "ERROR: HF_TOKEN environment variable is not set.\n"
            "Set it with:\n"
            "  $env:HF_TOKEN = 'your-token'   (PowerShell)\n"
            "  export HF_TOKEN='your-token'    (bash)",
            file=sys.stderr,
        )
        sys.exit(1)
    return token


def calc_dimensions(aspect_ratio: str | None, image_size: str | None) -> tuple[int, int]:
    base = SIZE_BASE_RESOLUTION.get(image_size or "1K", 1024)

    if not aspect_ratio or aspect_ratio == "1:1":
        return base, base

    w_str, h_str = aspect_ratio.split(":")
    ratio_w, ratio_h = int(w_str), int(h_str)

    if ratio_w >= ratio_h:
        width = base
        height = int(base * ratio_h / ratio_w)
    else:
        height = base
        width = int(base * ratio_w / ratio_h)

    return max(width, 64), max(height, 64)


def main():
    parser = argparse.ArgumentParser(
        description="Generate image using Hugging Face Inference Providers (FLUX.1-schnell).",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--prompt",
        required=True,
        help="Text prompt for image generation.",
    )
    parser.add_argument(
        "--output",
        required=True,
        help="Output file path (e.g. output/images/frame_01.png).",
    )
    parser.add_argument(
        "--ref",
        action="append",
        default=[],
        help="(Reserved) Reference image path. Not yet supported.",
    )
    parser.add_argument(
        "--aspect-ratio",
        default=None,
        help=f"Aspect ratio (e.g. 16:9). Valid: {', '.join(sorted(SUPPORTED_ASPECT_RATIOS))}.",
    )
    parser.add_argument(
        "--image-size",
        default=None,
        help=f"Image size (e.g. 1K). Valid: {', '.join(sorted(SUPPORTED_IMAGE_SIZES))}.",
    )
    args = parser.parse_args()

    if not args.prompt.strip():
        print("ERROR: --prompt cannot be empty.", file=sys.stderr)
        sys.exit(1)

    if args.ref:
        print(
            "WARNING: --ref is not supported yet.\n"
            "  Reference images will be ignored.",
            file=sys.stderr,
        )

    token = get_token()
    width, height = calc_dimensions(args.aspect_ratio, args.image_size)

    print(f"Provider: Hugging Face Inference Providers")
    print(f"Model:    {DEFAULT_MODEL}")
    print(f"Prompt:   {args.prompt[:120]}{'...' if len(args.prompt) > 120 else ''}")
    print(f"Output:   {args.output}")
    print(f"Size:     {width}x{height}")
    if args.aspect_ratio:
        print(f"Ratio:    {args.aspect_ratio}")
    if args.image_size:
        print(f"Base:     {args.image_size} -> {SIZE_BASE_RESOLUTION[args.image_size]}px base")
    print()

    client = InferenceClient(
        provider="auto",
        api_key=token,
    )

    print(f"Generating image with {DEFAULT_MODEL} ({width}x{height})...")
    try:
        image = client.text_to_image(
            args.prompt,
            model=DEFAULT_MODEL,
            width=width,
            height=height,
        )
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(1)

    output_path = Path(args.output)
    try:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        image.save(output_path)
    except OSError as e:
        print(f"ERROR: Cannot write output file {args.output}: {e}", file=sys.stderr)
        sys.exit(1)

    size_kb = output_path.stat().st_size / 1024
    print(f"OK: Saved {size_kb:.1f} KB -> {output_path}")


if __name__ == "__main__":
    main()
