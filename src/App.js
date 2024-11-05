import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import './styles.css';
import { makeAIMove } from './services/aiService';
import { initialBoard, drawBoard, drawPieces } from './services/chessService';
import { isValidMove, getValidCoordinates, getValidMoves, isPieceWhite } from './utils/moveValidation';
import { AnalysisService } from './services/analysisService';
import { AnalysisTab } from './components/tabs/AnalysisTab';
import { MoveLogTab } from './components/tabs/MoveLogTab';
import { SettingsTab } from './components/tabs/SettingsTab';
import { evaluateMove } from './services/moveEvaluationService';
import { getEngineConfig } from './services/engineConfigService';

const BOARD_SIZE = 736;
const CELL_SIZE = BOARD_SIZE / 8;

const generateMoveNotation = (board, from, to, movingPiece, capturedPiece) => {
  const files = 'abcdefgh';
  const pieceSymbols = {
    '♔': 'K', '♕': 'Q', '♖': 'R', '♗': 'B', '♘': 'N',
    '♚': 'K', '♛': 'Q', '♜': 'R', '♝': 'B', '♞': 'N'
  };

  // Castling
  if (movingPiece === '♔' && Math.abs(to.x - from.x) === 2) {
    return to.x > from.x ? 'O-O' : 'O-O-O';
  }

  let notation = '';
  
  // Add piece symbol (except for pawns)
  if (pieceSymbols[movingPiece]) {
    notation += pieceSymbols[movingPiece];
  }

  // Add 'x' for captures
  if (capturedPiece) {
    if (!pieceSymbols[movingPiece]) {
      notation += files[from.x];
    }
    notation += 'x';
  }

  // Add destination square
  notation += `${files[to.x]}${8 - to.y}`;

  return notation;
};

