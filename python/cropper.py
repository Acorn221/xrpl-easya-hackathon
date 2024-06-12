import tkinter as tk
import os
from tkinter import filedialog
from PIL import Image, ImageTk

LOAD_PATH = os.path.normpath("data.jpg")
SAVE_PATH = os.path.normpath(LOAD_PATH)


class ImageCropper:
    def __init__(self, master):
        self.master = master
        self.master.title("Image Cropper")

        self.image_path = None
        self.original_image = None
        self.tk_image = None
        self.display_image = None
        self.zoom_factor = 1.0

        self.canvas = tk.Canvas(master, cursor="cross", height=500, width=500)
        self.canvas.pack(fill="both", expand=False)

        self.canvas.bind("<ButtonPress-1>", self.on_button_press)
        self.canvas.bind("<B1-Motion>", self.on_mouse_drag)
        self.canvas.bind("<ButtonRelease-1>", self.on_button_release)

        self.rect = None
        self.start_x = None
        self.start_y = None

        self.crop_button = tk.Button(
            master, text="Crop / Save", command=self.crop_image
        )
        self.crop_button.pack(side="bottom", fill="x")

        self.open_button = tk.Button(
            master, text="Open Image", command=self.open_image
        )
        self.open_button.pack(side="bottom", fill="x")

        self.zoom_in_button = tk.Button(
            master, text="Zoom In", command=self.zoom_in
        )
        self.zoom_in_button.pack(side="bottom", fill="x")

        self.zoom_out_button = tk.Button(
            master, text="Zoom Out", command=self.zoom_out
        )
        self.zoom_out_button.pack(side="bottom", fill="x")

    def open_image(self):
        file_path = filedialog.askopenfilename(
            filetypes=[("Image files", "*.jpg *.jpeg *.png *.bmp")]
        )
        if file_path:
            self.image_path = file_path
            self.load_image()

    def load_image(self, img_path):
        self.image_path = img_path
        self.original_image = Image.open(self.image_path)
        self.zoom_factor = 1.0
        self.update_display_image()

    def update_display_image(self):
        width, height = self.original_image.size
        new_width = int(width * self.zoom_factor)
        new_height = int(height * self.zoom_factor)
        self.display_image = self.original_image.resize(
            (new_width, new_height)
        )
        self.tk_image = ImageTk.PhotoImage(self.display_image)
        self.canvas.create_image(0, 0, anchor="nw", image=self.tk_image)

    def zoom_in(self):
        self.zoom_factor *= 1.1
        self.update_display_image()

    def zoom_out(self):
        self.zoom_factor *= 0.9
        self.update_display_image()

    def on_button_press(self, event):
        self.start_x = event.x
        self.start_y = event.y
        self.rect = self.canvas.create_rectangle(
            self.start_x,
            self.start_y,
            self.start_x,
            self.start_y,
            outline="red",
        )

    def on_mouse_drag(self, event):
        curX, curY = (event.x, event.y)
        self.canvas.coords(self.rect, self.start_x, self.start_y, curX, curY)

    def on_button_release(self, event):
        pass

    def crop_image(self):
        if self.rect and self.image_path:
            x1, y1, x2, y2 = self.canvas.coords(self.rect)
            x1 = int(x1 / self.zoom_factor)
            y1 = int(y1 / self.zoom_factor)
            x2 = int(x2 / self.zoom_factor)
            y2 = int(y2 / self.zoom_factor)
            out_file = self.original_image.crop((x1, y1, x2, y2))
            out_file.save(self.image_path)
            out_file.close()
        self.master.destroy()


def run(img_path):
    root = tk.Tk()
    root.geometry("600x600")
    app = ImageCropper(master=root)
    app.load_image(img_path)
    root.mainloop()
