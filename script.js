
const pageReferenceInput = document.getElementById('page-reference');
const frameCountInput = document.getElementById('frame-count');
const runSimulationBtn = document.getElementById('run-simulation');

const prevStepBtn = document.getElementById('prev-step');
const playPauseBtn = document.getElementById('play-pause');
const nextStepBtn = document.getElementById('next-step');
const animationSpeedInput = document.getElementById('animation-speed');
const currentStepDisplay = document.getElementById('current-step');
const totalStepsDisplay = document.getElementById('total-steps');


const fifoDisplay = document.getElementById('fifo-display');
const lruDisplay = document.getElementById('lru-display');
const optimalDisplay = document.getElementById('optimal-display');
const lfuDisplay = document.getElementById('lfu-display');


const fifoExplanation = document.getElementById('fifo-explanation-content');
const lruExplanation = document.getElementById('lru-explanation-content');
const optimalExplanation = document.getElementById('optimal-explanation-content');
const lfuExplanation = document.getElementById('lfu-explanation-content');


const fifoFaults = document.getElementById('fifo-faults');
const lruFaults = document.getElementById('lru-faults');
const optimalFaults = document.getElementById('optimal-faults');
const lfuFaults = document.getElementById('lfu-faults');

let comparisonChart = null;

let animationState = {
    currentStep: 0,
    totalSteps: 0,
    isPlaying: false,
    animationSpeed: 5,
    animationInterval: null,
    results: {
        fifo: null,
        lru: null,
        optimal: null,
        lfu: null
    }
};


document.addEventListener('DOMContentLoaded', function() {
    runSimulationBtn.addEventListener('click', runSimulation);
    prevStepBtn.addEventListener('click', goToPreviousStep);
    playPauseBtn.addEventListener('click', togglePlayPause);
    nextStepBtn.addEventListener('click', goToNextStep);
    animationSpeedInput.addEventListener('input', updateAnimationSpeed);
    
    
    pageReferenceInput.value = '7, 0, 1, 2, 0, 3, 4, 2, 3, 0, 4, 2';
    frameCountInput.value = 3;
    
    
    runSimulation();
});


function runSimulation() {
    
    const pageReferenceString = pageReferenceInput.value
        .split(',')
        .map(page => page.trim())
        .filter(page => page !== '')
        .map(page => parseInt(page));
    
    const frameCount = parseInt(frameCountInput.value);
    
    
    if (pageReferenceString.some(isNaN) || isNaN(frameCount) || frameCount <= 0) {
        alert('Please enter valid inputs. Page references should be numbers separated by commas, and frame count should be a positive integer.');
        return;
    }
    
    
    stopAnimation();
    
    
    const fifoResult = simulateFIFO(pageReferenceString, frameCount);
    const lruResult = simulateLRU(pageReferenceString, frameCount);
    const optimalResult = simulateOptimal(pageReferenceString, frameCount);
    const lfuResult = simulateLFU(pageReferenceString, frameCount);
    
    
    animationState.results = {
        fifo: fifoResult,
        lru: lruResult,
        optimal: optimalResult,
        lfu: lfuResult
    };
    
    
    animationState.currentStep = 0;
    animationState.totalSteps = pageReferenceString.length;
    animationState.isPlaying = false;
    
    
    updateStepDisplay();
    updateAnimationControls();
    

    displayAnimationStep(0);
    
    
    updateChart([
        fifoResult.faults,
        lruResult.faults,
        optimalResult.faults,
        lfuResult.faults
    ]);
}

function goToPreviousStep() {
    if (animationState.currentStep > 0) {
        animationState.currentStep--;
        displayAnimationStep(animationState.currentStep);
        updateStepDisplay();
        updateAnimationControls();
    }
}

function goToNextStep() {
    if (animationState.currentStep < animationState.totalSteps - 1) {
        animationState.currentStep++;
        displayAnimationStep(animationState.currentStep);
        updateStepDisplay();
        updateAnimationControls();
    }
}

function togglePlayPause() {
    if (animationState.isPlaying) {
        stopAnimation();
    } else {
        startAnimation();
    }
}

