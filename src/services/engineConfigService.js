export const EngineRanks = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  EXPERT: 'Expert',
  MASTER: 'Master',
  GRAND_MASTER: 'Grand Master'
};

export const getEngineRank = (elo) => {
  if (elo <= 350) return EngineRanks.BEGINNER;
  if (elo <= 875) return EngineRanks.INTERMEDIATE;
  if (elo <= 1400) return EngineRanks.ADVANCED;
  if (elo <= 2013) return EngineRanks.EXPERT;
  if (elo <= 2538) return EngineRanks.MASTER;
  return EngineRanks.GRAND_MASTER;
};

export const calculateMoveTime = (elo) => {
  // Linear scaling from 50ms to 2000ms
  return Math.floor(50 + ((elo - 88) / (3500 - 88)) * (2000 - 50));
};

export const calculateDepth = (elo) => {
  if (elo <= 175) return 1;
  if (elo <= 350) return 2;
  if (elo <= 525) return 3;
  if (elo <= 700) return 4;
  if (elo <= 1400) return Math.min(8, 5 + Math.floor((elo - 700) / 175)); // Advanced: 5-8
  if (elo <= 2013) return Math.min(11, 9 + Math.floor((elo - 1400) / 200)); // Expert: 9-11
  if (elo <= 2538) return Math.min(14, 12 + Math.floor((elo - 2013) / 175)); // Master: 12-14
  return Math.min(20, 15 + Math.floor((elo - 2538) / 48)); // Grand Master: 15-20
};

export const MIN_ELO = {
  depth: 175,
  moveTime: 88
};

export const MAX_ELO = 3500;

export const STEP_SIZE = {
  depth: (MAX_ELO - 175) / 38, // 19 depth levels from 1-20
  moveTime: (MAX_ELO - 88) / 38 // Linear scale for move time
};

// Create configs with proper step size for each mode
const createConfigs = (minElo, mode) => {
  const step = STEP_SIZE[mode];
  const steps = Math.ceil((MAX_ELO - minElo) / step);
  return Array.from({ length: steps + 1 }, (_, i) => {
    const elo = Math.min(MAX_ELO, Math.round(minElo + (i * step)));
    return {
      elo,
      rank: getEngineRank(elo),
      moveTime: calculateMoveTime(elo),
      depth: calculateDepth(elo)
    };
  });
};

export const engineConfigs = {
  depth: createConfigs(MIN_ELO.depth, 'depth'),
  moveTime: createConfigs(MIN_ELO.moveTime, 'moveTime')
};

export const getEngineConfig = (elo, mode = 'depth') => {
  const configs = engineConfigs[mode];
  const closestConfig = configs.reduce((prev, curr) => {
    return Math.abs(curr.elo - elo) < Math.abs(prev.elo - elo) ? curr : prev;
  });
  return closestConfig;
}; 