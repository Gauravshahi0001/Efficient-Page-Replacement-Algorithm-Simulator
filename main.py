# Import GUI class from gui.py
import tkinter as tk
from gui import PageReplacementGUI  

def main():
    # Create main window
    root = tk.Tk()
    app = PageReplacementGUI(root)  # Initialize GUI
    root.mainloop()  # Start the Tkinter event loop

# Run the program
if __name__ == "__main__":
    main()  
