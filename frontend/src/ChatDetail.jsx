import React, { useState, useEffect } from "react";
import "./ChatDetail.css";
import logo from "./assets/logo.png";
import ag_green from './assets/ag_green.png';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from "react-markdown";

const Typewriter = ({ text, speed = 10 }) => {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayed((prev) => prev + text[index]);
        setIndex(index + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  return (
    <span
      dangerouslySetInnerHTML={{ __html: displayed }}
      style={{ whiteSpace: "pre-line" }}
    />
  );

};

const ChatDetail = () => {
  const navigate = useNavigate();
  const [showTables, setShowTables] = useState(false);
  const [showKPIs, setShowKPIs] = useState(false); 
  const [showOpti, setShowOpti] = useState(false); 
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setShowKPIs(true), 500); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowOpti(true), 2000); 
    return () => clearTimeout(timer);
  }, []);


  // main function to send message
  const sendMessage = async (messageToSend) => {
  const messageContent = messageToSend ?? input;
  if (!messageContent.trim()) return;

  const newMessage = { role: "user", content: messageContent };
  setMessages((prev) => [...prev, newMessage]);

  if (!messageToSend) setInput(""); // czyścimy input tylko jeśli wiadomość przyszła z inputa

  let assistantReply = "";

  setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

  try {
    const res = await fetch("/chat/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: messageContent }),
    });

    if (!res.body) {
      console.error("DEBUG: Brak body w odpowiedzi!");
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (let line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.replace("data: ", "").trim();
          if (data === "[DONE]") return;
          try {
            const parsed = JSON.parse(data);
            assistantReply += parsed.content;

            setMessages((prev) => {
              const last = prev[prev.length - 1];
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...last,
                content: assistantReply,
              };
              return updated;
            });
          } catch (e) {
            console.error("DEBUG: Błąd parsowania JSON:", e, data);
          }
        }
      }
    }
  } catch (err) {
    console.error("DEBUG: Błąd fetch/stream:", err);
    setMessages((prev) => [...prev, { role: "assistant", content: "I cannot answer right now" }]);
  }
};

  useEffect(() => {
  const firstMessage = "List only the product names that clearly show unusual or incorrect allocation in stores. Summarize by product category and list misalignments KPIs in facing.";
    sendMessage(firstMessage);
  }, []);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-img">
          <img src={logo} width={200} height={50} alt="OmniAgent Logo" />
        </div>
        <ul className="main-menu">
          <li onClick={() => navigate('/sales-agent')} className="active">OmniAgent</li>
          <li onClick={() => navigate('/')}>Dashboard</li>
          <li>Products</li>
          <li>Videos</li>
          <li>Stores</li>
          <li>Marketing</li>
          <li>Tasks</li>
          <li>Reports QA</li>
          <li>Analytics</li>
          <li>Settings</li>
          <li>Roles</li>
          <li>Clients</li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <section className="executive-summary" style={{ width: "654px" }}>
      <h2>Executive summary</h2>
      <ul style={{ fontSize: "12px", listStyle: "none", paddingLeft: 20 }}>
        <li>
          <Typewriter
            text={`Most fixture and POG issues are in:
              • <b>Chips</b>
              • <b>Health & Beauty</b><br />
              Since the new planograms went live 10 days ago, Café cluster stores (23% of stores) show too many facings in the top row area, leading to mismatches.`}
          />
        </li>
      </ul>
    </section>
    
    {showKPIs && (
        <section className="kpis2 fade-in">
        <h2>Complaint spike since planogram launch</h2>
        <div className="kpi2-grid">
          <div className="kpi2-card">
            <h3><p><b>Chips</b></p> <span className="kpi2-change down"> +147%</span></h3>
          </div>
          <div className="kpi2-card">
            <h3><p><b>Health & Beauty</b></p> <span className="kpi2-change down"> +327%</span></h3>
          </div>
        </div>
        </section>
    )}

    {showOpti && (
        <section className="executive-summary fade-in" style={{ width: "654px" }}>
        <h2>Optimization opportunity detected</h2>
        <ul style={{ fontSize: "12px", listStyle: "none", paddingLeft: 20 }}>
          <li>
            These fixture and planogram mismatches may be causing inefficient shelf space use. Re-allocating facings could increase sales and profitability.
          </li>
          <li>
            <br />
            <button>Observe this cluster</button><button>Send me detailed report</button>
            </li>
        </ul>
      </section>

    )}
      
      </main>

      {/* Chat */}
      <aside className="chat-container">
        <div className="chat-header"><img 
                      src={ag_green} 
                      alt="User" 
                      className="assistant"/> Misalignment and fixtures issues</div>
        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.role}`}>
                <b>{m.role}:</b>{" "}
            <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
          ))}
        </div>
        <div className="input-bar">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </aside>
    </div>
  );
};

export default ChatDetail;