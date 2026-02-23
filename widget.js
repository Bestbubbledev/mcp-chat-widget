(function () {
  "use strict";

  // --- Configuration ---
  const scriptTag = document.currentScript;
  const CONFIG = {
    apiUrl: scriptTag?.getAttribute("data-api-url") || "",
    title: scriptTag?.getAttribute("data-title") || "Chat with us",
    subtitle: scriptTag?.getAttribute("data-subtitle") || "Ask me anything",
    primaryColor: scriptTag?.getAttribute("data-color") || "#18181b",
    accentColor: scriptTag?.getAttribute("data-accent") || "#3b82f6",
    position: scriptTag?.getAttribute("data-position") || "right",
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
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    /* Bubble button */
    #mcpcw-bubble {
      position: fixed;
      bottom: 24px;
      ${CONFIG.position === "left" ? "left: 24px;" : "right: 24px;"}
      width: 56px;
      height: 56px;
      border-radius: 14px;
      background: ${CONFIG.primaryColor};
      border: 1px solid #27272a;
      cursor: pointer;
      box-shadow: 0 2px 12px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2147483646;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    #mcpcw-bubble:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.16), 0 2px 6px rgba(0,0,0,0.1);
    }
    #mcpcw-bubble svg {
      width: 24px;
      height: 24px;
      fill: #fafafa;
    }

    /* Chat panel */
    #mcpcw-panel {
      position: fixed;
      bottom: 96px;
      ${CONFIG.position === "left" ? "left: 24px;" : "right: 24px;"}
      width: 380px;
      max-width: calc(100vw - 48px);
      height: 540px;
      max-height: calc(100vh - 140px);
      background: #fafafa;
      border: 1px solid #e4e4e7;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 2147483647;
      animation: mcpcw-slide-up 0.2s ease-out;
    }
    #mcpcw-panel.mcpcw-open {
      display: flex;
    }

    @keyframes mcpcw-slide-up {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Header */
    #mcpcw-header {
      padding: 16px 20px;
      background: ${CONFIG.primaryColor};
      color: #fafafa;
      flex-shrink: 0;
      border-bottom: 1px solid #27272a;
    }
    #mcpcw-header-title {
      font-size: 15px;
      font-weight: 600;
      line-height: 1.3;
      letter-spacing: -0.01em;
      color: #fafafa;
    }
    #mcpcw-header-subtitle {
      font-size: 12px;
      color: #a1a1aa;
      margin-top: 2px;
      font-weight: 400;
    }
    #mcpcw-close {
      position: absolute;
      top: 12px;
      right: 14px;
      background: none;
      border: none;
      color: #71717a;
      font-size: 20px;
      cursor: pointer;
      line-height: 1;
      padding: 4px;
      transition: color 0.15s;
    }
    #mcpcw-close:hover { color: #fafafa; }

    /* Messages area */
    #mcpcw-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: #fafafa;
    }
    #mcpcw-messages::-webkit-scrollbar {
      width: 4px;
    }
    #mcpcw-messages::-webkit-scrollbar-track {
      background: transparent;
    }
    #mcpcw-messages::-webkit-scrollbar-thumb {
      background: #d4d4d8;
      border-radius: 2px;
    }

    .mcpcw-msg {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 10px;
      font-size: 13.5px;
      line-height: 1.6;
      word-wrap: break-word;
      white-space: pre-wrap;
      letter-spacing: -0.005em;
    }
    .mcpcw-msg-user {
      align-self: flex-end;
      background: ${CONFIG.primaryColor};
      color: #fafafa;
      border-bottom-right-radius: 3px;
    }
    .mcpcw-msg-bot {
      align-self: flex-start;
      background: #ffffff;
      color: #27272a;
      border: 1px solid #e4e4e7;
      border-bottom-left-radius: 3px;
    }

    /* Typing indicator */
    .mcpcw-typing {
      display: flex;
      gap: 4px;
      padding: 10px 14px;
      align-self: flex-start;
    }
    .mcpcw-typing span {
      width: 6px;
      height: 6px;
      background: #a1a1aa;
      border-radius: 50%;
      animation: mcpcw-bounce 1.2s infinite ease-in-out;
    }
    .mcpcw-typing span:nth-child(2) { animation-delay: 0.15s; }
    .mcpcw-typing span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes mcpcw-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-5px); }
    }

    /* Input area */
    #mcpcw-input-area {
      padding: 12px 14px;
      border-top: 1px solid #e4e4e7;
      display: flex;
      gap: 8px;
      background: #fff;
      flex-shrink: 0;
    }
    #mcpcw-input {
      flex: 1;
      border: 1px solid #e4e4e7;
      border-radius: 8px;
      padding: 9px 12px;
      font-size: 13.5px;
      outline: none;
      resize: none;
      max-height: 100px;
      line-height: 1.4;
      background: #fafafa;
      color: #18181b;
      transition: border-color 0.15s, background 0.15s;
      letter-spacing: -0.005em;
    }
    #mcpcw-input:focus {
      border-color: #a1a1aa;
      background: #fff;
    }
    #mcpcw-input::placeholder {
      color: #a1a1aa;
    }
    #mcpcw-send {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: none;
      background: ${CONFIG.primaryColor};
      color: #fafafa;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: opacity 0.15s;
      align-self: flex-end;
    }
    #mcpcw-send:hover {
      background: #27272a;
    }
    #mcpcw-send:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    #mcpcw-send svg {
      width: 16px;
      height: 16px;
      fill: #fafafa;
    }

    /* Powered by */
    #mcpcw-powered {
      text-align: center;
      font-size: 10px;
      color: #a1a1aa;
      padding: 6px 0 8px;
      background: #fff;
      letter-spacing: 0.01em;
    }
    #mcpcw-powered a {
      color: #71717a;
      text-decoration: none;
      font-weight: 500;
    }
    #mcpcw-powered a:hover {
      color: #18181b;
    }

    /* Mobile */
    @media (max-width: 480px) {
      #mcpcw-panel {
        width: calc(100vw - 16px);
        height: calc(100vh - 80px);
        max-height: calc(100vh - 80px);
        bottom: 8px;
        ${CONFIG.position === "left" ? "left: 8px;" : "right: 8px;"}
        border-radius: 10px;
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
