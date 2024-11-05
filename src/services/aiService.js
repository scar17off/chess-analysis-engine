import { getValidMoves } from '../utils/moveValidation';

export const makeAIMove = (currentBoard, depth = 3) => {
  // Find all valid moves for black pieces
  const possibleMoves = [];
  currentBoard.forEach((row, y) => {
    row.forEach((piece, x) => {
      if (piece && piece.charCodeAt(0) >= 9818) { // Black pieces
        const validMoves = getValidMoves(currentBoard, { x, y });
        validMoves.forEach(to => {
          possibleMoves.push({
            from: { x, y },
            to,
            piece,
            evaluation: evaluateMove(currentBoard, { x, y }, to, depth)
          });
        });
      }
    });
  });

  // Sort moves by evaluation and pick one of the top 3 moves randomly
  if (possibleMoves.length > 0) {
    possibleMoves.sort((a, b) => b.evaluation - a.evaluation);
    const topMoves = possibleMoves.slice(0, Math.min(3, possibleMoves.length));
    const selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)];
    
    const newBoard = currentBoard.map(row => [...row]);
    newBoard[selectedMove.to.y][selectedMove.to.x] = newBoard[selectedMove.from.y][selectedMove.from.x];
    newBoard[selectedMove.from.y][selectedMove.from.x] = null;

    return {
      board: newBoard,
      move: {
        from: selectedMove.from,
        to: selectedMove.to,
        piece: selectedMove.piece
      }
    };
  }
  return { board: currentBoard, move: null };
};

const evaluateMove = (board, from, to, depth = 3) => {
  let score = 0;
  const pieceValues = {
    '♙': -1, '♘': -3, '♗': -3.2, '♖': -5, '♕': -9, '♔': 0,
    '♟': 1, '♞': 3, '♝': 3.2, '♜': 5, '♛': 9, '♚': 0
  };

  // Capture value
  if (board[to.y][to.x]) {
    score += pieceValues[board[to.y][to.x]] * 2; // Prioritize captures
  }

  // Center control
  const centerValue = 0.1;
  if (to.x >= 3 && to.x <= 4 && to.y >= 3 && to.y <= 4) {
    score += centerValue;
  }

  // Random factor scaled by depth (less randomness at higher depths)
  const randomScale = 1 / Math.max(1, depth);
  score += (Math.random() * 0.2 - 0.1) * randomScale;

  return score;
}; 