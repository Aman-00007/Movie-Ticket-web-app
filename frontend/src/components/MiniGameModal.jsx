import React, { useState, useEffect, useRef } from 'react';
import { XIcon, GamepadIcon, PopcornIcon } from './Icons';

export const MiniGameModal = ({ onClose }) => {
  const [activeGame, setActiveGame] = useState('popcorn'); // 'popcorn' | 'trivia'

  // Popcorn Game State
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [couponUnlocked, setCouponUnlocked] = useState(false);
  const canvasRef = useRef(null);
  const bucketXRef = useRef(160);
  const animationFrameRef = useRef(null);

  // Trivia Game State
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [triviaScore, setTriviaScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [triviaFinished, setTriviaFinished] = useState(false);

  const triviaQuestions = [
    {
      q: 'Which actor stars as Coach in the sports drama "Sitaare Zameen Par"?',
      options: ['Shah Rukh Khan', 'Aamir Khan', 'Salman Khan', 'Ranbir Kapoor'],
      ans: 1,
    },
    {
      q: 'In the blockbuster "F1: The Apex Pursuit", what is the name of Brad Pitt\'s fictional team?',
      options: ['Ferrari', 'Red Bull', 'APXGP', 'McLaren'],
      ans: 2,
    },
    {
      q: 'What is the highest format screen available at CineVerse IMAX?',
      options: ['720p', 'IMAX with Laser & Dolby Atmos', 'Standard 35mm', 'VHS Tape'],
      ans: 1,
    },
    {
      q: 'Which movie features the legendary devotion to Lord Shiva with an ensemble cast?',
      options: ['Kannappa', 'Housefull 5', 'M3GAN 2.0', 'F1'],
      ans: 0,
    },
  ];

  // Popcorn Catch Game Engine
  useEffect(() => {
    if (activeGame !== 'popcorn' || !isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    let localScore = 0;
    let localGameOver = false;
    let items = [];
    let spawnTimer = 0;
    const bucketWidth = 60;
    const bucketHeight = 25;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      bucketXRef.current = Math.max(0, Math.min(width - bucketWidth, mouseX - bucketWidth / 2));
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const touchX = e.touches[0].clientX - rect.left;
        bucketXRef.current = Math.max(0, Math.min(width - bucketWidth, touchX - bucketWidth / 2));
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);

    const loop = () => {
      if (localGameOver) return;

      // Clear canvas
      ctx.fillStyle = '#0f121b';
      ctx.fillRect(0, 0, width, height);

      // Spawn falling kernels
      spawnTimer++;
      if (spawnTimer % 35 === 0) {
        const isChilli = Math.random() < 0.25;
        items.push({
          x: Math.random() * (width - 30) + 15,
          y: -10,
          speed: Math.random() * 2 + 2.5 + localScore * 0.1,
          isChilli,
          size: isChilli ? 18 : 16,
        });
      }

      // Draw Bucket
      const bX = bucketXRef.current;
      const bY = height - bucketHeight - 10;
      ctx.fillStyle = '#e50914';
      ctx.fillRect(bX, bY, bucketWidth, bucketHeight);
      ctx.fillStyle = '#fff';
      ctx.font = '10px Outfit, sans-serif';
      ctx.fillText('🍿 CINE', bX + 12, bY + 16);

      // Update & Draw Items
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        it.y += it.speed;

        // Draw item
        if (it.isChilli) {
          ctx.fillStyle = '#ff1f2d';
          ctx.beginPath();
          ctx.arc(it.x, it.y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#10b981';
          ctx.fillRect(it.x - 2, it.y - 12, 4, 6);
        } else {
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(it.x, it.y, 7, 0, Math.PI * 2);
          ctx.arc(it.x + 5, it.y - 3, 6, 0, Math.PI * 2);
          ctx.arc(it.x - 4, it.y - 2, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Collision with bucket
        if (
          it.y + 10 >= bY &&
          it.y - 10 <= bY + bucketHeight &&
          it.x >= bX - 5 &&
          it.x <= bX + bucketWidth + 5
        ) {
          if (it.isChilli) {
            localGameOver = true;
            setGameOver(true);
            setIsPlaying(false);
            return;
          } else {
            localScore += 1;
            setScore(localScore);
            if (localScore >= 10) setCouponUnlocked(true);
            items.splice(i, 1);
            continue;
          }
        }

        // Missed bottom
        if (it.y > height + 20) {
          items.splice(i, 1);
        }
      }

      // Draw current score on canvas
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(`Score: ${localScore}`, 10, 20);

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [activeGame, isPlaying]);

  const startPopcornGame = () => {
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  const handleTriviaAnswer = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);

    const isCorrect = index === triviaQuestions[triviaIndex].ans;
    if (isCorrect) setTriviaScore((s) => s + 1);

    setTimeout(() => {
      if (triviaIndex + 1 < triviaQuestions.length) {
        setTriviaIndex((i) => i + 1);
        setSelectedAnswer(null);
      } else {
        setTriviaFinished(true);
      }
    }, 1200);
  };

  const restartTrivia = () => {
    setTriviaIndex(0);
    setTriviaScore(0);
    setSelectedAnswer(null);
    setTriviaFinished(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 640, padding: 28 }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #f59e0b, #e50914)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <GamepadIcon size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Cinema Arcade & Mini-Games</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Bored waiting for your show? Play & win real ticket discounts!
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

        {/* Game Tab switcher */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 10 }}>
          <button
            onClick={() => setActiveGame('popcorn')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: activeGame === 'popcorn' ? 'var(--accent-red)' : 'transparent',
              color: activeGame === 'popcorn' ? 'white' : 'var(--text-secondary)',
            }}
          >
            🍿 Popcorn Catch Arcade
          </button>
          <button
            onClick={() => setActiveGame('trivia')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: activeGame === 'trivia' ? 'var(--accent-red)' : 'transparent',
              color: activeGame === 'trivia' ? 'white' : 'var(--text-secondary)',
            }}
          >
            🎬 Movie Trivia Quiz
          </button>
        </div>

        {/* GAME 1: Popcorn Catch */}
        {activeGame === 'popcorn' && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
              Move bucket with mouse/finger! Catch falling Golden Popcorn (+1) & avoid Red Chillies!
            </p>

            <div style={{
              width: 360,
              height: 380,
              margin: '0 auto',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '2px solid var(--border-subtle)',
              position: 'relative',
              backgroundColor: '#0f121b',
            }}>
              <canvas
                ref={canvasRef}
                width={360}
                height={380}
                style={{ width: '100%', height: '100%', display: 'block' }}
              />

              {!isPlaying && !gameOver && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(15, 18, 27, 0.88)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 20,
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>🍿</div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>Popcorn Catcher</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
                    Score 10+ points to unlock a 20% Discount Coupon!
                  </p>
                  <button onClick={startPopcornGame} className="btn btn-primary" style={{ padding: '10px 28px' }}>
                    Start Game 🎮
                  </button>
                </div>
              )}

              {gameOver && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(15, 18, 27, 0.92)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 20,
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>💥</div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-red)', marginBottom: 4 }}>
                    Ouch! You hit a spicy chilli!
                  </h3>
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>
                    Your Score: {score}
                  </p>
                  {couponUnlocked && (
                    <div style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid #10b981',
                      borderRadius: 8,
                      padding: '8px 16px',
                      color: '#10b981',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      marginBottom: 16,
                    }}>
                      🎉 You unlocked coupon code: <strong>CINE20</strong> (20% OFF)!
                    </div>
                  )}
                  <button onClick={startPopcornGame} className="btn btn-primary">
                    Play Again 🔄
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* GAME 2: Movie Trivia Challenge */}
        {activeGame === 'trivia' && (
          <div>
            {!triviaFinished ? (
              <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: 24, border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>Question {triviaIndex + 1} of {triviaQuestions.length}</span>
                  <span>Score: {triviaScore}</span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 20 }}>
                  {triviaQuestions[triviaIndex].q}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {triviaQuestions[triviaIndex].options.map((opt, idx) => {
                    let btnColor = 'var(--bg-secondary)';
                    let border = '1px solid var(--border-subtle)';

                    if (selectedAnswer !== null) {
                      if (idx === triviaQuestions[triviaIndex].ans) {
                        btnColor = 'rgba(16, 185, 129, 0.2)';
                        border = '1px solid #10b981';
                      } else if (idx === selectedAnswer) {
                        btnColor = 'rgba(229, 9, 20, 0.2)';
                        border = '1px solid #e50914';
                      }
                    }

                    return (
                      <button
                        key={opt}
                        onClick={() => handleTriviaAnswer(idx)}
                        disabled={selectedAnswer !== null}
                        style={{
                          padding: '12px 16px',
                          borderRadius: 8,
                          backgroundColor: btnColor,
                          border,
                          color: 'white',
                          textAlign: 'left',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          cursor: selectedAnswer !== null ? 'default' : 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>🏆</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>Trivia Completed!</h3>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                  You scored {triviaScore} out of {triviaQuestions.length}!
                </p>
                <div style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid #f59e0b',
                  borderRadius: 8,
                  padding: '10px 16px',
                  color: 'var(--accent-gold)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  maxWidth: 360,
                  margin: '0 auto 20px',
                }}>
                  🎉 Use code <strong>FIRST50</strong> for 50% discount on your first booking!
                </div>
                <button onClick={restartTrivia} className="btn btn-secondary">
                  Play Again 🔄
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
