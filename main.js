// --- CONSTANTS ---
        // TEMPORARY CHANGE FOR QUICK TESTING: Setting to 5 seconds
        const FOCUS_TIME_MINUTES = 0.08; // Roughly 5 seconds for testing
        const BREAK_TIME_MINUTES = 0.08; // Roughly 5 seconds for testing
        const LONG_BREAK_TIME_MINUTES = 0.25; // Roughly 15 seconds for testing

        // Convert to seconds
        const FOCUS_TIME = Math.round(FOCUS_TIME_MINUTES * 60);
        const BREAK_TIME = Math.round(BREAK_TIME_MINUTES * 60);
        const LONG_BREAK_TIME = Math.round(LONG_BREAK_TIME_MINUTES * 60);

        // --- DOM ELEMENTS ---
        const timeDisplay = document.getElementById('time-display');
        const timerStatus = document.getElementById('timer-status');
        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const resetBtn = document.getElementById('reset-btn');

        // DOM ELEMENTS FOR BUILD 3 (Breathing Guide)
        const timerDisplaySection = document.querySelector('.time-display').parentElement.parentElement;
        const breathingSection = document.getElementById('breathing-section');
        const breathingGuide = document.getElementById('breathing-guide');
        const breathingInstruction = document.getElementById('breathing-instruction');

        // --- STATE VARIABLES ---
        let currentTime = FOCUS_TIME;
        let isRunning = false;
        let timerInterval = null;
        let currentPhase = 'Focus'; // 'Focus', 'Break', 'LongBreak'
        let focusSessionCount = 0;

        // --- BUILD 3: ANIMATION LOGIC ---

        /**
         * Starts the visual breathing guide animation and updates instructions.
         */
        function startBreathingGuide() {
            // 1. Hide the time display
            timerDisplaySection.classList.add('hidden');
            
            // 2. Show the breathing guide elements
            breathingSection.classList.remove('hidden');
            breathingGuide.classList.remove('hidden');
            breathingInstruction.classList.remove('hidden');
            
            // 3. Start the animation (uses CSS keyframes)
            breathingGuide.classList.add('breathing-active');
            
            // 4. Update the instruction text
            breathingInstruction.textContent = "Breathe In (2s) - Breathe Out (2s)";
        }

        /**
         * Stops the visual breathing guide animation and resets display.
         */
        function stopBreathingGuide() {
            // 1. Show the time display
            timerDisplaySection.classList.remove('hidden');

            // 2. Hide the breathing guide elements
            breathingSection.classList.add('hidden');
            breathingGuide.classList.add('hidden');
            breathingInstruction.classList.add('hidden');

            // 3. Stop the animation
            breathingGuide.classList.remove('breathing-active');
        }

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
                
                // BUILD 3 INTEGRATION: Show breathing guide during breaks
                startBreathingGuide();
                
                // Trigger a chat message
                showCustomMessage(`Time for your ${currentPhase}! Close your books and follow the breathing guide to reset your focus.`);

            } else { // It was a Break or LongBreak, so return to Focus
                currentPhase = 'Focus';
                currentTime = FOCUS_TIME;
                startBtn.textContent = 'Start Focus';
                
                // BUILD 3 INTEGRATION: Hide breathing guide for focus time
                stopBreathingGuide();
                
                // Trigger a chat message
                showCustomMessage(`Break is over! Time to crush this next Focus Session. Good luck!`);

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
                    <p class="font-semibold">Coach AI</p>
                    <p>${message}</p>
                </div>
            `;
            chatWindow.appendChild(messageElement);
            chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to bottom
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
            
            // BUILD 3 INTEGRATION: Ensure breathing guide is hidden if starting Focus
            if (currentPhase === 'Focus') {
                stopBreathingGuide();
            } else {
                // If resuming a break, make sure the guide is visible
                startBreathingGuide();
            }

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
            
            // BUILD 3 INTEGRATION: Pause or stop the animation when paused
            if (currentPhase !== 'Focus') {
                breathingGuide.classList.remove('breathing-active');
                breathingInstruction.textContent = "Paused. Click Resume to continue breathing.";
            }
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
            
            // BUILD 3 INTEGRATION: Hide guide on reset
            stopBreathingGuide();

            updateDisplay();
        }

        // --- EVENT LISTENERS ---
        startBtn.addEventListener('click', startTimer);
        pauseBtn.addEventListener('click', pauseTimer);
        resetBtn.addEventListener('click', resetTimer);

        // --- INITIALIZATION ---
        // Set initial display when the page loads
        updateDisplay();
        // Ensure breathing guide is hidden at start
        stopBreathingGuide();