function App() {
  const canvasRef = useRef(null);
  const [board, setBoard] = React.useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = React.useState(null);
  const [validMoves, setValidMoves] = React.useState([]);
  const [playerTurn, setPlayerTurn] = React.useState(true);
  const [analysisService] = React.useState(new AnalysisService());
  const [suggestedMoves, setSuggestedMoves] = React.useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = React.useState(0);
  const [moveHistory, setMoveHistory] = React.useState([]);
  const [moveNumber, setMoveNumber] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState('analysis');
  const [useBookMoves, setUseBookMoves] = React.useState(true);
  const [engineMode, setEngineMode] = React.useState('depth');
  const [engineElo, setEngineElo] = React.useState(1750);
  const [freeMode, setFreeMode] = React.useState(false);
  const [opponentElo, setOpponentElo] = React.useState(1750);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawBoard(ctx, CELL_SIZE, selectedPiece, validMoves, board);
    drawPieces(ctx, board, CELL_SIZE);
  }, [board, selectedPiece, validMoves]);

  useEffect(() => {
    if (playerTurn) {
      analysisService.setEngineConfig(engineMode, engineElo);
      analysisService.useBookMoves = useBookMoves;
      
      const getAnalysis = async () => {
        const moves = await analysisService.analyzePosition(board);
        setSuggestedMoves(moves || []);
      };
      
      getAnalysis();
    }
  }, [board, playerTurn, useBookMoves, engineMode, engineElo, analysisService]);

  const handleClick = (e) => {
    const coords = getValidCoordinates(e, canvasRef.current, CELL_SIZE);
    if (!coords) return;

    const piece = board[coords.y][coords.x];
    
    // If a piece is already selected and the click is on a valid move
    if (selectedPiece && validMoves.some(move => move.x === coords.x && move.y === coords.y)) {
      movePiece(selectedPiece, coords);
      setSelectedPiece(null);
      setValidMoves([]);
      return;
    }

    // Clear selection if clicking on empty square
    if (!piece) {
      setSelectedPiece(null);
      setValidMoves([]);
      return;
    }

    // Select new piece and show valid moves
    setSelectedPiece(coords);
    const moves = getValidMoves(board, coords);
    // In free mode, allow moving any piece during your turn
    setValidMoves(playerTurn ? (freeMode ? moves : isPieceWhite(piece) ? moves : []) : []);
  };

  const movePiece = (from, to) => {
    if (isValidMove(board, from, to)) {
      const newBoard = board.map(row => [...row]);
      const capturedPiece = newBoard[to.y][to.x];
      const movingPiece = newBoard[from.y][from.x];
      newBoard[to.y][to.x] = movingPiece;
      newBoard[from.y][from.x] = null;

      const notation = generateMoveNotation(board, from, to, movingPiece, capturedPiece);
      const prevEval = analysisService.evaluatePosition(board);
      const newEval = analysisService.evaluatePosition(newBoard);
      
      const moveHistoryEntry = {
        moveNumber: moveNumber,
        piece: movingPiece,
        from: { ...from },
        to: { ...to },
        notation,
        isWhite: isPieceWhite(movingPiece)
      };

      const quality = evaluateMove(prevEval, newEval, {
        piece: movingPiece,
        from,
        to,
        board: newBoard,
        isCheck: analysisService.isKingInCheck(newBoard, !isPieceWhite(movingPiece)),
        isCheckmate: analysisService.isCheckmate(newBoard, !isPieceWhite(movingPiece)),
        moveNumber: moveNumber,
        moveHistory: [...moveHistory, moveHistoryEntry]
      });

      moveHistoryEntry.quality = quality;
      
      setBoard(newBoard);
      setMoveHistory(prev => [...prev, moveHistoryEntry]);

      // Only trigger AI move if not in free mode
      if (!freeMode) {
        setPlayerTurn(false);
        setTimeout(() => {
          const aiConfig = getEngineConfig(opponentElo, 'depth');
          const aiResult = makeAIMove(newBoard, aiConfig.depth);
          if (aiResult.move) {
            const aiNotation = generateMoveNotation(
              newBoard, 
              aiResult.move.from, 
              aiResult.move.to, 
              aiResult.move.piece,
              board[aiResult.move.to.y][aiResult.move.to.x]
            );
            const aiEval = analysisService.evaluatePosition(aiResult.board);
            
            const aiMoveHistoryEntry = {
              moveNumber: moveNumber,
              piece: aiResult.move.piece,
              from: { ...aiResult.move.from },
              to: { ...aiResult.move.to },
              notation: aiNotation,
              isWhite: false
            };

            const aiQuality = evaluateMove(newEval, aiEval, {
              piece: aiResult.move.piece,
              from: aiResult.move.from,
              to: aiResult.move.to,
              board: aiResult.board,
              isCheck: analysisService.isKingInCheck(aiResult.board, true),
              isCheckmate: analysisService.isCheckmate(aiResult.board, true),
              moveNumber: moveNumber,
              moveHistory: [...moveHistory, moveHistoryEntry, aiMoveHistoryEntry]
            });

            aiMoveHistoryEntry.quality = aiQuality;
            
            setMoveHistory(prev => [...prev, aiMoveHistoryEntry]);
            setBoard(aiResult.board);
            setPlayerTurn(true);
            setMoveNumber(prev => prev + 1);
          }
        }, 500);
      } else {
        // In free mode, just toggle the turn
        setPlayerTurn(true);
        if (!isPieceWhite(movingPiece)) {
          setMoveNumber(prev => prev + 1);
        }
      }
    }
  };

  const handlePreviousMove = () => {
    if (currentMoveIndex > 0) {
      setCurrentMoveIndex(prev => prev - 1);
      const move = suggestedMoves[currentMoveIndex - 1];
      setSelectedPiece(move.from);
      setValidMoves([move.to]);
    }
  };

  const handleNextMove = () => {
    if (currentMoveIndex < suggestedMoves.length - 1) {
      setCurrentMoveIndex(prev => prev + 1);
      const move = suggestedMoves[currentMoveIndex + 1];
      setSelectedPiece(move.from);
      setValidMoves([move.to]);
    }
  };

  const handleMoveSelect = (index, move) => {
    setCurrentMoveIndex(index);
    setSelectedPiece(move.from);
    setValidMoves([move.to]);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analysis':
        return (
          <AnalysisTab 
            suggestedMoves={suggestedMoves}
            currentMoveIndex={currentMoveIndex}
            onMoveSelect={handleMoveSelect}
          />
        );
      case 'moves':
        return <MoveLogTab moveHistory={moveHistory} />;
      case 'settings':
        return (
          <SettingsTab 
            useBookMoves={useBookMoves}
            onBookMovesChange={setUseBookMoves}
            engineMode={engineMode}
            onEngineModeChange={setEngineMode}
            engineElo={engineElo}
            onEngineEloChange={setEngineElo}
            freeMode={freeMode}
            onFreeModeChange={setFreeMode}
            opponentElo={opponentElo}
            onOpponentEloChange={setOpponentElo}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="chess-container">
      <div className="game-section">
        <canvas
          ref={canvasRef}
          width={BOARD_SIZE}
          height={BOARD_SIZE}
          onClick={handleClick}
        />
        <div className="status-container">
          <div className="status">
            {freeMode ? "Free Mode" : (playerTurn ? "Your turn" : "AI is thinking...")}
          </div>
          {playerTurn && suggestedMoves.length > 0 && (
            <div className="move-navigation">
              <button onClick={handlePreviousMove}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <span>{`${currentMoveIndex + 1}/${suggestedMoves.length}`}</span>
              <button onClick={handleNextMove}>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="analysis-panel">
        <div className="tab-header">
          <button 
            className={`tab-button ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            Analysis Log
          </button>
          <button 
            className={`tab-button ${activeTab === 'moves' ? 'active' : ''}`}
            onClick={() => setActiveTab('moves')}
          >
            Move Log
          </button>
          <button 
            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>
        {renderTabContent()}
      </div>
    </div>
  );
}

export default App;
