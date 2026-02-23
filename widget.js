(function () {
  "use strict";

  // --- Configuration ---
  const scriptTag = document.currentScript;
  const CONFIG = {
    apiUrl: scriptTag?.getAttribute("data-api-url") || "",
    title: scriptTag?.getAttribute("data-title") || "Chat with us",
    subtitle: scriptTag?.getAttribute("data-subtitle") || "Ask me anything",
    primaryColor: scriptTag?.getAttribute("data-color") || "#2563eb",
    position: scriptTag?.getAttribute("data-position") || "right", // "left" or "right"
    placeholder:
      scriptTag?.getAttribute("data-placeholder") || "Type a message…",
  };

  // --- Inject Styles ---
  const STYLES = `
    /* Reset inside widget */
    #mcpcw-container *, #mcpcw-container *::before, #mcpcw-container *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    /* Bubble button */
    #mcpcw-bubble {
      position: fixed;
      bottom: 24px;
      ${CONFIG.position === "left" ? "left: 24px;" : "right: 24px;"}
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${CONFIG.primaryColor};
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2147483646;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    #mcpcw-bubble:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 24px rgba(0,0,0,0.22);
    }
    #mcpcw-bubble svg {
      width: 28px;
      height: 28px;
      fill: #fff;
    }

    /* Chat panel */
    #mcpcw-panel {
      position: fixed;
      bottom: 100px;
      ${CONFIG.position === "left" ? "left: 24px;" : "right: 24px;"}
      width: 400px;
      max-width: calc(100vw - 48px);
      height: 560px;
      max-height: calc(100vh - 140px);
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.15);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 2147483647;
      animation: mcpcw-slide-up 0.25s ease-out;
    }
    #mcpcw-panel.mcpcw-open {
      display: flex;
    }

    @keyframes mcpcw-slide-up {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Header */
    #mcpcw-header {
      padding: 18px 20px;
      background: ${CONFIG.primaryColor};
      color: #fff;
      flex-shrink: 0;
    }
    #mcpcw-header-title {
      font-size: 16px;
      font-weight: 600;
      line-height: 1.3;
    }
    #mcpcw-header-subtitle {
      font-size: 13px;
      opacity: 0.85;
      margin-top: 2px;
      font-weight: 400;
    }
    #mcpcw-close {
      position: absolute;
      top: 14px;
      right: 16px;
      background: none;
      border: none;
      color: #fff;
      font-size: 22px;
      cursor: pointer;
      opacity: 0.8;
      line-height: 1;
      padding: 4px;
    }
    #mcpcw-close:hover { opacity: 1; }

    /* Messages area */
    #mcpcw-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #f9fafb;
    }
    #mcpcw-messages::-webkit-scrollbar {
      width: 5px;
    }
    #mcpcw-messages::-webkit-scrollbar-track {
      background: transparent;
    }
    #mcpcw-messages::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 3px;
    }

    .mcpcw-msg {
      max-width: 82%;
      padding: 10px 14px;
      border-radius: 14px;
      font-size: 14px;
      line-height: 1.55;
      word-wrap: break-word;
      white-space: pre-wrap;
    }
    .mcpcw-msg-user {
      align-self: flex-end;
      background: ${CONFIG.primaryColor};
      color: #fff;
      border-bottom-right-radius: 4px;
    }
    .mcpcw-msg-bot {
      align-self: flex-start;
      background: #ffffff;
      color: #1f2937;
      border: 1px solid #e5e7eb;
      border-bottom-left-radius: 4px;
    }

    /* Typing indicator */
    .mcpcw-typing {
      display: flex;
      gap: 4px;
      padding: 10px 14px;
      align-self: flex-start;
    }
    .mcpcw-typing span {
      width: 7px;
      height: 7px;
      background: #9ca3af;
      border-radius: 50%;
      animation: mcpcw-bounce 1.2s infinite ease-in-out;
    }
    .mcpcw-typing span:nth-child(2) { animation-delay: 0.15s; }
    .mcpcw-typing span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes mcpcw-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }

    /* Input area */
    #mcpcw-input-area {
      padding: 12px 16px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 8px;
      background: #fff;
      flex-shrink: 0;
    }
    #mcpcw-input {
      flex: 1;
      border: 1px solid #d1d5db;
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 14px;
      outline: none;
      resize: none;
      max-height: 100px;
      line-height: 1.4;
      background: #f9fafb;
      transition: border-color 0.15s;
    }
    #mcpcw-input:focus {
      border-color: ${CONFIG.primaryColor};
      background: #fff;
    }
    #mcpcw-input::placeholder {
      color: #9ca3af;
    }
    #mcpcw-send {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      border: none;
      background: ${CONFIG.primaryColor};
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: opacity 0.15s;
      align-self: flex-end;
    }
    #mcpcw-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    #mcpcw-send svg {
      width: 18px;
      height: 18px;
      fill: #fff;
    }

    /* Powered by */
    #mcpcw-powered {
      text-align: center;
      font-size: 11px;
      color: #9ca3af;
      padding: 6px 0 10px;
      background: #fff;
    }
    #mcpcw-powered a {
      color: #6b7280;
      text-decoration: none;
    }
    #mcpcw-powered a:hover {
      text-decoration: underline;
    }

    /* Mobile */
    @media (max-width: 480px) {
      #mcpcw-panel {
        width: calc(100vw - 16px);
        height: calc(100vh - 80px);
        max-height: calc(100vh - 80px);
        bottom: 8px;
        ${CONFIG.position === "left" ? "left: 8px;" : "right: 8px;"}
        border-radius: 12px;
      }
      #mcpcw-bubble {
        bottom: 16px;
        ${CONFIG.position === "left" ? "left: 16px;" : "right: 16px;"}
      }
    }
  `;

  const styleEl = document.createElement("style");
  styleEl.textContent = STYLES;
  document.head.appendChild(styleEl);

  // --- Build DOM ---
  const container = document.createElement("div");
  container.id = "mcpcw-container";

  container.innerHTML = `
    <button id="mcpcw-bubble" aria-label="Open chat">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
      </svg>
    </button>
    <div id="mcpcw-panel">
      <div id="mcpcw-header" style="position:relative;">
        <div id="mcpcw-header-title">${CONFIG.title}</div>
        <div id="mcpcw-header-subtitle">${CONFIG.subtitle}</div>
        <button id="mcpcw-close" aria-label="Close chat">&times;</button>
      </div>
      <div id="mcpcw-messages"></div>
      <div id="mcpcw-input-area">
        <textarea id="mcpcw-input" rows="1" placeholder="${CONFIG.placeholder}"></textarea>
        <button id="mcpcw-send" aria-label="Send message">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
      <div id="mcpcw-powered">Powered by <a href="#">MCP Chat Widget</a></div>
    </div>
  `;

  document.body.appendChild(container);

  // --- State & Elements ---
  const bubble = document.getElementById("mcpcw-bubble");
  const panel = document.getElementById("mcpcw-panel");
  const closeBtn = document.getElementById("mcpcw-close");
  const messagesEl = document.getElementById("mcpcw-messages");
  const inputEl = document.getElementById("mcpcw-input");
  const sendBtn = document.getElementById("mcpcw-send");

  let conversationHistory = [];
  let isStreaming = false;

  // --- Toggle ---
  function openChat() {
    panel.classList.add("mcpcw-open");
    bubble.style.display = "none";
    inputEl.focus();
  }
  function closeChat() {
    panel.classList.remove("mcpcw-open");
    bubble.style.display = "flex";
  }

  bubble.addEventListener("click", openChat);
  closeBtn.addEventListener("click", closeChat);

  // --- Messages ---
  function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = `mcpcw-msg mcpcw-msg-${sender}`;
    msg.textContent = text;
    messagesEl.appendChild(msg);
    scrollToBottom();
    return msg;
  }

  function showTyping() {
    const el = document.createElement("div");
    el.className = "mcpcw-typing";
    el.id = "mcpcw-typing";
    el.innerHTML = "<span></span><span></span><span></span>";
    messagesEl.appendChild(el);
    scrollToBottom();
  }

  function hideTyping() {
    const el = document.getElementById("mcpcw-typing");
    if (el) el.remove();
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  // --- Send Message ---
  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || isStreaming) return;

    addMessage(text, "user");
    conversationHistory.push({ role: "user", content: text });
    inputEl.value = "";
    inputEl.style.height = "auto";
    sendBtn.disabled = true;
    isStreaming = true;

    if (!CONFIG.apiUrl) {
      // Demo mode - simulate a response
      showTyping();
      await simulateResponse(text);
      hideTyping();
      isStreaming = false;
      sendBtn.disabled = false;
      return;
    }

    // Real API call with streaming
    try {
      showTyping();

      const response = await fetch(CONFIG.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationHistory,
        }),
      });

      hideTyping();

      if (!response.ok) {
        addMessage("Sorry, something went wrong. Please try again.", "bot");
        isStreaming = false;
        sendBtn.disabled = false;
        return;
      }

      // Try to stream the response
      const contentType = response.headers.get("content-type") || "";
      if (
        contentType.includes("text/event-stream") ||
        contentType.includes("text/plain") ||
        response.body
      ) {
        await handleStreamResponse(response);
      } else {
        // Fallback: non-streaming JSON response
        const data = await response.json();
        const reply =
          data.choices?.[0]?.message?.content ||
          data.message?.content ||
          data.content ||
          data.reply ||
          data.response ||
          data.text ||
          JSON.stringify(data);
        addMessage(reply, "bot");
        conversationHistory.push({ role: "assistant", content: reply });
      }
    } catch (err) {
      hideTyping();
      console.error("[MCP Chat Widget]", err);
      addMessage("Connection error. Please try again.", "bot");
    }

    isStreaming = false;
    sendBtn.disabled = false;
  }

  async function handleStreamResponse(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const botMsg = addMessage("", "bot");
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      // Handle SSE format (data: ...\n\n)
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const token =
              parsed.choices?.[0]?.delta?.content ||
              parsed.delta?.content ||
              parsed.content ||
              parsed.token ||
              parsed.text ||
              "";
            if (token) {
              fullText += token;
              botMsg.textContent = fullText;
              scrollToBottom();
            }
          } catch {
            // If not valid JSON, treat as plain text token
            if (data.trim()) {
              fullText += data;
              botMsg.textContent = fullText;
              scrollToBottom();
            }
          }
        } else if (
          !line.startsWith(":") &&
          !line.startsWith("event:") &&
          line.trim()
        ) {
          // Plain text streaming (not SSE)
          fullText += line;
          botMsg.textContent = fullText;
          scrollToBottom();
        }
      }
    }

    if (fullText) {
      conversationHistory.push({ role: "assistant", content: fullText });
    }
  }

  // --- Demo mode: simulated response ---
  async function simulateResponse(userText) {
    const responses = [
      "Hello! I'm a demo chat widget. Connect me to your AI endpoint using the `data-api-url` attribute to get real responses!",
      "This is a simulated response. To connect to your AI backend, add `data-api-url=\"https://your-api.com/chat\"` to the script tag.",
      "I'm running in demo mode. Once you configure an API endpoint, I'll stream real AI responses!",
      "Great question! In production, this message would come from your MCP-connected AI agent. Set the `data-api-url` to get started.",
    ];

    const reply = responses[Math.floor(Math.random() * responses.length)];
    await new Promise((r) => setTimeout(r, 800));
    hideTyping();
    // Simulate streaming
    const botMsg = addMessage("", "bot");
    for (let i = 0; i < reply.length; i++) {
      botMsg.textContent += reply[i];
      scrollToBottom();
      await new Promise((r) => setTimeout(r, 18 + Math.random() * 22));
    }
    conversationHistory.push({ role: "assistant", content: reply });
  }

  // --- Input handling ---
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendBtn.addEventListener("click", sendMessage);

  // Auto-resize textarea
  inputEl.addEventListener("input", () => {
    inputEl.style.height = "auto";
    inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + "px";
  });
})();
