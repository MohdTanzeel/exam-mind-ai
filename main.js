// --- CONSTANTS ---
        const FOCUS_TIME_MINUTES = 25;
        const BREAK_TIME_MINUTES = 25;
        const LONG_BREAK_TIME_MINUTES = 15;
        
        // Convert to seconds
        const FOCUS_TIME = FOCUS_TIME_MINUTES * 60;
        const BREAK_TIME = BREAK_TIME_MINUTES * 60;
        const LONG_BREAK_TIME = LONG_BREAK_TIME_MINUTES * 60;

        const timeDisplay = document.getElementById('time-display');
        const timerStatus = document.getElementById('timer-status');
        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const resetBtn = document.getElementById('reset-btn');

        // --- STATE VARIABLES ---
        let currentTime = FOCUS_TIME;
        let isRunning = false;
        let timerInterval = null;
        let currentPhase = 'Focus'; // 'Focus', 'Break', 'LongBreak'
        let focusSessionCount = 0;

        // --- HELPER FUNCTIONS ---

        /**
         * Formats seconds into MM:SS string.
         * @param {number} totalSeconds - Time in seconds.
         * @returns {string} Formatted time string.
         */
        function formatTime(totalSeconds) {
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        /**
         * Updates the timer display and status text.
         */
        function updateDisplay() {
            timeDisplay.textContent = formatTime(currentTime);
            timerStatus.textContent = `${currentPhase} Phase - Session ${focusSessionCount + 1}`;
            
            // Visual feedback: change timer color based on phase
            if (currentPhase === 'Focus') {
                timeDisplay.style.color = '#4f46e5'; // Indigo
            } else {
                timeDisplay.style.color = '#f59e0b'; // Amber/Yellow
            }
        }

        /**
         * Switches the timer to the next phase (Pomodoro logic).
         */
        function switchPhase() {
            // Stop current timer
            clearInterval(timerInterval);
            isRunning = false;

            // Determine the next phase
            if (currentPhase === 'Focus') {
                focusSessionCount++;
                // Long break after 4 focus sessions
                if (focusSessionCount % 4 === 0) {
                    currentPhase = 'LongBreak';
                    currentTime = LONG_BREAK_TIME;
                    startBtn.textContent = 'Start Long Break';
                } else {
                    currentPhase = 'Break';
                    currentTime = BREAK_TIME;
                    startBtn.textContent = 'Start Short Break';
                }
                
                // Trigger a notification or chat message (Build 4 will enhance this)
                // NOTE: Using a custom alert for better UX instead of window.alert()
                showCustomMessage(`Time for your ${currentPhase}! You earned it.`);

            } else { // It was a Break or LongBreak, so return to Focus
                currentPhase = 'Focus';
                currentTime = FOCUS_TIME;
                startBtn.textContent = 'Start Focus';
                // If it was a LongBreak, the counter resets implicitly with the next Focus session.
            }
            
            // Update display and prepare for next start
            updateDisplay();
            startBtn.classList.remove('hidden');
            pauseBtn.classList.add('hidden');
        }

        // --- CUSTOM MESSAGE BOX (Replacing alert) ---
        function showCustomMessage(message) {
            const chatWindow = document.getElementById('chat-window');
            
            const messageElement = document.createElement('div');
            messageElement.className = 'chat-message-ai';
            messageElement.innerHTML = `
                <div class="ai-bubble" style="background-color: #f0fdf4; color: #15803d; border: 1px solid #dcfce7;">
                    <p class="font-semibold">ALERT</p>
                    <p>${message}</p>
                </div>
            `;
            chatWindow.appendChild(messageElement);
            chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to bottom
            
            // Optional: You could add a delay here to show a modal for a few seconds instead of just a chat message
        }

        // --- CORE TIMER LOGIC ---

        /**
         * Starts or resumes the countdown timer.
         */
        function startTimer() {
            if (isRunning) return;

            isRunning = true;
            startBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');

            timerInterval = setInterval(() => {
                currentTime--;
                updateDisplay();

                if (currentTime <= 0) {
                    switchPhase();
                }
            }, 1000); // Countdown every second
        }

        /**
         * Pauses the countdown timer.
         */
        function pauseTimer() {
            if (!isRunning) return;

            isRunning = false;
            clearInterval(timerInterval);
            startBtn.classList.remove('hidden');
            pauseBtn.classList.add('hidden');
            startBtn.textContent = `Resume ${currentPhase}`;
        }

        /**
         * Resets the timer to the initial Focus state.
         */
        function resetTimer() {
            pauseTimer();
            currentTime = FOCUS_TIME;
            currentPhase = 'Focus';
            focusSessionCount = 0;
            startBtn.textContent = 'Start Focus';
            pauseBtn.classList.add('hidden');
            startBtn.classList.remove('hidden');
            timerStatus.textContent = 'Ready to Start Focus Session';
            updateDisplay();
        }

        // --- EVENT LISTENERS ---
        startBtn.addEventListener('click', startTimer);
        pauseBtn.addEventListener('click', pauseTimer);
        resetBtn.addEventListener('click', resetTimer);

        // --- INITIALIZATION ---
        // Set initial display when the page loads
        updateDisplay();