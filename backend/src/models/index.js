const User = require('./User');
const Movie = require('./Movie');
const Theatre = require('./Theatre');
const Show = require('./Show');
const Seat = require('./Seat');
const Booking = require('./Booking');
const Beverage = require('./Beverage');

// ─── Associations ────────────────────────────────────────────
// Movie <-> Show
Movie.hasMany(Show, { foreignKey: 'movie_id', as: 'shows' });
Show.belongsTo(Movie, { foreignKey: 'movie_id', as: 'movie' });

// Theatre <-> Show
Theatre.hasMany(Show, { foreignKey: 'theatre_id', as: 'shows' });
Show.belongsTo(Theatre, { foreignKey: 'theatre_id', as: 'theatre' });

// Show <-> Seat
Show.hasMany(Seat, { foreignKey: 'show_id', as: 'seats' });
Seat.belongsTo(Show, { foreignKey: 'show_id', as: 'show' });

// User <-> Booking
User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Show <-> Booking
Show.hasMany(Booking, { foreignKey: 'show_id', as: 'bookings' });
Booking.belongsTo(Show, { foreignKey: 'show_id', as: 'show' });

module.exports = { User, Movie, Theatre, Show, Seat, Booking, Beverage };
