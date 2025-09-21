import React, { useState, useEffect } from "react";
import "./Chat.css";
import logo from "./assets/logo.png";
import ag_blue from './assets/ag_blue.png';
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

const Chat = () => {
  const navigate = useNavigate();
  const [showTables, setShowTables] = useState(false);
  const [showKPIs, setShowKPIs] = useState(false); 
  const [messages, setMessages] = useState([

    { role: "assistant", content: "You can see the brief on the main page. What are the other actions you want to take?" }
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setShowKPIs(true), 500); 
    return () => clearTimeout(timer);
  }, []);


  const sendMessage = async () => {
  if (!input.trim()) return;
  const newMessage = { role: "user", content: input };
  setMessages((prev) => [...prev, newMessage]);

  setInput("");

  let assistantReply = "";
  setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

  try {
    const res = await fetch("/chat/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
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
      console.log("DEBUG: odebrano chunk z serwera:", chunk); // 🔹 log

      const lines = chunk.split("\n");

      for (let line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.replace("data: ", "").trim();
          if (data === "[DONE]") {
            console.log("DEBUG: Stream zakończony");
            return;
          }
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
            text={`Overall we see that in reality the <b>width is 5.37% smaller</b> than expected which could cause this issue.\n
The highest compliance is in the <b>top (78%)</b>, followed by the <b>middle area (74%)</b>. The difference of compliance between top, mid, low is the closest in the <b>Health & Beauty</b> category.\n
Especially in the <b>cigarettes section</b> we see that stores add on average <b>3.5 extra facings</b> on section 60-4. Furthermore the <b>chips section</b> holds potential of <b>1.4 extra facings</b> for section 50-2 and 50-3.`}
          />
        </li>
      </ul>
    </section>
    
    {showKPIs && (
        <section className="kpis kpis fade-in">
        <h2>Main KPIs</h2>
        <div className="kpi-grid">
          <div className="kpi-card">
            <p>Scan reports count</p>
            <h3>
              16,541 <span className="kpi-change up">▲ +20%</span>
            </h3>
          </div>
          <div className="kpi-card">
            <p>POG compliance</p>
            <h3>
              67% <span className="kpi-change up">▲ +67%</span>
            </h3>
          </div>
          <div className="kpi-card">
            <p>Pricing compliance</p>
            <h3>
              89% <span className="kpi-change up">▲ +11%</span>
            </h3>
          </div>
          <div className="kpi-card">
            <p>Out of shelf</p>
            <h3>
              15% <span className="kpi-change down">▼ -9%</span>
            </h3>
          </div>
        </div>

        <div className="additional-info">
          <div className="info-item">
            <div className="star-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                    <path d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z"/>
                </svg>
              </div>
            <h4>Non-performing stores ➤</h4>
          </div>
          <div className="info-item">
            <div className="star-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                <path d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z"/>
              </svg>
              </div>
            <h4 onClick={() => setShowTables(!showTables)}
              className="expand-btn">
              Top & bottom performing areas ➤
            </h4>
          </div>
        </div>
      </section>
    )}

      {showTables && (
        <section className="tables-section">
          <div className="table-card">
            <h2>Top performing areas</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Area</th>
                    <th>OSA (%)</th>
                    <th>POG (%)</th>
                    <th>OOS (%)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Area 1</td>
                    <td>97</td>
                    <td>88</td>
                    <td>12</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Area 33</td>
                    <td>96</td>
                    <td>90</td>
                    <td>6</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="table-card">
            <h2>Bottom performing areas</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Area</th>
                    <th>OSA (%)</th>
                    <th>POG (%)</th>
                    <th>OOS (%)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>998</td>
                    <td>Area 34</td>
                    <td>34</td>
                    <td>43</td>
                    <td>58</td>
                  </tr>
                  <tr>
                    <td>999</td>
                    <td>Area 13</td>
                    <td>35</td>
                    <td>33</td>
                    <td>51</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </main>

      {/* Chat */}
      <aside className="chat-container">
        <div className="chat-header"><img 
                      src={ag_blue} 
                      alt="User" 
                      className="assistant"/> Daily brief</div>
        
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

export default Chat;