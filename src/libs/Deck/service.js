const SHUFFLE = (deck_id) =>
  `https://deckofcardsapi.com/api/deck/${deck_id || "new"}/shuffle/?deck_count=1`;

const DRAW = (deck_id, count) =>
  `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=${count}`;

export default function DeckService() {}

DeckService.prototype.shuffle = async function (deck_id) {
  try {
    const response = await fetch(SHUFFLE(deck_id));

    if (!response.ok) {
      throw new Error("DeckService.prototype.shuffle response not ok");
    }

    const payload = await response.json();

    if (!payload.success) {
      throw new Error("DeckService.prototype.shuffle success false");
    }

    return payload;
  } catch (error) {
    console.error(error);
  }
};

DeckService.prototype.draw = async function (deck_id, count) {
  try {
    const response = await fetch(DRAW(deck_id, count));

    if (!response.ok) {
      throw new Error("DeckService.prototype.draw response not ok");
    }

    const payload = await response.json();

    if (!payload.success) {
      throw new Error("DeckService.prototype.shuffle success false");
    }

    return payload;
  } catch (error) {
    console.error(error);
  }
};
