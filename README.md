Efficient Page Replacement Algorithm Simulator

📌 Overview

This project is a Page Replacement Algorithm Simulator that allows users to visualize and compare different page replacement algorithms. It is built using Python and Tkinter for the GUI, making it interactive and easy to use.

Supported Algorithms:

FIFO (First-In-First-Out)

LRU (Least Recently Used)

Optimal (Belady's Algorithm)

LFU (Least Frequently Used)

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

Python 3.x

Tkinter (comes pre-installed with Python)

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
