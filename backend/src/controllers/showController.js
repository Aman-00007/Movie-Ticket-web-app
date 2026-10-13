const { Show, Seat, Theatre, Movie } = require('../models');
const { Op, Sequelize } = require('sequelize');

// Haversine formula to calculate km distance between two geo points
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

exports.getShowSeats = async (req, res, next) => {
  try {
    const { showId } = req.params;
    const show = await Show.findByPk(showId, { include: [{ model: Movie, as: 'movie' }, { model: Theatre, as: 'theatre' }] });
    if (!show) return res.status(404).json({ success: false, message: 'Show not found' });

    // Release expired holds
    await Seat.update(
      { status: 'available', held_by: null, held_until: null },
      { where: { show_id: showId, status: 'held', held_until: { [Op.lt]: new Date() } } }
    );

    const seats = await Seat.findAll({ where: { show_id: showId }, order: [['row_label', 'ASC'], ['seat_number', 'ASC']] });
    res.json({ success: true, show, seats });
  } catch (err) {
    next(err);
  }
};

exports.getNearbyShows = async (req, res, next) => {
  try {
    const { lat, lng, radius = 20, date } = req.query;
    if (!lat || !lng) return res.status(400).json({ success: false, message: 'lat and lng are required' });

    const today = date || new Date().toISOString().split('T')[0];
    const shows = await Show.findAll({
      where: { show_date: today, is_active: true },
      include: [
        { model: Theatre, as: 'theatre', where: { is_active: true } },
        { model: Movie, as: 'movie', where: { status: 'now_showing' } },
      ],
    });

    // Filter by distance
    const nearby = shows
      .filter((s) => {
        const dist = haversine(parseFloat(lat), parseFloat(lng), parseFloat(s.theatre.latitude), parseFloat(s.theatre.longitude));
        s.dataValues.distance_km = Math.round(dist * 10) / 10;
        return dist <= parseFloat(radius);
      })
      .sort((a, b) => a.dataValues.distance_km - b.dataValues.distance_km);

    res.json({ success: true, data: nearby, count: nearby.length });
  } catch (err) {
    next(err);
  }
};

exports.createShowSeats = async (showId, totalSeats = 100) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seatsPerRow = Math.ceil(totalSeats / rows.length);
  const seats = [];

  rows.forEach((row, rowIdx) => {
    for (let n = 1; n <= seatsPerRow; n++) {
      let seat_type = 'normal';
      let price_multiplier = 1.0;
      if (rowIdx >= 8) { seat_type = 'vip'; price_multiplier = 2.0; }
      else if (rowIdx >= 6) { seat_type = 'premium'; price_multiplier = 1.5; }

      seats.push({ show_id: showId, row_label: row, seat_number: n, seat_type, price_multiplier });
    }
  });

  await Seat.bulkCreate(seats, { ignoreDuplicates: true });
};
