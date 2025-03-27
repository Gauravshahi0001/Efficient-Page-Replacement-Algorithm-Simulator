Efficient Page Replacement Algorithm Simulator

📌 Overview

This project is a Page Replacement Algorithm Simulator that allows users to visualize and compare different page replacement algorithms. It is built using Python and Tkinter for the GUI, making it interactive and easy to use.

Supported Algorithms:

FIFO (First-In-First-Out)

-Replaces the oldest page in memory.
-Simple but may cause Belady’s Anomaly.

LRU (Least Recently Used)

-Replaces the page that hasn’t been used for the longest time.
-More efficient than FIFO.

Optimal Page Replacement

-Replaces the page that won’t be needed for the longest time.
-Provides the best performance but requires future knowledge.

LFU (Least Frequently Used)

-Replaces the page that is used the least.
-Works well for stable reference patterns.

🎯 Features

Simulates page replacement algorithms with user-defined input.

Graphical User Interface (GUI) built using Tkinter.

Real-time visualization of memory pages.

Performance metrics including page faults.

## 📂 Project Structure
```
📂 Project Structure
├── algorithms.py  # Implements page replacement algorithms
├── gui.py         # GUI interface for the simulator
└── main.py        # Entry point to run the application
```

🔧 Installation & Usage

Prerequisites:

Python Version: Python 3.x

Libraries:

tkinter (built-in, for GUI)

matplotlib (for graphical representation)

numpy (for numerical computations)

Steps to Run:
```
Clone the repository:

git clone <repository_url>
cd <repository_folder>

Run the simulator:

python main.py
```
🛠 How It Works

The user inputs a sequence of pages and the number of frames.

The simulator runs the selected page replacement algorithm.

The results show step-by-step memory state and page faults.
