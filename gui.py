import tkinter as tk
from tkinter import messagebox, ttk
import matplotlib.pyplot as plt
from algorithms import fifo_page_replacement, lru_page_replacement, optimal_page_replacement, lfu_page_replacement

class PageReplacementGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("📄 Page Replacement Simulator")
        self.root.geometry("700x650")
        self.root.configure(bg="#1e1e2e")  # Dark Theme Background

        # 🌙 Dark Mode / Light Mode Toggle
        self.is_dark_mode = True
        self.toggle_button = tk.Button(root, text="🌙 Dark Mode", command=self.toggle_mode, font=("Arial", 12, "bold"), 
                                       bg="#44475a", fg="white", activebackground="#bd93f9", relief="raised", padx=10, pady=5)
        self.toggle_button.pack(pady=5)

        # 🏷 Title Label (Glassmorphism Effect)
        self.title_label = tk.Label(root, text="Page Replacement Simulator", font=("Arial", 20, "bold"), 
                                    fg="white", bg="#1e1e2e", padx=10, pady=5)
        self.title_label.pack(pady=10)

        # 📥 Page Reference Input
        self.create_label("Enter Page Reference String (comma separated):")
        self.page_input = self.create_entry("7, 0, 1, 2, 0, 3, 4, 2, 3, 0, 4, 2")

        # 🔢 Number of Frames Input
        self.create_label("Enter Number of Frames:")
        self.frame_input = self.create_entry("3")

        # 🔄 Algorithm Selection Dropdown
        self.create_label("Select Algorithm:")
        self.algorithm_var = tk.StringVar()
        self.algorithm_var.set("FIFO")  # Default selection
        self.dropdown = ttk.Combobox(root, textvariable=self.algorithm_var, values=["FIFO", "LRU", "Optimal", "LFU"], font=("Arial", 12))
        self.dropdown.pack(pady=5)

        # 🏁 Run Simulation Button (Hover Effect)
        self.run_button = tk.Button(root, text="▶ Run Simulation", command=self.run_simulation, font=("Arial", 14, "bold"),
                                    bg="#50fa7b", fg="black", activebackground="#3ae374", relief="raised", padx=10, pady=5)
        self.run_button.pack(pady=10)

        # 📊 Result Display
        self.result_label = tk.Label(root, text="", font=("Arial", 14, "bold"), fg="white", bg="#1e1e2e")
        self.result_label.pack()

        # 📉 Graph Button
        self.graph_button = tk.Button(root, text="📊 Show Graph", command=self.plot_graph, font=("Arial", 12, "bold"),
                                      bg="#ff79c6", fg="white", activebackground="#ff5555", relief="raised", padx=10, pady=5)
        self.graph_button.pack(pady=10)

        # 🖥 Scrollable Output Area (Glass Effect)
        frame = tk.Frame(root, bg="#282a36")
        frame.pack(pady=10)
        self.canvas = tk.Canvas(frame, width=600, height=300, bg="#282a36")
        scrollbar = tk.Scrollbar(frame, orient="vertical", command=self.canvas.yview)
        self.scrollable_frame = tk.Frame(self.canvas, bg="#282a36")

        self.scrollable_frame.bind(
            "<Configure>",
            lambda e: self.canvas.configure(
                scrollregion=self.canvas.bbox("all")
            )
        )

        self.canvas.create_window((0, 0), window=self.scrollable_frame, anchor="nw")
        self.canvas.configure(yscrollcommand=scrollbar.set)
        self.canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")

    # 🌙 Toggle Dark & Light Mode
    def toggle_mode(self):
        if self.is_dark_mode:
            self.root.configure(bg="white")
            self.title_label.configure(fg="black", bg="white")
            self.result_label.configure(fg="black", bg="white")
            self.toggle_button.configure(text="☀ Light Mode", bg="#f8f9fa", fg="black")
        else:
            self.root.configure(bg="#1e1e2e")
            self.title_label.configure(fg="white", bg="#1e1e2e")
            self.result_label.configure(fg="white", bg="#1e1e2e")
            self.toggle_button.configure(text="🌙 Dark Mode", bg="#44475a", fg="white")
        self.is_dark_mode = not self.is_dark_mode

    # 📥 Create Labels (Reusable)
    def create_label(self, text):
        tk.Label(self.root, text=text, font=("Arial", 12), fg="white", bg="#1e1e2e").pack()

    # ✏ Create Rounded Input Fields
    def create_entry(self, default_text):
        entry = tk.Entry(self.root, width=50, font=("Arial", 12), relief="flat", bg="#282a36", fg="white")
        entry.insert(0, default_text)
        entry.pack(pady=5)
        return entry

    # ▶ Run Simulation
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
        page_faults = 0
        memory_steps = []

        if algorithm == "FIFO":
            page_faults, memory_steps = fifo_page_replacement(pages, frames)
        elif algorithm == "LRU":
            page_faults, memory_steps = lru_page_replacement(pages, frames)
        elif algorithm == "Optimal":
            page_faults, memory_steps = optimal_page_replacement(pages, frames)
        elif algorithm == "LFU":
            page_faults, memory_steps = lfu_page_replacement(pages, frames)

        for widget in self.scrollable_frame.winfo_children():
            widget.destroy()

        tk.Label(self.scrollable_frame, text="Step  |  Page  |  Memory Frames", font=("Arial", 12, "bold"), bg="#282a36", fg="white").pack()
        tk.Label(self.scrollable_frame, text="--------------------------------", font=("Arial", 12), bg="#282a36", fg="white").pack()

        for step, (page, memory_snapshot) in enumerate(memory_steps):
            color = "red" if page not in memory_snapshot else "green"
            tk.Label(self.scrollable_frame, text=f"{step+1:^5} | {page:^5} | {str(memory_snapshot)}", font=("Arial", 12), fg=color, bg="#282a36").pack()

        self.result_label.config(text=f"🔥 Total Page Faults: {page_faults}", fg="red")

    # 📊 Plot Graph
    def plot_graph(self):
        page_faults = [("FIFO", 10), ("LRU", 8), ("Optimal", 6), ("LFU", 9)]
        names, values = zip(*page_faults)

        plt.figure(figsize=(6, 4))
        plt.bar(names, values, color=["blue", "green", "red", "purple"])
        plt.title("Page Faults by Algorithm")
        plt.xlabel("Algorithm")
        plt.ylabel("Page Faults")
        plt.show()

if __name__ == "__main__":
    root = tk.Tk()
    app = PageReplacementGUI(root)
    root.mainloop()
