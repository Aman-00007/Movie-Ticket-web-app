const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

const sendBookingConfirmation = async (user, booking) => {
  try {
    const seatList = (booking.seats || []).map((s) => `${s.row}${s.number}`).join(', ');
    const beverageList = (booking.beverages || [])
      .map((b) => `${b.name} x${b.quantity}`)
      .join(', ') || 'None';

    const subject = `🎬 CineVerse Booking Confirmed: ${booking.booking_code}`;
    const text = `Hi ${user.name || 'Movie Lover'},\n\nYour booking #${booking.booking_code} is confirmed!\nSeats: ${seatList}\nBeverages: ${beverageList}\nTotal: ₹${booking.total_amount}\n\nEnjoy the movie at CineVerse!`;

    const transporter = createTransporter();
    if (transporter && user.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"CineVerse" <tickets@cineverse.com>',
        to: user.email,
        subject,
        text,
      });
      console.log(`[EMAIL] Confirmation sent to ${user.email}`);
    } else {
      console.log(`[EMAIL DEV MOCK] Would send booking confirmation to ${user.email || 'user'}: \n${text}`);
    }
    return true;
  } catch (err) {
    console.error('[EMAIL ERROR]', err.message);
    return false;
  }
};

module.exports = {
  sendBookingConfirmation,
};
