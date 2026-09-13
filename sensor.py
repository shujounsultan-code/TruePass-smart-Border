"""
sensor.py — TruePass
Simulates the "sensor" layer at the border crossing lane.

Behavior:
1. Tries to capture a live frame from the laptop webcam using OpenCV.
2. If no camera is available (or capture fails), falls back to reading
   a sample image from the local `data/sample_images/` folder — this
   simulates a vehicle/passenger arriving at the checkpoint.

The output of this module is always a single image (as a NumPy array)
that gets passed forward to detection.py.
"""

import os
import cv2
import random

# Folder with fallback sample images (put a few .jpg/.png here)
SAMPLE_IMAGES_DIR = os.path.join(os.path.dirname(__file__), "data", "sample_images")


def capture_from_webcam(camera_index: int = 0):
    """
    Try to grab a single frame from a connected webcam.
    Returns the frame (BGR image) on success, or None if no camera
    is available / the capture failed.
    """
    cap = cv2.VideoCapture(camera_index)

    if not cap.isOpened():
        cap.release()
        return None

    ret, frame = cap.read()
    cap.release()

    if not ret or frame is None:
        return None

    return frame


def load_sample_image():
    """
    Fallback: pick a random image from the sample_images folder
    to simulate a vehicle arriving at the checkpoint.
    """
    if not os.path.isdir(SAMPLE_IMAGES_DIR):
        raise FileNotFoundError(
            f"Sample images folder not found: {SAMPLE_IMAGES_DIR}\n"
            "Create it and add a few .jpg/.png files to simulate arrivals."
        )

    images = [
        f for f in os.listdir(SAMPLE_IMAGES_DIR)
        if f.lower().endswith((".jpg", ".jpeg", ".png"))
    ]

    if not images:
        raise FileNotFoundError(
            f"No images found in {SAMPLE_IMAGES_DIR}. Add sample photos first."
        )

    chosen = random.choice(images)
    path = os.path.join(SAMPLE_IMAGES_DIR, chosen)
    frame = cv2.imread(path)

    print(f"[sensor] No camera detected — using sample image: {chosen}")
    return frame


def get_frame(camera_index: int = 0):
    """
    Main entry point used by main.py.
    Tries the webcam first; falls back to a sample image automatically.
    """
    frame = capture_from_webcam(camera_index)

    if frame is None:
        frame = load_sample_image()
    else:
        print("[sensor] Frame captured from live webcam.")

    return frame


# Quick manual test: run this file directly to check it works
if __name__ == "__main__":
    img = get_frame()
    print(f"[sensor] Frame shape: {img.shape}")
    cv2.imwrite("last_captured_frame.jpg", img)
    print("[sensor] Saved as last_captured_frame.jpg for inspection.")
