import tkinter as tk
from tkinter import messagebox, ttk
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from mpl_toolkits.mplot3d import Axes3D
from algorithms import fifo_page_replacement, lru_page_replacement, optimal_page_replacement, lfu_page_replacement
import numpy as np


class PageReplacementGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("📄 Page Replacement Simulator")
        self.root.geometry("900x700")
        self.root.configure(bg="#121212")  # Dark Modern Theme

        self.create_widgets()

    def create_widgets(self):
        # Title
        self.title_label = tk.Label(self.root, text="Page Replacement Simulator", font=("Arial", 22, "bold"),
                                    fg="white", bg="#121212")
        self.title_label.pack(pady=15)

        # Inputs
        self.create_label("Enter Page Reference String (comma separated):")
        self.page_input = self.create_entry("7, 0, 1, 2, 0, 3, 4, 2, 3, 0, 4, 2")

        self.create_label("Enter Number of Frames:")
        self.frame_input = self.create_entry("3")

        self.create_label("Select Algorithm:")
        self.algorithm_var = tk.StringVar()
        self.algorithm_var.set("FIFO")
        self.dropdown = ttk.Combobox(self.root, textvariable=self.algorithm_var,
                                     values=["FIFO", "LRU", "Optimal", "LFU"], font=("Arial", 12))
        self.dropdown.pack(pady=5)

        # Buttons
        self.run_button = tk.Button(self.root, text="▶ Run Simulation", command=self.run_simulation,
                                    font=("Arial", 14, "bold"),
                                    bg="#50fa7b", fg="black", padx=10, pady=5)
        self.run_button.pack(pady=10)

        self.graph_button = tk.Button(self.root, text="📊 Show Graph", command=self.plot_graph,
                                      font=("Arial", 12, "bold"),
                                      bg="#ff79c6", fg="white", padx=10, pady=5)
        self.graph_button.pack(pady=10)

        # Result Display
        self.result_label = tk.Label(self.root, text="", font=("Arial", 16, "bold"), fg="#f1fa8c", bg="#121212")
        self.result_label.pack()

        # Canvas for Visualization
        self.canvas = tk.Canvas(self.root, width=800, height=350, bg="#1e1e2e")
        self.canvas.pack()

    def create_label(self, text):
        tk.Label(self.root, text=text, font=("Arial", 12), fg="white", bg="#121212").pack()

    def create_entry(self, default_text):
        entry = tk.Entry(self.root, width=50, font=("Arial", 12), relief="flat", bg="#282a36", fg="white")
        entry.insert(0, default_text)
        entry.pack(pady=5)
        return entry

    def run_simulation(self):
        try:
            pages = list(map(int, self.page_input.get().split(",")))
            frames = int(self.frame_input.get())
            if frames <= 0:
                raise ValueError("Frames must be greater than 0!")
        except ValueError as e:
            messagebox.showerror("Input Error", f"🚨 {e}")
            return

        algorithm = self.algorithm_var.get()
        page_faults, memory_steps = [], []

        if algorithm == "FIFO":
            page_faults, memory_steps = fifo_page_replacement(pages, frames)
        elif algorithm == "LRU":
            page_faults, memory_steps = lru_page_replacement(pages, frames)
        elif algorithm == "Optimal":
            page_faults, memory_steps = optimal_page_replacement(pages, frames)
        elif algorithm == "LFU":
            page_faults, memory_steps = lfu_page_replacement(pages, frames)

        self.result_label.config(text=f"🔥 Total Page Faults: {page_faults}", fg="#ff5555")
        self.visualize_memory_frames(memory_steps)

    def visualize_memory_frames(self, memory_steps):
        self.canvas.delete("all")
        x_offset, y_offset = 50, 30

        for i, (page, memory) in enumerate(memory_steps):
            color = "#ff5555" if page not in memory else "#50fa7b"
            self.canvas.create_text(x_offset + i * 50, y_offset, text=str(page), fill=color, font=("Arial", 14, "bold"))

            for j, frame in enumerate(memory):
                self.canvas.create_rectangle(x_offset + i * 50, y_offset + (j + 1) * 30, x_offset + i * 50 + 40,
                                             y_offset + (j + 2) * 30, fill="#8be9fd")
                self.canvas.create_text(x_offset + i * 50 + 20, y_offset + (j + 1) * 30 + 15, text=str(frame),
                                        fill="black", font=("Arial", 12, "bold"))

    def plot_graph(self):
        algorithms = ["FIFO", "LRU", "Optimal", "LFU"]
        faults = [10, 8, 6, 9]

        fig = plt.figure()
        ax = fig.add_subplot(111, projection='3d')
        xpos = np.arange(len(algorithms))
        ypos = np.zeros(len(algorithms))
        zpos = np.zeros(len(algorithms))

        dx = dy = np.ones(len(algorithms)) * 0.5
        dz = faults

        ax.bar3d(xpos, ypos, zpos, dx, dy, dz, color=['blue', 'green', 'red', 'purple'])
        ax.set_xticks(xpos)
        ax.set_xticklabels(algorithms)
        ax.set_xlabel("Algorithms")
        ax.set_ylabel("")
        ax.set_zlabel("Page Faults")
        ax.set_title("3D Page Faults Visualization")
        plt.show()


if __name__ == "__main__":
    root = tk.Tk()
    app = PageReplacementGUI(root)
    root.mainloop()
