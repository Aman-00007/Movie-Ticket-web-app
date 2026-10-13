const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Movie, Booking } = require('../models');
const { Op } = require('sequelize');

const getGenAI = () => {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return null;
};

const getMovieContext = async () => {
  const movies = await Movie.findAll({
    where: { status: { [Op.in]: ['now_showing', 'upcoming'] } },
    limit: 20,
  });
  return movies;
};

// Fallback smart rule-based recommender when Gemini API key is not configured
const generateSmartRecommendation = (movies, query = '', mood = '', genre = '', language = '') => {
  let filtered = [...movies];

  if (genre) {
    const gLower = genre.toLowerCase();
    const matches = filtered.filter((m) =>
      (m.genre || []).some((g) => g.toLowerCase().includes(gLower))
    );
    if (matches.length > 0) filtered = matches;
  }

  if (language) {
    const lLower = language.toLowerCase();
    const matches = filtered.filter((m) =>
      (m.language || []).some((l) => l.toLowerCase().includes(lLower))
    );
    if (matches.length > 0) filtered = matches;
  }

  const moodWords = mood.toLowerCase();
  if (moodWords.includes('happy') || moodWords.includes('fun') || moodWords.includes('comedy')) {
    const comedy = filtered.filter((m) =>
      (m.genre || []).some((g) => ['Comedy', 'Animation', 'Adventure'].includes(g))
    );
    if (comedy.length > 0) filtered = comedy;
  } else if (moodWords.includes('thrill') || moodWords.includes('action')) {
    const action = filtered.filter((m) =>
      (m.genre || []).some((g) => ['Action', 'Thriller', 'Sci-Fi'].includes(g))
    );
    if (action.length > 0) filtered = action;
  }

  // Pick top 2 or 3
  const picks = filtered.slice(0, 3);
  if (picks.length === 0 && movies.length > 0) picks.push(movies[0]);

  let text = `🍿 **CineBot's Handpicked Recommendations for you:**\n\n`;
  picks.forEach((m, idx) => {
    text += `**${idx + 1}. ${m.title}** (⭐ ${m.rating || '4.5'}/5)\n`;
    text += `• **Genre:** ${(m.genre || []).join(', ')} | **Lang:** ${(m.language || []).join(', ')}\n`;
    text += `• **Why it's a match:** ${m.description ? m.description.slice(0, 140) + '...' : 'An absolute crowd favorite packed with brilliant cinematic moments!'}\n\n`;
  });
  text += `💡 *Tip: Pair your screening with large Butter Popcorn and an icy drink from our snacks counter!*`;
  return text;
};

exports.getRecommendation = async (req, res, next) => {
  try {
    const { query, mood, genre, language } = req.body;
    const movies = await getMovieContext();

    const genAI = getGenAI();
    if (!genAI) {
      const recommendation = generateSmartRecommendation(movies, query, mood, genre, language);
      return res.json({ success: true, recommendation, generated_at: new Date().toISOString(), ai_source: 'curated-engine' });
    }

    const movieContextStr = movies
      .map(
        (m) =>
          `"${m.title}" - Genre: ${(m.genre || []).join(', ')} | Rating: ${m.rating} | Duration: ${m.duration_min}min | Language: ${(m.language || []).join(', ')} | ${m.description?.slice(0, 120)}`
      )
      .join('\n');

    let userHistory = '';
    if (req.user) {
      const past = await Booking.findAll({ where: { user_id: req.user.id, status: 'confirmed' }, limit: 5 });
      if (past.length > 0) userHistory = `User has previously booked: ${past.length} movies.`;
    }

    const prompt = `You are CineBot, an enthusiastic movie recommendation assistant for CineVerse (a premier cinema ticket booking app).

Available movies:
${movieContextStr}

${userHistory}
User query: "${query || 'recommend a good movie'}"
${mood ? `Mood: ${mood}` : ''}
${genre ? `Genre: ${genre}` : ''}
${language ? `Language: ${language}` : ''}

Pick 2-3 top recommendations from the list above. Format clearly with title, rating, reason, and an engaging fun tone with emojis. Max 180 words.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ success: true, recommendation: text, generated_at: new Date().toISOString(), ai_source: 'gemini' });
  } catch (err) {
    console.error('Gemini error:', err.message);
    const movies = await getMovieContext();
    const recommendation = generateSmartRecommendation(movies, req.body?.query, req.body?.mood, req.body?.genre, req.body?.language);
    res.json({ success: true, recommendation, fallback: true });
  }
};

exports.chat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'message is required' });

    const movies = await getMovieContext();
    const genAI = getGenAI();

    if (!genAI) {
      // Smart conversational fallback
      const lower = message.toLowerCase();
      let reply = `🎬 **CineBot here!** `;
      if (lower.includes('recommend') || lower.includes('watch') || lower.includes('suggest')) {
        const top = movies[0];
        reply += `I strongly recommend checking out **${top ? top.title : 'our latest blockbuster'}**! It's trending with high ratings. Would you like action, comedy, or drama?`;
      } else if (lower.includes('ticket') || lower.includes('book') || lower.includes('seat')) {
        reply += `Booking is easy! Simply click on any movie card, pick your preferred showtime and cinema, select your seats on the interactive map, and grab some popcorn!`;
      } else if (lower.includes('popcorn') || lower.includes('snack') || lower.includes('food')) {
        reply += `Our snacks menu features Caramel Popcorn, Cheesy Nachos, Coke, and gourmet Combos! You can add them during seat booking.`;
      } else if (lower.includes('game') || lower.includes('bored')) {
        reply += `Check out our mini-game section in the navbar where you can play Popcorn Catch or Movie Trivia while you wait for your show! 🎮`;
      } else {
        reply += `I'm happy to help you with movie suggestions, showtimes, seats, and snack orders. What movie are you in the mood for today? 🍿`;
      }
      return res.json({ success: true, reply, timestamp: new Date().toISOString() });
    }

    const movieContextStr = movies
      .map((m) => `"${m.title}" (${(m.genre || []).join(', ')})`)
      .join(', ');

    const systemPrompt = `You are CineBot, CineVerse's friendly and knowledgeable cinema AI assistant. Currently in theatres at CineVerse: ${movieContextStr}. Answer helpfully, suggest movies from our collection, explain ticket booking or snacks, and keep responses engaging, concise (max 100 words), and fun with emojis.`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite',
      systemInstruction: systemPrompt,
    });

    // Sanitize history strictly for Gemini SDK ('user' and 'model' alternation)
    const validHistory = [];
    if (Array.isArray(history)) {
      for (const h of history) {
        if (!h.content || typeof h.content !== 'string') continue;
        const role = (h.role === 'assistant' || h.role === 'model') ? 'model' : 'user';
        if (validHistory.length === 0 && role !== 'user') continue;
        if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === role) continue;
        validHistory.push({ role, parts: [{ text: h.content }] });
      }
    }

    // Gemini SDK requires history to end with 'model' before chat.sendMessage adds the 'user' turn
    while (validHistory.length > 0 && validHistory[validHistory.length - 1].role === 'user') {
      validHistory.pop();
    }

    const chat = model.startChat({ history: validHistory });
    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    res.json({ success: true, reply, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('Gemini chat error:', err.message);
    res.json({
      success: true,
      reply: "🍿 I'm here! Check out our Now Showing movies like Pushpa 2, Chhaava, and Gladiator II, or ask me for top action, comedy, or thriller picks!",
    });
  }
};