function startAnimation() {
    if (!animationState.results.fifo) return;
    
    animationState.isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    
    const speed = 1100 - (animationState.animationSpeed * 100);
    
    animationState.animationInterval = setInterval(() => {
        if (animationState.currentStep < animationState.totalSteps - 1) {
            animationState.currentStep++;
            displayAnimationStep(animationState.currentStep);
            updateStepDisplay();
            updateAnimationControls();
        } else {
            stopAnimation();
        }
    }, speed);
}

function stopAnimation() {
    if (animationState.animationInterval) {
        clearInterval(animationState.animationInterval);
    }
    
    animationState.isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i> Play';
}

function updateAnimationSpeed() {
    animationState.animationSpeed = parseInt(animationSpeedInput.value);
    
    if (animationState.isPlaying) {
        stopAnimation();
        startAnimation();
    }
}

function updateStepDisplay() {
    currentStepDisplay.textContent = animationState.currentStep + 1;
    totalStepsDisplay.textContent = animationState.totalSteps;
}

function updateAnimationControls() {
    prevStepBtn.disabled = animationState.currentStep === 0;
    nextStepBtn.disabled = animationState.currentStep === animationState.totalSteps - 1;
}



function displayAnimationStep(stepIndex) {
    if (!animationState.results.fifo) return;
    
   
    const fifoSteps = animationState.results.fifo.steps.slice(0, stepIndex + 1);
    const lruSteps = animationState.results.lru.steps.slice(0, stepIndex + 1);
    const optimalSteps = animationState.results.optimal.steps.slice(0, stepIndex + 1);
    const lfuSteps = animationState.results.lfu.steps.slice(0, stepIndex + 1);
    

    const isFinalStep = stepIndex === animationState.totalSteps - 1;

    displayAlgorithmStep(fifoDisplay, fifoSteps, stepIndex, 'fifo', isFinalStep);
    displayAlgorithmStep(lruDisplay, lruSteps, stepIndex, 'lru', isFinalStep);
    displayAlgorithmStep(optimalDisplay, optimalSteps, stepIndex, 'optimal', isFinalStep);
    displayAlgorithmStep(lfuDisplay, lfuSteps, stepIndex, 'lfu', isFinalStep);
    

    const fifoFaultCount = fifoSteps.filter(step => step.fault).length;
    const lruFaultCount = lruSteps.filter(step => step.fault).length;
    const optimalFaultCount = optimalSteps.filter(step => step.fault).length;
    const lfuFaultCount = lfuSteps.filter(step => step.fault).length;
    
    fifoFaults.textContent = fifoFaultCount;
    lruFaults.textContent = lruFaultCount;
    optimalFaults.textContent = optimalFaultCount;
    lfuFaults.textContent = lfuFaultCount;
    
    
    updateExplanation(fifoExplanation, fifoSteps[stepIndex], 'FIFO');
    updateExplanation(lruExplanation, lruSteps[stepIndex], 'LRU');
    updateExplanation(optimalExplanation, optimalSteps[stepIndex], 'Optimal');
    updateExplanation(lfuExplanation, lfuSteps[stepIndex], 'LFU');
    
    if (isFinalStep) {
        fifoFaults.style.color = '#ff4757';
        lruFaults.style.color = '#ff4757';
        optimalFaults.style.color = '#ff4757';
        lfuFaults.style.color = '#ff4757';
        
        fifoFaults.classList.add('highlight-faults');
        lruFaults.classList.add('highlight-faults');
        optimalFaults.classList.add('highlight-faults');
        lfuFaults.classList.add('highlight-faults');
    } else {
        fifoFaults.style.color = '';
        lruFaults.style.color = '';
        optimalFaults.style.color = '';
        lfuFaults.style.color = '';
        
        fifoFaults.classList.remove('highlight-faults');
        lruFaults.classList.remove('highlight-faults');
        optimalFaults.classList.remove('highlight-faults');
        lfuFaults.classList.remove('highlight-faults');
    }
}


