export default function Card(value, code, image, suit) {
  this.code = code;
  this.image = image;
  this.value = value;
  this.suit = suit;
  this.isFlipped = false;
}

Card.prototype.flip = function () {
  this.isFlipped = !this.isFlipped;
};
