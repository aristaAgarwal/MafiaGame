export interface Player {
  id: string;
  name: string;
  role: string | null;
  isAlive: boolean;
  isHost: boolean;
}

export type GamePhase = 'HOME' | 'LOBBY' | 'NIGHT' | 'DAY' | 'VOTING' | 'END';

export interface RoomState {
  code: string;
  hostId: string;
  phase: GamePhase;
  players: Record<string, Player>;
  nightActions: Record<string, string>;
  votes: Record<string, string>;
  winner?: 'MAFIA' | 'VILLAGERS' | null;
}
