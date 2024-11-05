import React from 'react';
import { getEngineConfig, MIN_ELO, MAX_ELO, STEP_SIZE } from '../../services/engineConfigService';

export const SettingsTab = ({ 
  useBookMoves, 
  onBookMovesChange,
  engineMode,
  onEngineModeChange,
  engineElo,
  onEngineEloChange,
  freeMode,
  onFreeModeChange,
  opponentElo,
  onOpponentEloChange
}) => {
  const currentConfig = getEngineConfig(engineElo, engineMode);
  const opponentConfig = getEngineConfig(opponentElo, 'depth');

  const handleModeChange = (e) => {
    const newMode = e.target.value;
    onEngineModeChange(newMode);
    if (newMode === 'depth' && engineElo < MIN_ELO.depth) {
      onEngineEloChange(MIN_ELO.depth);
    }
  };

  return (
    <div className="tab-content settings-tab">
      <div className="setting-group">
        <h4>Game Mode</h4>
        <div className="setting-item checkbox">
          <input 
            type="checkbox"
            id="freeMode"
            checked={freeMode}
            onChange={(e) => onFreeModeChange(e.target.checked)}
          />
          <label htmlFor="freeMode">Free mode (move both sides)</label>
        </div>
      </div>

      {!freeMode && (
        <div className="setting-group">
          <h4>Opponent Strength</h4>
          <div className="setting-item">
            <label htmlFor="opponentElo">Opponent power:</label>
            <input
              type="range"
              id="opponentElo"
              min={MIN_ELO.depth}
              max={MAX_ELO}
              step={STEP_SIZE.depth}
              value={opponentElo}
              onChange={(e) => onOpponentEloChange(Math.round(Number(e.target.value)))}
            />
            <span className="elo-value">{opponentElo}</span>
          </div>
          <div className="engine-stats">
            <div className="stat-item">
              <span className="bullet">•</span>
              <span>Elo: {opponentConfig.elo}</span>
            </div>
            <div className="stat-item">
              <span className="bullet">•</span>
              <span>Rank: {opponentConfig.rank}</span>
            </div>
            <div className="stat-item">
              <span className="bullet">•</span>
              <span>Depth: {opponentConfig.depth}</span>
            </div>
          </div>
        </div>
      )}

      <div className="setting-group">
        <h4>Analysis Settings</h4>
        <div className="setting-item checkbox">
          <input 
            type="checkbox"
            id="bookMoves"
            checked={useBookMoves}
            onChange={(e) => onBookMovesChange(e.target.checked)}
          />
          <label htmlFor="bookMoves">Use book moves</label>
        </div>
      </div>

      <div className="setting-group">
        <h4>Analysis Engine</h4>
        <div className="setting-item">
          <label htmlFor="engineMode">Engine mode:</label>
          <select
            id="engineMode"
            value={engineMode}
            onChange={handleModeChange}
          >
            <option value="depth">Depth</option>
            <option value="moveTime">Move time</option>
          </select>
        </div>
        <div className="setting-item">
          <label htmlFor="engineElo">Analysis power:</label>
          <input
            type="range"
            id="engineElo"
            min={MIN_ELO[engineMode]}
            max={MAX_ELO}
            step={STEP_SIZE[engineMode]}
            value={engineElo}
            onChange={(e) => onEngineEloChange(Math.round(Number(e.target.value)))}
          />
          <span className="elo-value">{engineElo}</span>
        </div>
        <div className="engine-stats">
          <div className="stat-item">
            <span className="bullet">•</span>
            <span>Elo: {currentConfig.elo}</span>
          </div>
          <div className="stat-item">
            <span className="bullet">•</span>
            <span>Rank: {currentConfig.rank}</span>
          </div>
          <div className="stat-item">
            <span className="bullet">•</span>
            <span>
              {engineMode === 'depth' 
                ? `Depth: ${currentConfig.depth}`
                : `Move Time: ${currentConfig.moveTime}ms`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}; 