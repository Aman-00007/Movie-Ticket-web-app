/**
 * CineVerse Booking Model
 * Encapsulates calculation of seat prices, taxes, convenience fees, and ticket passes.
 */

export class BookingModel {
  static CONVENIENCE_FEE_PER_TICKET = 28;
  static GST_PERCENTAGE = 0.18;

  static calculateTotals({ seats = [], show = {}, beverages = [], discount = 0 }) {
    const baseTicketPrice = show.base_price || 250;

    // Calculate seats subtotal
    const ticketSubtotal = seats.reduce((sum, seat) => {
      let multiplier = 1.0;
      if (seat.type === 'recliner') multiplier = 1.6;
      else if (seat.type === 'vip') multiplier = 1.4;
      else if (seat.type === 'premium') multiplier = 1.2;
      return sum + Math.round(baseTicketPrice * multiplier);
    }, 0);

    // Calculate beverages subtotal
    const beverageSubtotal = beverages.reduce((sum, b) => {
      return sum + (b.price * (b.quantity || 1));
    }, 0);

    // Fees & Tax
    const convenienceFees = seats.length * BookingModel.CONVENIENCE_FEE_PER_TICKET;
    const grossTotal = ticketSubtotal + beverageSubtotal + convenienceFees;
    const finalTotal = Math.max(0, grossTotal - discount);

    return {
      ticketSubtotal,
      beverageSubtotal,
      convenienceFees,
      discount,
      finalTotal,
    };
  }

  static generateBookingCode() {
    return 'CV-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  static formatSeatLabels(seats = []) {
    return seats.map((s) => s.label || `${s.row}${s.number}`).join(', ');
  }
}
