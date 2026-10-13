import React, { useState } from 'react';
import { SparklesIcon, XIcon, PopcornIcon } from './Icons';
import { api } from '../services/api';

export const AiAssistantModal = ({ onClose, onBookMovie, movies }) => {
  const [tab, setTab] = useState('recommend'); // 'recommend' | 'chat'
  
  // Recommender state
  const [mood, setMood] = useState('Excited & Thrilled');
  const [genre, setGenre] = useState('');
  const [language, setLanguage] = useState('');
  const [customQuery, setCustomQuery] = useState('');
  const [recommendationResult, setRecommendationResult] = useState('');
  const [loadingRec, setLoadingRec] = useState(false);

  // Chat state
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "🎬 Hey there! I'm CineBot, your personal movie connoisseur. Tell me what kind of movie or mood you're feeling today, and I'll find your perfect cinema match!",
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);

  const moods = [
    '⚡ Excited & Thrilled',
    '❤️ Heartfelt & Emotional',
    '😂 Laugh-out-loud Comedy',
    '🧠 Mind-bending Sci-Fi',
    '🏎️ High Octane Sports & Action',
    '👨‍👩‍👦 Wholesome Family Time',
  ];

  const genres = ['Action', 'Drama', 'Comedy', 'Sci-Fi', 'Sports', 'Mythology', 'Horror'];
  const languages = ['Hindi', 'English', 'Telugu', 'Tamil'];

  const handleGetRecommendation = async () => {
    setLoadingRec(true);
    setRecommendationResult('');
    try {
      const res = await api.getAiRecommendation({
        query: customQuery || `I want a movie matching ${mood}`,
        mood,
        genre,
        language,
      });
      setRecommendationResult(res.recommendation);
    } catch {
      setRecommendationResult(
        "🍿 Check out **F1: The Apex Pursuit** or **Sitaare Zameen Par**! Both are garnering 4.8+ ratings and incredible audience buzz."
      );
    } finally {
      setLoadingRec(false);
    }
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || loadingChat) return;

    const userText = inputMsg.trim();
    setInputMsg('');
    const prevHistory = messages;
    setMessages([...prevHistory, { role: 'user', content: userText }]);
    setLoadingChat(true);

    try {
      const res = await api.chatWithAi(userText, prevHistory);
      if (res && res.reply) {
        setMessages([
          ...prevHistory,
          { role: 'user', content: userText },
          { role: 'assistant', content: res.reply },
        ]);
      } else {
        throw new Error('Empty response');
      }
    } catch {
      setMessages([
        ...prevHistory,
        { role: 'user', content: userText },
        {
          role: 'assistant',
          content: "🎬 I'm having a brief intermission! Feel free to ask me about showtimes, popcorn combos, or top trending movies!",
        },
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 680, padding: 28 }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #e50914, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)',
            }}>
              <SparklesIcon size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>CineBot AI Concierge</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Powered by Google Gemini 3.1 Flash & CineVerse Intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6 }}
          >
            <XIcon size={22} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 10 }}>
          <button
            onClick={() => setTab('recommend')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: tab === 'recommend' ? 'var(--accent-red)' : 'transparent',
              color: tab === 'recommend' ? 'white' : 'var(--text-secondary)',
            }}
          >
            🎯 Movie Recommender
          </button>
          <button
            onClick={() => setTab('chat')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: tab === 'chat' ? 'var(--accent-red)' : 'transparent',
              color: tab === 'chat' ? 'white' : 'var(--text-secondary)',
            }}
          >
            💬 Interactive Chat
          </button>
        </div>

        {/* TAB 1: Movie Recommender */}
        {tab === 'recommend' && (
          <div>
            {/* Mood selector */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
                1. What's your vibe today?
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {moods.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      border: mood === m ? '1px solid var(--accent-red)' : '1px solid var(--border-subtle)',
                      backgroundColor: mood === m ? 'rgba(229, 9, 20, 0.2)' : 'var(--bg-card)',
                      color: mood === m ? '#ff4d58' : 'var(--text-secondary)',
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Genre & Language */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
                  2. Preferred Genre (Optional)
                </label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {genres.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGenre(genre === g ? '' : g)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        border: genre === g ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                        backgroundColor: genre === g ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-card)',
                        color: genre === g ? 'var(--accent-gold)' : 'var(--text-muted)',
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
                  3. Language (Optional)
                </label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {languages.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLanguage(language === l ? '' : l)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        border: language === l ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                        backgroundColor: language === l ? 'rgba(6, 182, 212, 0.2)' : 'var(--bg-card)',
                        color: language === l ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom request text input */}
            <div style={{ marginBottom: 16 }}>
              <input
                type="text"
                placeholder="Or type anything, e.g. 'Exciting movie like Top Gun' or 'Heartfelt family film'..."
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'white',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>

            <button
              onClick={handleGetRecommendation}
              disabled={loadingRec}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px 0',
                background: 'linear-gradient(135deg, #e50914, #7c3aed)',
                fontWeight: 700,
              }}
            >
              <SparklesIcon size={18} />
              {loadingRec ? 'Consulting CineBot AI...' : 'Ask CineBot for Movie Recommendations'}
            </button>

            {/* Result Box */}
            {recommendationResult && (
              <div style={{
                marginTop: 20,
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                padding: 16,
                border: '1px solid rgba(139, 92, 246, 0.3)',
                whiteSpace: 'pre-line',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                animation: 'fadeIn 0.3s ease-out',
              }}>
                {recommendationResult}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Conversational Live Chat */}
        {tab === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: 420 }}>
            {/* Messages box */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    backgroundColor: m.role === 'user' ? 'var(--accent-red)' : 'var(--bg-card)',
                    color: 'white',
                    padding: '10px 14px',
                    borderRadius: 12,
                    fontSize: '0.88rem',
                    lineHeight: 1.4,
                    border: m.role === 'assistant' ? '1px solid var(--border-subtle)' : 'none',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {m.content}
                </div>
              ))}
              {loadingChat && (
                <div style={{
                  alignSelf: 'flex-start',
                  backgroundColor: 'var(--bg-card)',
                  padding: '8px 14px',
                  borderRadius: 12,
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                }}>
                  CineBot is thinking... 🎬
                </div>
              )}
            </div>

            {/* Chat input */}
            <form onSubmit={handleSendChat} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <input
                type="text"
                placeholder="Ask CineBot anything about movies, snacks, seats..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  color: 'white',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={loadingChat || !inputMsg.trim()}
                className="btn btn-primary"
                style={{ borderRadius: 'var(--radius-full)', padding: '10px 20px' }}
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