function displayAlgorithmStep(displayElement, steps, currentStepIndex, algoType, isFinalStep) {
    displayElement.innerHTML = '';

    const visualContainer = document.createElement('div');
    visualContainer.className = 'visual-simulation';
    
   
    const referenceRow = document.createElement('div');
    referenceRow.className = 'reference-row';
    
    const refLabel = document.createElement('div');
    refLabel.className = 'frame-label';
    refLabel.textContent = 'References:';
    referenceRow.appendChild(refLabel);
    
    
    const allReferences = steps.map(step => step.page);
    
    allReferences.forEach((page, index) => {
        const refCell = document.createElement('div');
        refCell.className = 'ref-cell';
        
        if (index === currentStepIndex) {
            refCell.classList.add('active-ref');
            
            
            const arrow = document.createElement('div');
            arrow.className = 'arrow-indicator';
            arrow.innerHTML = '⬇';
            arrow.style.top = '-25px';
            arrow.style.left = '50%';
            arrow.style.transform = 'translateX(-50%)';
            refCell.appendChild(arrow);
        }
        
        if (isFinalStep && steps[index].fault) {
            refCell.classList.add('fault-ref');
        }
        
        refCell.textContent = page;
        referenceRow.appendChild(refCell);
    });
    
    visualContainer.appendChild(referenceRow);
    
    const frameCount = parseInt(frameCountInput.value);
    
    for (let i = 0; i < frameCount; i++) {
        const frameRow = document.createElement('div');
        frameRow.className = 'frame-row';
        
        const frameLabel = document.createElement('div');
        frameLabel.className = 'frame-label';
        frameLabel.textContent = `Frame ${i+1}:`;
        frameRow.appendChild(frameLabel);
        
        steps.forEach((step, stepIndex) => {
            const frameCell = document.createElement('div');
            frameCell.className = 'frame-cell';
            
            if (i < step.frames.length) {
                frameCell.textContent = step.frames[i];
                
                if (stepIndex === currentStepIndex) {
                    frameCell.classList.add('active');
                }
                
                if (step.fault && step.frames[i] === step.page && stepIndex === currentStepIndex) {
                    frameCell.classList.add('fault');
                    frameCell.classList.add('entering');
                    
                    const indicator = document.createElement('div');
                    indicator.className = 'arrow-indicator';
                    indicator.innerHTML = '⚠️';
                    indicator.style.top = '-25px';
                    indicator.style.left = '50%';
                    indicator.style.transform = 'translateX(-50%)';
                    frameCell.appendChild(indicator);
                }
                
                if (isFinalStep && step.fault && step.frames[i] === step.page) {
                    frameCell.classList.add('final-fault');
                }
            } else {
                frameCell.textContent = '-';
            }
            
            frameRow.appendChild(frameCell);
        });
        
        visualContainer.appendChild(frameRow);
    }
    
    displayElement.appendChild(visualContainer);
}

function updateExplanation(explanationElement, step, algoName) {
    if (!step) return;
    
    let explanation = '';
    
    if (step.fault) {
        explanation = `<span class="highlight-text">Page fault occurred!</span> Page ${step.page} is not in memory.`;
        
        if (step.frames.length < parseInt(frameCountInput.value)) {
            explanation += ` There is free space, so page ${step.page} is loaded into a new frame.`;
        } else {
            let replacedPage = step.replaced;
            
            switch (algoName) {
                case 'FIFO':
                    explanation += ` Using FIFO, the oldest page in memory (${replacedPage}) is replaced with page ${step.page}.`;
                    break;
                case 'LRU':
                    explanation += ` Using LRU, the least recently used page (${replacedPage}) is replaced with page ${step.page}.`;
                    break;
                case 'Optimal':
                    explanation += ` Using Optimal, the page that will not be used for the longest time (${replacedPage}) is replaced with page ${step.page}.`;
                    break;
                case 'LFU':
                    explanation += ` Using LFU, the least frequently used page (${replacedPage}) is replaced with page ${step.page}.`;
                    break;
            }
        }
    } else {
        explanation = `Page ${step.page} is already in memory. No page fault occurred.`;
    }
    
    explanationElement.innerHTML = explanation;
}


function simulateFIFO(pageReferenceString, frameCount) {
    const frames = [];
    const queue = [];
    const steps = [];
    let faults = 0;
    
    pageReferenceString.forEach(page => {
  
        const isPageInFrames = frames.includes(page);
        let replaced = null;
        
        if (!isPageInFrames) {
           
            faults++;
            
            if (frames.length < frameCount) {
                frames.push(page);
                queue.push(page);
            } else {
                replaced = queue.shift();
                const index = frames.indexOf(replaced);
                frames[index] = page;
                queue.push(page);
            }
        }
        
        
        steps.push({
            page,
            frames: [...frames],
            fault: !isPageInFrames,
            replaced
        });
    });
    
    return { steps, faults };
}


