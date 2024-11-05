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

export const AnalysisTab = ({ suggestedMoves = [], currentMoveIndex, onMoveSelect }) => {
  const getQualityIcon = (evaluation) => {
    if (evaluation >= 1.5) return QualityIcons.BRILLIANT;
    if (evaluation >= 1.0) return QualityIcons.GREAT;
    if (evaluation >= 0.7) return QualityIcons.BEST;
    if (evaluation >= 0.4) return QualityIcons.EXCELLENT;
    if (evaluation >= 0.1) return QualityIcons.GOOD;
    if (evaluation >= -0.1) return QualityIcons.BOOK;
    if (evaluation >= -0.3) return QualityIcons.INACCURACY;
    if (evaluation >= -0.7) return QualityIcons.MISTAKE;
    if (evaluation >= -1.0) return QualityIcons.MISS;
    return QualityIcons.BLUNDER;
  };

  return (
    <div className="tab-content">
      {suggestedMoves.length === 0 ? (
        <div className="empty-message">Analyzing position...</div>
      ) : (
        suggestedMoves.map((move, index) => (
          <div 
            key={`analysis-${index}`} 
            className={`move-entry ${index === currentMoveIndex ? 'selected' : ''}`}
            onClick={() => onMoveSelect(index, move)}
          >
            <div className="analysis-section">
              <span className="eval">{move.evaluation}</span>
              <span className="quality-icon">
                <FontAwesomeIcon 
                  icon={getQualityIcon(move.evaluation).icon} 
                  style={{ color: getQualityIcon(move.evaluation).color }}
                />
              </span>
              <span className="line">{move.line}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}; 