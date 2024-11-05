export const isValidMove = (board, from, to) => {
  const piece = board[from.y][from.x];
  if (!piece) return false;
  
  // Can't capture own pieces
  if (board[to.y][to.x] && 
      isPieceWhite(piece) === isPieceWhite(board[to.y][to.x])) {
    return false;
  }

  const pieceType = getPieceType(piece);
  switch (pieceType) {
    case 'pawn': return isValidPawnMove(board, from, to);
    case 'rook': return isValidRookMove(board, from, to);
    case 'knight': return isValidKnightMove(board, from, to);
    case 'bishop': return isValidBishopMove(board, from, to);
    case 'queen': return isValidQueenMove(board, from, to);
    case 'king': return isValidKingMove(board, from, to);
    default: return false;
  }
};

export const isPieceWhite = (piece) => {
  return piece.charCodeAt(0) >= 9812 && piece.charCodeAt(0) <= 9817;
};

const getPieceType = (piece) => {
  const whitePieces = '♔♕♖♗♘♙';
  const blackPieces = '♚♛♜♝♞♟';
  const index = whitePieces.indexOf(piece) !== -1 
    ? whitePieces.indexOf(piece) 
    : blackPieces.indexOf(piece);
  
  return ['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'][index];
};

const isValidPawnMove = (board, from, to) => {
  const direction = isPieceWhite(board[from.y][from.x]) ? -1 : 1;
  const startRow = isPieceWhite(board[from.y][from.x]) ? 6 : 1;
  
  // Forward movement
  if (from.x === to.x && !board[to.y][to.x]) {
    // Single square move
    if (to.y === from.y + direction) return true;
    // Initial two square move
    if (from.y === startRow && 
        to.y === from.y + 2 * direction && 
        !board[from.y + direction][from.x]) {
      return true;
    }
  }
  
  // Capture diagonally
  if (Math.abs(to.x - from.x) === 1 && to.y === from.y + direction) {
    return board[to.y][to.x] && isPieceWhite(board[to.y][to.x]) !== isPieceWhite(board[from.y][from.x]);
  }
  
  return false;
};

const isValidRookMove = (board, from, to) => {
  if (from.x !== to.x && from.y !== to.y) return false;
  return !hasObstaclesBetween(board, from, to);
};

const isValidKnightMove = (board, from, to) => {
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
};

const isValidBishopMove = (board, from, to) => {
  if (Math.abs(to.x - from.x) !== Math.abs(to.y - from.y)) return false;
  return !hasObstaclesBetween(board, from, to);
};

const isValidQueenMove = (board, from, to) => {
  return isValidRookMove(board, from, to) || isValidBishopMove(board, from, to);
};

const isValidKingMove = (board, from, to) => {
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  return dx <= 1 && dy <= 1;
};

const hasObstaclesBetween = (board, from, to) => {
  const dx = Math.sign(to.x - from.x);
  const dy = Math.sign(to.y - from.y);
  let x = from.x + dx;
  let y = from.y + dy;
  
  while (x !== to.x || y !== to.y) {
    if (board[y][x]) return true;
    x += dx;
    y += dy;
  }
  
  return false;
};

export const getValidCoordinates = (e, canvas, CELL_SIZE) => {
  const rect = canvas.getBoundingClientRect();
  
  // Calculate the click position relative to the canvas
  const x = Math.floor((e.clientX - rect.left) / (rect.width / 8));
  const y = Math.floor((e.clientY - rect.top) / (rect.height / 8));

  if (x < 0 || x > 7 || y < 0 || y > 7) return null;
  return { x, y };
};

export const getValidMoves = (board, from) => {
  const validMoves = [];
  const piece = board[from.y][from.x];
  
  if (!piece) return validMoves;

  // Check all possible squares
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (isValidMove(board, from, { x, y })) {
        validMoves.push({ x, y });
      }
    }
  }

  return validMoves;
}; 