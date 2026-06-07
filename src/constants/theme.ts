import { GamePhase } from '../types/game';

export const COLORS = {
  background: '#0D0B0A',
  surface: 'rgba(26, 22, 18, 0.6)',
  surfaceElevated: '#221C17',
  gold: '#C8A04A',
  goldLight: '#E8C06A',
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
