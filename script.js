// script.js
const chatWindow = document.getElementById('chatWindow');
const questionDisplay = document.getElementById('questionDisplay');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');

// Your deployed Cloudflare Worker endpoint
const workerUrl = 'https://uiriamuworker.xieyuuuu.workers.dev/';
// Maintain conversation context for multi-turn
const chatHistory = [];

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  // Show user question above and in chat bubble
  questionDisplay.textContent = message;
  appendBubble(message, 'user');
  chatHistory.push({ role: 'user', content: message });
  userInput.value = '';

  // Send history to Cloudflare Worker for secure OpenAI call
  const response = await fetch(workerUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: chatHistory })
  });
  const data = await response.json();
  const aiMessage = data.choices[0].message.content;

  // Display AI response bubble
  appendBubble(aiMessage, 'ai');
  chatHistory.push({ role: 'assistant', content: aiMessage });

  // Auto-scroll to latest
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

/**
 * Helper to append a message bubble
 * @param {string} text
 * @param {'user'|'ai'} sender
 */
function appendBubble(text, sender) {
  const bubble = document.createElement('div');
  bubble.classList.add('bubble', sender);
  bubble.textContent = text;
  chatWindow.appendChild(bubble);
}

// Note: System prompt is injected server-side in the Cloudflare Worker to enforce
// that the assistant only answers on L’Oréal products, routines, and recommendations.

