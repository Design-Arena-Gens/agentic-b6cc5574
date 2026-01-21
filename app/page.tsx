"use client";

import { FormEvent, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const starterMessage: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I can help you answer questions about sending packages with OrbisLinks. Ask me anything about finding travelers, sending packages, prohibited items, or insurance.",
};

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage]);
  const [question, setQuestion] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const sendQuestion = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!question.trim() || isThinking) return;

    const userMessage: ChatMessage = { role: "user", content: question.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setIsThinking(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage.content, history: messages }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = (await response.json()) as { answer: string };
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.answer,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong while I was answering. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <main>
      <header>
        <h1>OrbisLinks FAQ Chatbot</h1>
        <p>
          Instant answers about how to send packages with travelers, what you can
          ship, and more.
        </p>
      </header>

      <section className="chat-container">
        <div className="messages" aria-live="polite">
          {messages.map((message, index) => (
            <article key={index} className={`message ${message.role}`}>
              <span className="role" aria-hidden>
                {message.role === "assistant" ? "AI" : "You"}
              </span>
              <p className="content">{message.content}</p>
            </article>
          ))}
          {isThinking && (
            <article className="message assistant">
              <span className="role" aria-hidden>
                AI
              </span>
              <p className="content">Thinking…</p>
            </article>
          )}
        </div>

        <form className="prompt" onSubmit={sendQuestion}>
          <textarea
            name="question"
            placeholder="Ask about travelers, delivery, or policies"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            aria-label="Ask a question"
          />
          <button type="submit" disabled={!question.trim() || isThinking}>
            {isThinking ? "Sending" : "Send"}
          </button>
        </form>
      </section>
    </main>
  );
}
