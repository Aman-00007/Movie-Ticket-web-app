import React, { useState, useEffect, useRef } from 'react';
import { XIcon, GamepadIcon, PopcornIcon } from './Icons';

const FALLBACK_DIRECTORS = [
  'Nitesh Tiwari',
  'Prasanth Varma',
  'Abhishek Pathak',
  'Deepak Shivdasani',
  'Lokesh Kanagaraj',
  'Geetu Mohandas',
  'S.S. Rajamouli',
  'Christopher Nolan',
  'Ayan Mukerji',
];

const FALLBACK_ACTORS = [
  'Ranbir Kapoor',
  'Yash',
  'Ajay Devgn',
  'Teja Sajja',
  'Sidharth Malhotra',
  'Tabu',
  'Sara Ali Khan',
  'Akshaye Khanna',
  'Rajinikanth',
  'Robert Downey Jr.',
  'Sai Pallavi',
  'Pankaj Tripathi',
];

const FALLBACK_GENRES = [
  'Mythological Action',
  'Mystery & Thriller',
  'Crime Drama',
  'Supernatural Horror',
  'Sci-Fi Adventure',
  'Animated Epic',
];

const STATIC_2026_TRIVIA = [
  {
    q: 'Who directs the monumental 2026 mythological adaptation "Ramayana: Part 1"?',
    options: ['Nitesh Tiwari', 'S.S. Rajamouli', 'Prasanth Varma', 'Sanjay Leela Bhansali'],
    ans: 0,
    category: '2026 Directors',
  },
  {
    q: 'Which actor portrays the formidable role of Ravana in "Ramayana: Part 1" (2026)?',
    options: ['Yash (KGF Star)', 'Ranbir Kapoor', 'Prabhas', 'Vijay Sethupathi'],
    ans: 0,
    category: 'Star Cast',
  },
  {
    q: 'In the 2026 sequel "Drishyam The Conclusion", which actor leads as Vijay Salgaonkar?',
    options: ['Ajay Devgn', 'Mohanlal', 'Akshay Kumar', 'Suniel Shetty'],
    ans: 0,
    category: 'Lead Roles',
  },
  {
    q: 'Which actor awakens the divine power of Lord Hanuman in the 2026 film "Hanuman Ansh"?',
    options: ['Teja Sajja', 'Ram Charan', 'Vijay Deverakonda', 'Allu Arjun'],
    ans: 0,
    category: 'Superhero & Myth',
  },
  {
    q: 'What sound system powers CineVerse IMAX for genuine 360° three-dimensional audio?',
    options: ['Dolby Atmos Multichannel', 'Standard Stereo 2.0', 'Mono Speaker', 'FM Radio Frequency'],
    ans: 0,
    category: 'Cinema Technology',
  },
  {
    q: 'In "The Vvaan - Force of the Forrest" (2026), who portrays the lead warrior Rudra?',
    options: ['Sidharth Malhotra', 'Varun Dhawan', 'Tiger Shroff', 'Kartik Aaryan'],
    ans: 0,
    category: '2026 Action Stars',
  },
  {
    q: 'Which cinema screen format at CineVerse offers dual 4K laser projection with IMAX ratio?',
    options: ['IMAX with Laser', 'Standard 720p', 'CRT Projector', '35mm Film Reel'],
    ans: 0,
    category: 'IMAX Experience',
  },
];

