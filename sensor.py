"""
sensor.py — TruePass
Simulates the "sensor" layer at the border crossing lane.

Behavior:
1. Opens a live camera preview window so you can see what the camera sees.
2. Capture only happens when YOU press a key — the camera does NOT
   capture automatically or continuously. This protects the privacy
   of anyone in frame until a capture is explicitly requested
   (simulating "a vehicle has arrived, now capture").
3. If no camera is available (or you cancel), falls back to reading
   a sample image from the local `data/sample_images/` folder.

Controls during preview:
   - Press SPACE (or 's')  -> capture this frame
   - Press 'q'             -> cancel and use a fallback sample image

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
    Opens a live preview window and waits for the user to press a key
    to capture a single frame. Nothing is captured or saved until then.

    Returns the captured frame (BGR image) on success, or None if:
      - no camera is available, or
      - the user pressed 'q' to cancel.
    """
    cap = cv2.VideoCapture(camera_index)

    if not cap.isOpened():
        cap.release()
        return None

    captured_frame = None
    window_name = "TruePass - Press SPACE to capture, Q to cancel"

    while True:
        ret, frame = cap.read()
        if not ret or frame is None:
            break

        cv2.imshow(window_name, frame)
        key = cv2.waitKey(1) & 0xFF

        if key == ord(' ') or key == ord('s'):
            captured_frame = frame.copy()
            break
        elif key == ord('q'):
            captured_frame = None
            break

    cap.release()
    cv2.destroyAllWindows()

    return captured_frame


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

    print(f"[sensor] Using sample image: {chosen}")
    return frame


def get_frame(camera_index: int = 0):
    """
    Main entry point used by main.py.
    Shows a live preview and waits for the user to manually capture.
    Falls back to a sample image if no camera is available or the
    user cancels the capture.
    """
    frame = capture_from_webcam(camera_index)

    if frame is None:
        frame = load_sample_image()
    else:
        print("[sensor] Frame captured manually from live webcam.")

    return frame


# Quick manual test: run this file directly to check it works
if __name__ == "__main__":
    img = get_frame()
    print(f"[sensor] Frame shape: {img.shape}")
    cv2.imwrite("last_captured_frame.jpg", img)
    print("[sensor] Saved as last_captured_frame.jpg for inspection.")
