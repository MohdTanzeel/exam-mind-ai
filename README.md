# Exam Mind AI — Focus Coach

A browser-based Pomodoro companion that pairs a 25/5 focus-break cycle with a visual breathing guide and lightweight AI micro-coaching chat to keep students steady during study blocks.

## What the project does
- Runs a focus timer with automatic short/long breaks (Pomodoro-style) and phase-aware status updates.
- Shows a breathing animation during breaks to help users reset stress.
- Delivers supportive AI "Coach" messages in a chat-style panel and logs them for the session.
- Includes a simple mood check-in input for capturing how the user feels before/after cycles.
- Surfaces a built-in wellness disclaimer to clarify it is not a substitute for professional care.

## Why the project is useful
- Keeps study sessions structured without extra apps or installs—just open the page.
- Encourages calmer breaks, reducing anxiety spikes between focus blocks.
- Provides gentle accountability through chat nudges when phases change.
- Mobile-friendly layout so students can run it alongside notes or lectures.

## Getting started
### Prerequisites
- Modern web browser (Chrome, Edge, Firefox, or Safari). No backend or package installs required.

### Run locally
1. Clone or download this repository.
2. Open `index.html` directly in your browser, or serve the folder with a simple static server (e.g., `python -m http.server 8000`).
3. Click **Start Focus** to begin a 25-minute focus block. The app will auto-switch to a break and start the breathing guide; use **Pause** or **Reset** as needed.

### Optional configuration
- Adjust default durations by editing the minute constants near the top of [main.js](main.js#L1-L24).

## Usage tips
- During breaks, follow the animated circle for calm breathing; the guide hides automatically when focus resumes.
- Watch the chat panel for phase-change prompts and encouragement; new messages appear at the bottom.
- Use the mood check-in box to note stress or energy—this is a placeholder for future logging/analysis.

## Where users can get help
- Open a GitHub issue with details about your browser, OS, and steps to reproduce.

## Who maintains and contributes
- Maintained by the Exam Mind AI project team. Contributions are welcome via pull requests and issues; propose significant changes in an issue before opening a PR.