function simulateLRU(pageReferenceString, frameCount) {
    const frames = [];
    const lastUsed = {};
    const steps = [];
    let faults = 0;
    
    pageReferenceString.forEach((page, time) => {
        
        const isPageInFrames = frames.includes(page);
        let replaced = null;
        
        if (!isPageInFrames) {
            
            faults++;
            
            if (frames.length < frameCount) {
                
                frames.push(page);
            } else {
                
                let lruPage = frames[0];
                let lruTime = lastUsed[lruPage];
                
                for (let i = 1; i < frames.length; i++) {
                    if (lastUsed[frames[i]] < lruTime) {
                        lruTime = lastUsed[frames[i]];
                        lruPage = frames[i];
                    }
                }
                
                
                replaced = lruPage;
                const index = frames.indexOf(lruPage);
                frames[index] = page;
            }
        }
        
        
        lastUsed[page] = time;
        

        steps.push({
            page,
            frames: [...frames],
            fault: !isPageInFrames,
            replaced
        });
    });
    
    return { steps, faults };
}

function simulateOptimal(pageReferenceString, frameCount) {
    const frames = [];
    const steps = [];
    let faults = 0;
    
    
    function findNextOccurrence(page, currentIndex) {
        for (let i = currentIndex + 1; i < pageReferenceString.length; i++) {
            if (pageReferenceString[i] === page) {
                return i;
            }
        }
        return Infinity; 
    }
    
    pageReferenceString.forEach((page, index) => {
        
        const isPageInFrames = frames.includes(page);
        let replaced = null;
        
        if (!isPageInFrames) {

            faults++;
            
            if (frames.length < frameCount) {
                
                frames.push(page);
            } else {
                
                let farthestPage = frames[0];
                let farthestDistance = findNextOccurrence(farthestPage, index);
                
                for (let i = 1; i < frames.length; i++) {
                    const distance = findNextOccurrence(frames[i], index);
                    if (distance > farthestDistance) {
                        farthestDistance = distance;
                        farthestPage = frames[i];
                    }
                }
                
                
                replaced = farthestPage;
                const replaceIndex = frames.indexOf(farthestPage);
                frames[replaceIndex] = page;
            }
        }
        
        
        steps.push({
            page,
            frames: [...frames],
            fault: !isPageInFrames,
            replaced
        });
    });
    
    return { steps, faults };
}

function simulateLFU(pageReferenceString, frameCount) {
    const frames = [];
    const frequency = {};
    const lastUsed = {}; 
    const steps = [];
    let faults = 0;
    
    pageReferenceString.forEach((page, time) => {
        
        const isPageInFrames = frames.includes(page);
        let replaced = null;
        

        frequency[page] = (frequency[page] || 0) + 1;
        lastUsed[page] = time;
        
        if (!isPageInFrames) {
            
            faults++;
            
            if (frames.length < frameCount) {

                frames.push(page);
            } else {
                let lfuPage = frames[0];
                let lfuFreq = frequency[lfuPage];
                let lfuTime = lastUsed[lfuPage];
                
                for (let i = 1; i < frames.length; i++) {
                    const currentPage = frames[i];
                    const currentFreq = frequency[currentPage];
                    const currentTime = lastUsed[currentPage];
                    
                    if (currentFreq < lfuFreq || (currentFreq === lfuFreq && currentTime < lfuTime)) {
                        lfuFreq = currentFreq;
                        lfuPage = currentPage;
                        lfuTime = currentTime;
                    }
                }
                
                replaced = lfuPage;
                const index = frames.indexOf(lfuPage);
                frames[index] = page;
            }
        }
        
        
        steps.push({
            page,
            frames: [...frames],
            fault: !isPageInFrames,
            replaced
        });
    });
    
    return { steps, faults };
}