const shuffleArray = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const generateDynamicTrivia = (movieList = []) => {
  const dynamicPool = [];
  const validMovies = Array.isArray(movieList) ? movieList.filter((m) => m && m.title) : [];

  // Extract all distinct directors, cast, and titles from current movie list
  const allDirectors = Array.from(
    new Set([
      ...validMovies.map((m) => m.director).filter(Boolean),
      ...FALLBACK_DIRECTORS,
    ])
  );

  const allActors = Array.from(
    new Set([
      ...validMovies.flatMap((m) => {
        if (!m.cast) return [];
        if (Array.isArray(m.cast)) {
          return m.cast.map((c) => (typeof c === 'object' && c ? c.name : String(c)));
        }
        return [String(m.cast)];
      }).filter(Boolean),
      ...FALLBACK_ACTORS,
    ])
  );

  const allTitles = Array.from(
    new Set([
      ...validMovies.map((m) => m.title).filter(Boolean),
      'Ramayana: Part 1',
      'Drishyam The Conclusion',
      'Hanuman Ansh',
      'The Vvaan - Force of the Forrest',
      'Toxic: A Fairy Tale',
    ])
  );

  // 1. Generate Director Questions from real movies
  validMovies.forEach((m) => {
    if (m.director) {
      const otherDirectors = allDirectors.filter((d) => d !== m.director);
      const distractors = shuffleArray(otherDirectors).slice(0, 3);
      const options = shuffleArray([m.director, ...distractors]);
      dynamicPool.push({
        q: `Who directed the 2026 cinema release "${m.title}"?`,
        options,
        ans: options.indexOf(m.director),
        category: 'Director Spotlight',
      });
    }

    // 2. Lead Actor / Star Questions
    let leadName = null;
    let leadRole = null;
    if (Array.isArray(m.cast) && m.cast.length > 0) {
      const first = m.cast[0];
      if (typeof first === 'object' && first !== null) {
        leadName = first.name;
        leadRole = first.role;
      } else if (typeof first === 'string') {
        leadName = first;
      }
    }

    if (leadName) {
      const otherActors = allActors.filter((a) => a !== leadName);
      const distractors = shuffleArray(otherActors).slice(0, 3);
      const options = shuffleArray([leadName, ...distractors]);
      dynamicPool.push({
        q: `Which superstar headlines the cast of "${m.title}"?`,
        options,
        ans: options.indexOf(leadName),
        category: 'Star Cast',
      });

      if (leadRole) {
        const roleOptions = shuffleArray([leadName, ...distractors]);
        dynamicPool.push({
          q: `In the 2026 film "${m.title}", which actor plays the role of ${leadRole}?`,
          options: roleOptions,
          ans: roleOptions.indexOf(leadName),
          category: 'Character Lore',
        });
      }

      // 3. Movie by Actor Question
      const otherTitles = allTitles.filter((t) => t !== m.title);
      const titleDistractors = shuffleArray(otherTitles).slice(0, 3);
      const titleOptions = shuffleArray([m.title, ...titleDistractors]);
      dynamicPool.push({
        q: `Which 2026 film features ${leadName} as a primary lead?`,
        options: titleOptions,
        ans: titleOptions.indexOf(m.title),
        category: 'Star Blockbuster',
      });
    }

    // 4. Genre questions
    const genres = Array.isArray(m.genre)
      ? m.genre
      : typeof m.genre === 'string'
        ? m.genre.split(',').map((g) => g.trim())
        : [];
    if (genres.length > 0) {
      const correctGenre = genres[0];
      const otherGenres = FALLBACK_GENRES.filter((g) => !genres.includes(g));
      const genreDistractors = shuffleArray(otherGenres).slice(0, 3);
      const genreOptions = shuffleArray([correctGenre, ...genreDistractors]);
      dynamicPool.push({
        q: `Which genre is prominently featured in "${m.title}"?`,
        options: genreOptions,
        ans: genreOptions.indexOf(correctGenre),
        category: 'Genre & Style',
      });
    }
  });

  // Combine dynamic questions with static 2026 & tech trivia pool
  const fullPool = dynamicPool.length >= 4
    ? [...dynamicPool, ...STATIC_2026_TRIVIA]
    : [...STATIC_2026_TRIVIA, ...dynamicPool];

  // Pick 4 unique questions randomly
  return shuffleArray(fullPool).slice(0, 4);
};

export const MiniGameModal = ({ onClose, onClaimReward, movies = [] }) => {
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

  // Trivia Game State - Dynamically generated from 2026 movies
  const [triviaQuestions, setTriviaQuestions] = useState(() => generateDynamicTrivia(movies));
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [triviaScore, setTriviaScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [triviaFinished, setTriviaFinished] = useState(false);

  // When live movie list loads/changes, initialize dynamic trivia
  useEffect(() => {
    if (movies && movies.length > 0 && triviaIndex === 0 && !triviaFinished) {
      setTriviaQuestions(generateDynamicTrivia(movies));
    }
  }, [movies]);

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
    if (selectedAnswer !== null || !triviaQuestions[triviaIndex]) return;
    setSelectedAnswer(index);

    const isCorrect = index === triviaQuestions[triviaIndex].ans;
    if (isCorrect) setTriviaScore((s) => s + 1);

    setTimeout(() => {
      if (triviaIndex + 1 < triviaQuestions.length) {
        setTriviaIndex((i) => i + 1);
        setSelectedAnswer(null);
      } else {
        setTriviaFinished(true);
        if (onClaimReward) onClaimReward('FIRST50');
      }
    }, 1200);
  };

  const refreshTriviaQuestions = () => {
    setTriviaQuestions(generateDynamicTrivia(movies));
    setTriviaIndex(0);
    setTriviaScore(0);
    setSelectedAnswer(null);
    setTriviaFinished(false);
  };

  const restartTrivia = () => {
    refreshTriviaQuestions();
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
            {!triviaFinished && triviaQuestions && triviaQuestions.length > 0 ? (
              <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: 24, border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>Question {triviaIndex + 1} of {triviaQuestions.length}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button
                      onClick={refreshTriviaQuestions}
                      title="Load fresh dynamic questions from 2026 cinema database"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 6,
                        padding: '4px 10px',
                        color: 'var(--text-secondary)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      🔄 New Questions
                    </button>
                    <span style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>Score: {triviaScore}</span>
                  </div>
                </div>

                {/* Dynamic Category Pill */}
                {triviaQuestions[triviaIndex]?.category && (
                  <div style={{ marginBottom: 12 }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: 12,
                      backgroundColor: 'rgba(229, 9, 20, 0.15)',
                      color: 'var(--accent-red)',
                      textTransform: 'uppercase',
                      letterSpacing: 0.8,
                    }}>
                      🎬 {triviaQuestions[triviaIndex].category}
                    </span>
                  </div>
                )}

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 20 }}>
                  {triviaQuestions[triviaIndex]?.q}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(triviaQuestions[triviaIndex]?.options || []).map((opt, idx) => {
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
                        key={`${opt}-${idx}`}
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
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button onClick={restartTrivia} className="btn btn-secondary">
                    Play Again 🔄
                  </button>
                  <button onClick={refreshTriviaQuestions} className="btn btn-primary">
                    Fresh Dynamic Quiz 🎲
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
