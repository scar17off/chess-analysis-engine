// Common chess openings with their first few moves
export const openingBook = {
  // Ruy Lopez and variations
  'e2e4 e7e5 g1f3 b8c6 f1b5': {
    name: 'Ruy Lopez',
    moves: ['a7a6', 'b5a4', 'g8f6', 'c7c5', 'e8g8']
  },
  'e2e4 e7e5 g1f3 b8c6 f1b5 a7a6': {
    name: 'Ruy Lopez, Morphy Defense',
    moves: ['b5a4', 'g8f6', 'e8g8', 'f1e1']
  },

  // Italian Game and variations
  'e2e4 e7e5 g1f3 b8c6 f1c4': {
    name: 'Italian Game',
    moves: ['f8c5', 'g8f6', 'c7c6', 'd7d6']
  },
  'e2e4 e7e5 g1f3 b8c6 f1c4 f8c5': {
    name: 'Giuoco Piano',
    moves: ['c2c3', 'g8f6', 'd2d4', 'e5d4']
  },
  'e2e4 e7e5 g1f3 b8c6 f1c4 g8f6': {
    name: 'Italian Game, Two Knights Defense',
    moves: ['d2d4', 'e5d4', 'e4e5', 'd7d5']
  },

  // Sicilian Defense and variations
  'e2e4 c7c5': {
    name: 'Sicilian Defense',
    moves: ['g1f3', 'd7d6', 'd2d4', 'b8c6', 'b1c3']
  },
  'e2e4 c7c5 g1f3 d7d6': {
    name: 'Sicilian Defense, Old Sicilian',
    moves: ['d2d4', 'c5d4', 'f3d4', 'g8f6']
  },
  'e2e4 c7c5 g1f3 b8c6': {
    name: 'Sicilian Defense, Open Sicilian',
    moves: ['d2d4', 'c5d4', 'f3d4', 'g8f6']
  },

  // French Defense and variations
  'e2e4 e7e6': {
    name: 'French Defense',
    moves: ['d2d4', 'd7d5', 'b1c3', 'g8f6']
  },
  'e2e4 e7e6 d2d4 d7d5': {
    name: 'French Defense, Classical',
    moves: ['b1c3', 'f8b4', 'e4e5', 'c7c5']
  },

  // Caro-Kann and variations
  'e2e4 c7c6': {
    name: 'Caro-Kann Defense',
    moves: ['d2d4', 'd7d5', 'b1c3', 'd5e4']
  },
  'e2e4 c7c6 d2d4 d7d5': {
    name: 'Caro-Kann, Classical Variation',
    moves: ['b1c3', 'd5e4', 'c3e4', 'b8d7']
  },

  // King's Indian Defense and variations
  'd2d4 g8f6 c2c4': {
    name: "King's Indian Defense",
    moves: ['g7g6', 'b1c3', 'f8g7', 'e2e4']
  },
  'd2d4 g8f6 c2c4 g7g6': {
    name: "King's Indian Defense, Main Line",
    moves: ['b1c3', 'f8g7', 'e2e4', 'd7d6']
  },

  // Queen's Gambit and variations
  'd2d4 d7d5 c2c4': {
    name: "Queen's Gambit",
    moves: ['e7e6', 'c7c6', 'd5c4', 'g8f6']
  },
  'd2d4 d7d5 c2c4 e7e6': {
    name: "Queen's Gambit Declined",
    moves: ['b1c3', 'g8f6', 'c4d5', 'e6d5']
  },
  'd2d4 d7d5 c2c4 c7c6': {
    name: "Queen's Gambit, Slav Defense",
    moves: ['g1f3', 'g8f6', 'b1c3', 'd5c4']
  },

  // English Opening and variations
  'c2c4': {
    name: 'English Opening',
    moves: ['e7e5', 'g8f6', 'b8c6', 'g7g6']
  },
  'c2c4 e7e5': {
    name: 'English Opening, Reversed Sicilian',
    moves: ['b1c3', 'g8f6', 'g2g3', 'f8b4']
  },

  // Scandinavian Defense
  'e2e4 d7d5': {
    name: 'Scandinavian Defense',
    moves: ['e4d5', 'd8d5', 'b1c3', 'd5a5']
  },

  // Pirc Defense
  'e2e4 d7d6': {
    name: 'Pirc Defense',
    moves: ['d2d4', 'g8f6', 'b1c3', 'g7g6']
  },

  // Modern Defense
  'e2e4 g7g6': {
    name: 'Modern Defense',
    moves: ['d2d4', 'f8g7', 'b1c3', 'd7d6']
  },

  // Dutch Defense
  'd2d4 f7f5': {
    name: 'Dutch Defense',
    moves: ['g2g3', 'g8f6', 'f1g2', 'e7e6']
  },

  // Ruy Lopez variations
  'e2e4 e7e5 g1f3 b8c6 f1b5 a7a6 b5a4 g8f6 e1g1': {
    name: 'Ruy Lopez, Closed Variation',
    moves: ['f8e7', 'f1e1', 'b7b5', 'a4b3']
  },
  'e2e4 e7e5 g1f3 b8c6 f1b5 a7a6 b5a4 b7b5': {
    name: 'Ruy Lopez, Marshall Attack',
    moves: ['a4b3', 'c7c5', 'c2c3', 'd7d5']
  },

  // Sicilian variations
  'e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3': {
    name: 'Sicilian Defense, Najdorf Variation',
    moves: ['a7a6', 'f2f4', 'e7e5', 'g2g3']
  },
  'e2e4 c7c5 g1f3 e7e6 d2d4 c5d4 f3d4 a7a6': {
    name: 'Sicilian Defense, Kan Variation',
    moves: ['b1c3', 'b7b5', 'f1d3', 'b8c6']
  },
  'e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3 e7e6': {
    name: 'Sicilian Defense, Scheveningen Variation',
    moves: ['f1e2', 'a7a6', 'f2f4', 'b8c6']
  },

  // French Defense variations
  'e2e4 e7e6 d2d4 d7d5 b1c3 b8c6': {
    name: 'French Defense, Winawer Variation',
    moves: ['f1b5', 'g8e7', 'b5c6', 'b7c6']
  },
  'e2e4 e7e6 d2d4 d7d5 b1d2': {
    name: 'French Defense, Tarrasch Variation',
    moves: ['g8f6', 'e4e5', 'f6d7', 'f1d3']
  },

  // King's Indian variations
  'd2d4 g8f6 c2c4 g7g6 b1c3 f8g7 e2e4 d7d6 g1f3': {
    name: "King's Indian Defense, Classical Variation",
    moves: ['e8g8', 'f1e2', 'e7e5', 'e1g1']
  },
  'd2d4 g8f6 c2c4 g7g6 b1c3 f8g7 e2e4 d7d6 f2f3': {
    name: "King's Indian Defense, Sämisch Variation",
    moves: ['e8g8', 'f1e3', 'b8c6', 'c1e3']
  },

  // Queen's Gambit variations
  'd2d4 d7d5 c2c4 e7e6 b1c3 g8f6 c4d5': {
    name: "Queen's Gambit, Exchange Variation",
    moves: ['e6d5', 'g1f3', 'f8d6', 'f1g5']
  },
  'd2d4 d7d5 c2c4 c7c6 g1f3 g8f6 b1c3 e7e6': {
    name: "Queen's Gambit, Semi-Slav Defense",
    moves: ['e2e3', 'b8d7', 'f1d3', 'f8d6']
  },

  // Nimzo-Indian Defense variations
  'd2d4 g8f6 c2c4 e7e6 b1c3 f8b4': {
    name: 'Nimzo-Indian Defense',
    moves: ['e2e3', 'e8g8', 'f1d3', 'd7d5']
  },
  'd2d4 g8f6 c2c4 e7e6 b1c3 f8b4 a2a3': {
    name: 'Nimzo-Indian Defense, Sämisch Variation',
    moves: ['b4c3', 'b2c3', 'c7c5', 'e2e3']
  },

  // Grünfeld Defense variations
  'd2d4 g8f6 c2c4 g7g6 b1c3 d7d5': {
    name: 'Grünfeld Defense',
    moves: ['c4d5', 'f6d5', 'e2e4', 'd5c3']
  },
  'd2d4 g8f6 c2c4 g7g6 b1c3 d7d5 g1f3': {
    name: 'Grünfeld Defense, Exchange Variation',
    moves: ['f8g7', 'c4d5', 'f6d5', 'e2e4']
  },

  // Benoni Defense variations
  'd2d4 g8f6 c2c4 c7c5 d4d5': {
    name: 'Modern Benoni',
    moves: ['e7e6', 'b1c3', 'e6d5', 'c4d5']
  },
  'd2d4 g8f6 c2c4 c7c5 d4d5 e7e6 b1c3': {
    name: 'Modern Benoni, Fianchetto Variation',
    moves: ['e6d5', 'c4d5', 'd7d6', 'g2g3']
  }
};

// Convert board position to move notation
export const boardToNotation = (from, to) => {
  const files = 'abcdefgh';
  return `${files[from.x]}${8 - from.y}${files[to.x]}${8 - to.y}`;
};

// Convert move history to a string key
export const getMoveHistoryKey = (moveHistory) => {
  return moveHistory
    .map(move => boardToNotation(move.from, move.to))
    .join(' ');
}; 