function updateChart(faultCounts) {
    const ctx = document.getElementById('comparison-chart').getContext('2d');
    
    
    if (comparisonChart) {
        comparisonChart.destroy();
    }
    
    
    function createGradient(ctx, startRGB, endRGB) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, `rgba(${startRGB[0]}, ${startRGB[1]}, ${startRGB[2]}, 1)`);
        gradient.addColorStop(0.6, `rgba(${startRGB[0]}, ${startRGB[1]}, ${startRGB[2]}, 0.8)`);
        gradient.addColorStop(1, `rgba(${endRGB[0]}, ${endRGB[1]}, ${endRGB[2]}, 0.7)`);
        return gradient;
    }
    
    const gradients = [
        createGradient(ctx, [255, 99, 132], [220, 20, 60]),    
        createGradient(ctx, [54, 162, 235], [25, 25, 112]),    
        createGradient(ctx, [75, 192, 192], [0, 128, 128]),    
        createGradient(ctx, [255, 206, 86], [218, 165, 32])    
    ];
    
    const minFaults = Math.min(...faultCounts);
    const bestAlgoIndex = faultCounts.indexOf(minFaults);
    
    const backgroundColors = gradients;
    
    const borderColors = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)'
    ];
    
    comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['FIFO', 'LRU', 'Optimal', 'LFU'],
            datasets: [{
                label: 'Page Faults',
                data: faultCounts,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
                hoverBackgroundColor: borderColors,
                hoverBorderWidth: 3,
                barPercentage: 0.7,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 2000,
                easing: 'easeOutElastic',
                delay: function(context) {
                    return context.dataIndex * 300;
                },
                loop: false
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Page Faults',
                        color: '#e0e0e0',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        stepSize: 1,
                        color: '#e0e0e0',
                        font: {
                            size: 14
                        },
                        callback: function(value) {
                            return value.toFixed(0);
                        },
                        padding: 10
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false,
                        z: 1
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Page Replacement Algorithms',
                        color: '#e0e0e0',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        padding: {
                            top: 20
                        }
                    },
                    ticks: {
                        color: '#e0e0e0',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: 10
                    },
                    grid: {
                        display: false,
                        z: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(20, 20, 40, 0.9)',
                    titleColor: '#bb86fc',
                    bodyColor: '#e0e0e0',
                    borderColor: '#444',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 15,
                    displayColors: true,
                    titleFont: {
                        size: 16,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 14
                    },
                    callbacks: {
                        title: function(tooltipItems) {
                            return tooltipItems[0].label + ' Algorithm';
                        },
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            const total = pageReferenceInput.value.split(',').length;
                            const hitRate = ((total - value) / total * 100).toFixed(1);
                            
                            return [
                                `Page Faults: ${value}`,
                                `Hit Rate: ${hitRate}%`,
                                `Total References: ${total}`
                            ];
                        },
                        labelTextColor: function(context) {
                            return context.dataIndex === bestAlgoIndex ? '#03dac6' : '#e0e0e0';
                        }
                    },
                    animation: {
                        duration: 400,
                        easing: 'easeOutQuart'
                    },
                    position: 'nearest'
                },
                title: {
                    display: true,
                    text: `Best Algorithm: ${['FIFO', 'LRU', 'Optimal', 'LFU'][bestAlgoIndex]} (${minFaults} faults)`,
                    position: 'bottom',
                    color: '#bb86fc',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 20,
                        bottom: 10
                    }
                }
            },
            elements: {
                bar: {
                    borderWidth: 2,
                    borderColor: function(context) {
                        return context.dataIndex === bestAlgoIndex ? 
                            'rgba(3, 218, 198, 1)' : 
                            borderColors[context.dataIndex];
                    },
                    shadowOffsetX: 3,
                    shadowOffsetY: 3,
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                }
            },
            onHover: (event, chartElement) => {
                event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 20,
                    bottom: 20
                }
            }
        },
        plugins: [{
            id: '3d-effect',
            beforeDraw: function(chart) {
                const ctx = chart.ctx;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 15;
                ctx.shadowOffsetX = 10;
                ctx.shadowOffsetY = 10;
            },
            afterDraw: function(chart) {
                const ctx = chart.ctx;
                ctx.shadowColor = 'rgba(0, 0, 0, 0)';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
            }
        }]
    });
    
    setTimeout(() => {
        const bestAlgoBar = comparisonChart.getDatasetMeta(0).data[bestAlgoIndex];
        bestAlgoBar.options.backgroundColor = createGradient(ctx, [3, 218, 198], [0, 150, 136]);
        bestAlgoBar.options.borderColor = 'rgba(3, 218, 198, 1)';
        bestAlgoBar.options.borderWidth = 3;
        comparisonChart.update();
    }, 2500);
}
