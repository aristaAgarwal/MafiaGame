import { GamePhase } from '../types/game';

export const COLORS = {
  background: '#0D0B0A',
  surface: 'rgba(255, 255, 255, 0.3)',
  surfaceElevated: '#221C17',
  gold: '#E8C06A',
  redAccent: '#8B2020',
  redBright: '#C0392B',
  textPrimary: '#F0E8D8',
  textMuted: '#6B5E4E',
  border: '#3A2E22',
  borderGold: 'rgba(200, 160, 74, 0.4)',

  // Roles colors adjusted for the new palette
  mafia: '#C0392B',
  police: '#C8A04A',
  doctor: '#E8C06A',
  villager: '#F0E8D8',

  // Semantically defined utility colors
  white: '#FFFFFF',
  whiteTranslucent: 'rgba(255, 255, 255, 0.3)',
  
  cardBorder: '#d5bf9aff',
  cardDivider: '#80736eff',
  borderLight: 'rgba(255, 255, 255, 0.1)',
  borderSubtle: 'rgba(255, 255, 255, 0.05)',
  goldTranslucent: 'rgba(232, 192, 106, 0.3)',
  
  bottomNavBg: '#141210',
  bottomNavBorder: '#2A2018',
  
  navIconInactive: '#4A3E32',
  titleShadow: 'rgba(200, 160, 74, 0.15)',

  // Overlays & opacity backgrounds
  overlayGold05: 'rgba(232, 192, 106, 0.05)',
  overlayGold20: 'rgba(232, 192, 106, 0.2)',
  overlayRed05: 'rgba(192, 57, 43, 0.05)',
  overlayRed20: 'rgba(192, 57, 43, 0.2)',
  toastBg: 'rgba(26, 22, 18, 0.95)',
  black: '#000000',
};

export const getGradientColors = (phase: GamePhase, winner?: 'MAFIA' | 'VILLAGERS' | null): [string, string, ...string[]] => {
  switch (phase) {
    case 'NIGHT':
      return ['#140F0B', '#0D0B0A'];
    case 'DAY':
      return ['#261D15', '#0D0B0A'];
    case 'VOTING':
      return ['#2C1311', '#0D0B0A'];
    case 'END':
      return winner === 'MAFIA'
        ? ['#3D1515', '#0D0B0A']
        : ['#17261B', '#0D0B0A'];
    default:
      return ['#1F1A15', '#0D0B0A'];
  }
};
