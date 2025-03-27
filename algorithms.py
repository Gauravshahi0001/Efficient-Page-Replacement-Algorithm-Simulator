from collections import deque, Counter

# FIFO (First-In-First-Out) Page Replacement Algorithm
def fifo_page_replacement(pages, frames):
    memory = deque()
    page_faults = 0
    memory_steps = []

    for page in pages:
        if page not in memory:
            page_faults += 1
            if len(memory) == frames:
                memory.popleft()  # Remove the oldest page
            memory.append(page)
        memory_steps.append((page, list(memory)))  # Store step for visualization

    return page_faults, memory_steps

# LRU (Least Recently Used) Page Replacement Algorithm
def lru_page_replacement(pages, frames):
    memory = []
    page_faults = 0
    memory_steps = []

    for page in pages:
        if page in memory:
            memory.remove(page)  # Move the page to the most recently used position
        else:
            page_faults += 1
            if len(memory) == frames:
                memory.pop(0)  # Remove least recently used page
        memory.append(page)
        memory_steps.append((page, list(memory)))

    return page_faults, memory_steps

#  Optimal Page Replacement Algorithm
def optimal_page_replacement(pages, frames):
    memory = []
    page_faults = 0
    memory_steps = []

    for i, page in enumerate(pages):
        if page not in memory:
            page_faults += 1
            if len(memory) == frames:
                future_pages = pages[i+1:]
                replace_page = max(memory, key=lambda p: future_pages.index(p) if p in future_pages else float('inf'))
                memory.remove(replace_page)
            memory.append(page)
        memory_steps.append((page, list(memory)))

    return page_faults, memory_steps

# LFU (Least Frequently Used) Page Replacement Algorithm
def lfu_page_replacement(pages, frames):
    memory = []
    frequency = Counter()
    page_faults = 0
    memory_steps = []

    for page in pages:
        if page not in memory:
            page_faults += 1
            if len(memory) == frames:
                least_frequent = min(memory, key=lambda p: frequency[p])
                memory.remove(least_frequent)
            memory.append(page)
        frequency[page] += 1
        memory_steps.append((page, list(memory)))

    return page_faults, memory_steps
