import tkinter as tk
from gui import PageReplacementGUI  # Import GUI class from gui.py

def main():
    # Create main window
    root = tk.Tk()
    app = PageReplacementGUI(root)  # Initialize GUI
    root.mainloop()  # Start the Tkinter event loop

if __name__ == "__main__":
    main()  # Run the program
