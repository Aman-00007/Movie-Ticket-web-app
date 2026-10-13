/**
 * CineVerse Beverage & Concession Model
 */

export class BeverageModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.name = data.name || 'Concession Item';
    this.category = data.category || 'snacks';
    this.price = parseFloat(data.price) || 200;
    this.image_url = data.image_url || 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&auto=format&fit=crop&q=80';
    this.description = data.description || '';
  }

  get formattedPrice() {
    return `₹${this.price.toFixed(0)}`;
  }

  static fromArray(list = []) {
    return list.map((item) => new BeverageModel(item));
  }
}
