const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Movie, Booking } = require('../models');
const { Op } = require('sequelize');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getMovieContext = async () => {
  const movies = await Movie.findAll({ where: { status: { [Op.in]: ['now_showing', 'upcoming'] } }, limit: 30 });
  return movies.map((m) => `"${m.title}" - Genre: ${m.genre?.join(', ')} | Rating: ${m.rating} | Duration: ${m.duration_min}min | Language: ${m.language?.join(', ')} | ${m.description?.slice(0, 150)}`).join('\n');
};

exports.getRecommendation = async (req, res, next) => {
  try {
    const { query, mood, genre, language } = req.body;
    if (!query) return res.status(400).json({ success: false, message: 'Query is required' });

    const movieContext = await getMovieContext();

    // Get user's booking history for personalization
    let userHistory = '';
    if (req.user) {
      const past = await Booking.findAll({ where: { user_id: req.user.id, status: 'confirmed' }, limit: 5 });
      if (past.length > 0) userHistory = `User has previously booked: ${past.length} movies.`;
    }

    const prompt = `You are CineBot, an enthusiastic movie recommendation assistant for CineVerse (an Indian movie ticket booking platform).

Current movies available:
${movieContext}

${userHistory}

User request: "${query}"
${mood ? `Mood: ${mood}` : ''}
${genre ? `Preferred genre: ${genre}` : ''}
${language ? `Preferred language: ${language}` : ''}

Give 2-3 personalized movie recommendations. For each:
1. Movie title (must be from the list above)
2. Why it matches their request (1-2 sentences)
3. A fun movie quote or fact

Keep it fun, conversational and enthusiastic! Use emojis. Max 200 words total.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ success: true, recommendation: text, generated_at: new Date().toISOString() });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.json({ success: true, recommendation: "🎬 Sorry, I'm having a brain freeze! Try refreshing or ask me again. Our top picks right now are based on ratings and popularity - check the Now Showing section!" });
  }
};

exports.chat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'message is required' });

    const movieContext = await getMovieContext();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `You are CineBot, CineVerse's friendly AI assistant for an Indian movie ticket booking app. You help users:
- Find and recommend movies
- Explain booking process (seat selection, payment with Stripe)
- Answer movie trivia
- Suggest food/beverage pairings

Currently showing movies:
${movieContext}

Keep answers short (max 100 words), friendly and use emojis. Don't make up movies not in the list.`;

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: "🎬 Hi! I'm CineBot! Ready to help you pick the perfect movie or guide your booking. What can I do for you?" }] },
        ...history.map((h) => ({ role: h.role, parts: [{ text: h.content }] })),
      ],
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    res.json({ success: true, reply, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('Gemini chat error:', err.message);
    res.json({ success: true, reply: "🤖 I'm having a moment! Please try again. In the meantime, check our trending movies section!" });
  }
};
