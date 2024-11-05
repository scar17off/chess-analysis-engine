export const PIECES = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙'
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟'
  }
};

export const initialBoard = [
  ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
  ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
  ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
];

export const drawBoard = (ctx, CELL_SIZE, selectedPiece, validMoves, board) => {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      // Base square color
      ctx.fillStyle = (i + j) % 2 === 0 ? '#E9EDCC' : '#779556';
      ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);

      // Highlight valid moves
      if (validMoves && validMoves.some(move => move.x === j && move.y === i)) {
        const piece = board[i][j];
        if (piece && piece.charCodeAt(0) >= 9818) { // If it's a black piece
          ctx.fillStyle = 'rgba(255, 0, 0, 0.4)'; // Red highlight for captures
          ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        } else {
          const centerX = j * CELL_SIZE + CELL_SIZE / 2;
          const centerY = i * CELL_SIZE + CELL_SIZE / 2;
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, CELL_SIZE / 4, 0, 2 * Math.PI);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
          ctx.fill();
        }
      }

      // Highlight selected piece
      if (selectedPiece && selectedPiece.x === j && selectedPiece.y === i) {
        ctx.fillStyle = 'rgba(255, 255, 0, 0.4)';
        ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
};

export const drawPieces = (ctx, board, CELL_SIZE) => {
  ctx.font = `bold ${CELL_SIZE * 0.7}px "Arial Unicode MS", "Segoe UI Symbol"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  board.forEach((row, i) => {
    row.forEach((piece, j) => {
      if (piece) {
        ctx.fillStyle = piece.charCodeAt(0) >= 9818 ? '#000000' : '#FFFFFF';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        
        ctx.fillText(
          piece,
          j * CELL_SIZE + CELL_SIZE / 2,
          i * CELL_SIZE + CELL_SIZE / 2
        );
        
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
    });
  });
}; 