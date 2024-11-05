import { openingBook, getMoveHistoryKey, boardToNotation } from './openingBook';
import { 
  faGem, 
  faStar, 
  faThumbsUp, 
  faCheck, 
  faBook, 
  faExclamationTriangle, 
  faTimesCircle, 
  faBomb,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';

export const MoveQuality = {
  BRILLIANT: { name: 'Brilliant', icon: faGem, color: '#33c088' },
  GREAT: { name: 'Great', icon: faStar, color: '#33c088' },
  BEST: { name: 'Best', icon: faStar, color: '#33c088' },
  EXCELLENT: { name: 'Excellent', icon: faThumbsUp, color: '#33c088' },
  GOOD: { name: 'Good', icon: faCheck, color: '#33c088' },
  BOOK: { name: 'Book', icon: faBook, color: '#a88865' },
  INACCURACY: { name: 'Inaccuracy', icon: faExclamationTriangle, color: '#f0c15c' },
  MISTAKE: { name: 'Mistake', icon: faTimesCircle, color: '#f0856c' },
  MISS: { name: 'Miss', icon: faQuestionCircle, color: '#f0856c' },
  BLUNDER: { name: 'Blunder', icon: faBomb, color: '#f0856c' }
};

const PIECE_VALUES = {
  '♙': 1, '♘': 3, '♗': 3.2, '♖': 5, '♕': 9, '♔': 0,
  '♟': -1, '♞': -3, '♝': -3.2, '♜': -5, '♛': -9, '♚': 0
};

const isInCenter = (pos) => {
  return pos.x >= 3 && pos.x <= 4 && pos.y >= 3 && pos.y <= 4;
};

const isPieceDeveloped = (piece, pos) => {
  if (piece === '♘' || piece === '♞') {
    return pos.y !== 0 && pos.y !== 7;
  }
  if (piece === '♗' || piece === '♝') {
    return pos.y !== 0 && pos.y !== 7;
  }
  return false;
};

const isCastlingMove = (piece, from, to) => {
  return (piece === '♔' || piece === '♚') && Math.abs(to.x - from.x) === 2;
};

export const evaluateMove = (previousEval, newEval, moveInfo) => {
  const { piece, from, to, board, isCheck, isCheckmate, moveNumber, moveHistory = [] } = moveInfo;

  // Check if it's a book move
  const isBookMove = checkIfBookMove(moveHistory, from, to);
  if (isBookMove) {
    return {
      ...MoveQuality.BOOK,
      isBookMove: true,
      openingName: isBookMove.name
    };
  }

  const evalDiff = previousEval - newEval;
  let score = 0;

  // Early game considerations (first 10 moves)
  if (moveNumber <= 10) {
    if (isPieceDeveloped(piece, to) && !isPieceDeveloped(piece, from)) {
      score += 0.3;
    }
    if (isInCenter(to)) {
      score += 0.2;
    }
    if (isCastlingMove(piece, from, to)) {
      score += 0.5;
    }
  }

  // Capture evaluation
  if (board[to.y][to.x]) {
    const capturedValue = Math.abs(PIECE_VALUES[board[to.y][to.x]]);
    const attackerValue = Math.abs(PIECE_VALUES[piece]);
    
    // Good trade
    if (capturedValue > attackerValue) {
      score += 0.4;
    }
    // Equal trade
    else if (capturedValue === attackerValue) {
      score += 0.2;
    }
    // Bad trade
    else {
      score -= 0.2;
    }
  }

  // Check/Checkmate bonus
  if (isCheckmate) {
    score += 2;
  } else if (isCheck) {
    score += 0.3;
  }

  // Combine positional score with evaluation difference
  const totalScore = score - evalDiff;

  // Get the quality based on total score
  const quality = getQualityFromScore(totalScore);
  return {
    ...quality,
    isBookMove: false
  };
};

const checkIfBookMove = (moveHistory, from, to) => {
  // Convert current move to notation
  const currentMove = boardToNotation(from, to);
  
  // Get the history key up to the current move
  const historyKey = getMoveHistoryKey(moveHistory);
  
  // Check if this position exists in the opening book
  const bookPosition = openingBook[historyKey];
  if (bookPosition && bookPosition.moves.includes(currentMove)) {
    return {
      isBook: true,
      name: bookPosition.name
    };
  }

  // Check if this is the start of a new opening
  const newPositionKey = historyKey ? `${historyKey} ${currentMove}` : currentMove;
  if (openingBook[newPositionKey]) {
    return {
      isBook: true,
      name: openingBook[newPositionKey].name
    };
  }

  return false;
};

const getQualityFromScore = (totalScore) => {
  if (totalScore >= 1.5) return MoveQuality.BRILLIANT;
  if (totalScore >= 1.0) return MoveQuality.GREAT;
  if (totalScore >= 0.7) return MoveQuality.BEST;
  if (totalScore >= 0.4) return MoveQuality.EXCELLENT;
  if (totalScore >= 0.1) return MoveQuality.GOOD;
  if (totalScore >= -0.1) return MoveQuality.BOOK;
  if (totalScore >= -0.3) return MoveQuality.INACCURACY;
  if (totalScore >= -0.7) return MoveQuality.MISTAKE;
  if (totalScore >= -1.0) return MoveQuality.MISS;
  return MoveQuality.BLUNDER;
};

// Helper function to detect forced moves
export const isForcedMove = (board, validMoves) => {
  return validMoves.length === 1;
};

// Helper function to detect if a move is a sacrifice
export const isSacrifice = (board, from, to, depth = 3) => {
  const piece = board[from.y][from.x];
  const pieceValue = Math.abs(PIECE_VALUES[piece]);
  const capturedPiece = board[to.y][to.x];
  const capturedValue = capturedPiece ? Math.abs(PIECE_VALUES[capturedPiece]) : 0;

  return pieceValue > capturedValue;
}; 