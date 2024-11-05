import { isValidMove, isPieceWhite } from '../utils/moveValidation';
import { openingBook, getMoveHistoryKey } from './openingBook';
import { getEngineConfig } from './engineConfigService';

export class AnalysisService {
  constructor() {
    this.depth = 3;
    this.currentMoveIndex = 0;
    this.analyzedMoves = [];
    this.useBookMoves = true;
    this.moveHistory = [];
    this.engineMode = 'depth';
    this.engineElo = 1750;
    this.analysisTimeout = null;
  }

  setEngineConfig(mode, elo) {
    this.engineMode = mode;
    this.engineElo = elo;
    const config = getEngineConfig(elo, mode);
    if (mode === 'depth') {
      this.depth = config.depth;
    }
  }

  async analyzePosition(board, moveHistory = []) {
    this.moveHistory = moveHistory;
    
    // Check book moves if enabled
    if (this.useBookMoves) {
      const bookMoves = this.getBookMoves();
      if (bookMoves) {
        return this.convertBookMovesToAnalysis(board, bookMoves);
      }
    }

    // Clear any existing timeout
    if (this.analysisTimeout) {
      clearTimeout(this.analysisTimeout);
    }

    // Get engine configuration
    const config = getEngineConfig(this.engineElo, this.engineMode);

    // Regular analysis with engine settings
    const analyzeWithTimeout = new Promise((resolve) => {
      this.analysisTimeout = setTimeout(() => {
        const moves = this.findAllPossibleMoves(board)
          .map(move => ({
            ...move,
            evaluation: this.evaluatePosition(move.resultingBoard, config.depth),
            line: this.generateLine(move),
            isBookMove: false
          }))
          .sort((a, b) => b.evaluation - a.evaluation);

        // Limit number of variations based on ELO
        const maxVariations = Math.max(1, Math.floor(config.depth / 2));
        resolve(moves.slice(0, maxVariations));
      }, this.engineMode === 'moveTime' ? config.moveTime : 0);
    });

    this.analyzedMoves = await analyzeWithTimeout;
    return this.analyzedMoves;
  }

  getBookMoves() {
    const historyKey = getMoveHistoryKey(this.moveHistory);
    return openingBook[historyKey]?.moves || null;
  }

  convertBookMovesToAnalysis(board, bookMoves) {
    return bookMoves.map(moveNotation => {
      const from = {
        x: moveNotation.charCodeAt(0) - 'a'.charCodeAt(0),
        y: 8 - parseInt(moveNotation[1])
      };
      const to = {
        x: moveNotation.charCodeAt(2) - 'a'.charCodeAt(0),
        y: 8 - parseInt(moveNotation[3])
      };

      const resultingBoard = this.makeMove(board, from, to);
      
      return {
        from,
        to,
        piece: board[from.y][from.x],
        resultingBoard,
        evaluation: 0.1, // Slight advantage for book moves
        line: this.generateLine({ from, to, piece: board[from.y][from.x], resultingBoard }),
        isBookMove: true
      };
    });
  }

  findAllPossibleMoves(board) {
    const moves = [];
    board.forEach((row, y) => {
      row.forEach((piece, x) => {
        if (piece && piece.charCodeAt(0) <= 9817) { // White pieces
          const possibleMoves = this.getPieceMoves(board, { x, y });
          possibleMoves.forEach(to => {
            const resultingBoard = this.makeMove(board, { x, y }, to);
            moves.push({
              from: { x, y },
              to,
              piece,
              resultingBoard,
            });
          });
        }
      });
    });
    return moves;
  }

  getPieceMoves(board, from) {
    const moves = [];
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (isValidMove(board, from, { x, y })) {
          moves.push({ x, y });
        }
      }
    }
    return moves;
  }

  makeMove(board, from, to) {
    const newBoard = board.map(row => [...row]);
    newBoard[to.y][to.x] = board[from.y][from.x];
    newBoard[from.y][from.x] = null;
    return newBoard;
  }

  evaluatePosition(board, depth = this.depth) {
    let score = 0;
    const pieceValues = {
      '♙': 1, '♘': 3, '♗': 3.2, '♖': 5, '♕': 9, '♔': 0,
      '♟': -1, '♞': -3, '♝': -3.2, '♜': -5, '♛': -9, '♚': 0
    };

    // Material evaluation
    board.forEach(row => {
      row.forEach(piece => {
        if (piece) {
          score += pieceValues[piece] || 0;
        }
      });
    });

    // Add some randomness based on ELO (lower ELO = more randomness)
    const randomFactor = (3500 - this.engineElo) / 3500; // 0 to 1
    const noise = (Math.random() - 0.5) * randomFactor;
    score += noise;

    // Reduce evaluation precision for lower ELO
    const precision = Math.max(2, Math.floor(this.engineElo / 500));
    return parseFloat(score.toFixed(precision));
  }

  generateLine(move) {
    const files = 'abcdefgh';
    const from = `${files[move.from.x]}${8 - move.from.y}`;
    const to = `${files[move.to.x]}${8 - move.to.y}`;
    const notation = `${from}${to}`;
    
    if (move.isBookMove) {
      return `${notation} (Book)`;
    }
    return notation;
  }

  nextMove() {
    if (this.currentMoveIndex < this.analyzedMoves.length - 1) {
      this.currentMoveIndex++;
      return this.analyzedMoves[this.currentMoveIndex];
    }
    return null;
  }

  previousMove() {
    if (this.currentMoveIndex > 0) {
      this.currentMoveIndex--;
      return this.analyzedMoves[this.currentMoveIndex];
    }
    return null;
  }

  getCurrentMove() {
    return this.analyzedMoves[this.currentMoveIndex];
  }

  getTotalMoves() {
    return this.analyzedMoves.length;
  }

  isKingInCheck(board, isWhiteKing) {
    // Limit check detection depth based on ELO
    const config = getEngineConfig(this.engineElo, this.engineMode);
    const maxDepth = Math.max(1, Math.floor(config.depth / 2));

    return this.detectCheck(board, isWhiteKing, maxDepth);
  }

  detectCheck(board, isWhiteKing, depth) {
    // Basic check detection for lower depths
    if (depth <= 1) {
      return this.basicCheckDetection(board, isWhiteKing);
    }

    // More sophisticated check detection for higher depths
    return this.advancedCheckDetection(board, isWhiteKing);
  }

  basicCheckDetection(board, isWhiteKing) {
    // Find king position
    let kingPos = null;
    board.forEach((row, y) => {
      row.forEach((piece, x) => {
        if (piece === (isWhiteKing ? '♔' : '♚')) {
          kingPos = { x, y };
        }
      });
    });

    if (!kingPos) return false;

    // Simple direct attack check
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = board[y][x];
        if (piece && isPieceWhite(piece) !== isWhiteKing) {
          if (isValidMove(board, { x, y }, kingPos)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  advancedCheckDetection(board, isWhiteKing) {
    // Existing sophisticated check detection logic
    return this.basicCheckDetection(board, isWhiteKing);
  }

  isCheckmate(board, isWhiteKing) {
    if (!this.isKingInCheck(board, isWhiteKing)) return false;

    // Try all possible moves for all pieces
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = board[y][x];
        if (piece && isPieceWhite(piece) === isWhiteKing) {
          const moves = this.getPieceMoves(board, { x, y });
          for (const move of moves) {
            const testBoard = this.makeMove(board, { x, y }, move);
            if (!this.isKingInCheck(testBoard, isWhiteKing)) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }
} 