import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

const QualityIcons = {
  BRILLIANT: { icon: faGem, color: '#33c088' },
  GREAT: { icon: faStar, color: '#33c088' },
  BEST: { icon: faStar, color: '#33c088' },
  EXCELLENT: { icon: faThumbsUp, color: '#33c088' },
  GOOD: { icon: faCheck, color: '#33c088' },
  BOOK: { icon: faBook, color: '#a88865' },
  INACCURACY: { icon: faExclamationTriangle, color: '#f0c15c' },
  MISTAKE: { icon: faTimesCircle, color: '#f0856c' },
  MISS: { icon: faQuestionCircle, color: '#f0856c' },
  BLUNDER: { icon: faBomb, color: '#f0856c' }
};

const renderMoveWithQuality = (move) => {
  if (!move) return null;
  
  const quality = move.isBookMove ? {
    name: 'Book Move',
    icon: QualityIcons.BOOK.icon,
    color: QualityIcons.BOOK.color
  } : move.quality;

  return (
    <div className="move-with-quality">
      <span 
        className="quality-icon" 
        style={{ color: quality.color }}
        title={quality.name}
      >
        <FontAwesomeIcon icon={quality.icon} />
      </span>
      <span className="move-notation">
        {move.notation}
        {move.isBookMove && <span className="book-indicator"> (Book)</span>}
      </span>
    </div>
  );
};

export const MoveLogTab = ({ moveHistory }) => {
  // Group moves by pairs (white and black moves)
  const groupedMoves = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    groupedMoves.push({
      number: Math.floor(i / 2) + 1,
      white: moveHistory[i],
      black: moveHistory[i + 1]
    });
  }

  return (
    <div className="tab-content">
      {moveHistory.length === 0 ? (
        <div className="empty-message">No moves yet</div>
      ) : (
        <div className="move-list">
          {groupedMoves.map((movePair, index) => (
            <div key={`move-${index}`} className="move-entry">
              <span className="move-number">{movePair.number}.</span>
              <div className="white-move">
                {renderMoveWithQuality(movePair.white)}
              </div>
              <div className="black-move">
                {renderMoveWithQuality(movePair.black)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 