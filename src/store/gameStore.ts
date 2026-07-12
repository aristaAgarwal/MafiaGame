import { create } from 'zustand';
import io, { Socket } from 'socket.io-client';
import { Alert, Platform } from 'react-native';

// Socket server URL from environment configuration with localhost fallback
const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:3000';

export interface Player {
  id: string;
  name: string;
  role: string | null;
  isAlive: boolean;
  isHost: boolean;
  isOnline: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  channel: 'day' | 'mafia' | 'lobby';
}

export interface RoomSettings {
  mafiaCount: number;
  hasPolice: boolean;
  hasDoctor: boolean;
  revealRoles: boolean;
}

interface GameState {
  socket: Socket | null;
  playerName: string;
  roomCode: string | null;
  phase: 'HOME' | 'LOBBY' | 'ROLE_REVEAL' | 'NIGHT' | 'DAY' | 'VOTING' | 'END';
  players: Record<string, Player>;
  hostId: string | null;
  killedId: string | null;
  eliminatedId: string | null;
  myId: string | null;
  policeResult: { targetId: string, role: string } | null;
  winner: 'MAFIA' | 'VILLAGERS' | null;
  votes: Record<string, string>;
  nightActions: Record<string, string>;
  toast: string | null;
  messages: ChatMessage[];
  settings: RoomSettings;
  round: number;

  setPlayerName: (name: string) => void;
  showToast: (message: string) => void;
  connectSocket: (serverUrl?: string) => void;
  createRoom: () => void;
  joinRoom: (code: string) => void;
  startGame: () => void;
  startNight: () => void;
  submitNightAction: (targetId: string, role: string) => void;
  endNight: () => void;
  startVoting: () => void;
  submitVote: (targetId: string) => void;
  endVoting: () => void;
  resetGame: () => void;
  leaveLobby: () => void;
  kickPlayer: (targetId: string) => void;
  sendChatMessage: (text: string, channel: 'day' | 'mafia' | 'lobby') => void;
  updateSettings: (settings: Partial<RoomSettings>) => void;
}

const checkOfflineAndProceed = (get: any, action: () => void) => {
  const { players, socket, roomCode } = get() as GameState;
  const offlinePlayers = Object.values(players).filter((p: Player) => !p.isOnline && p.isAlive);
  if (offlinePlayers.length > 0) {
    const names = offlinePlayers.map((p: Player) => p.name).join(', ');
    const message = `The following players are offline: ${names}. Do you want to kick them and proceed?`;
    
    if (Platform.OS === 'web') {
      const confirm = window.confirm(`Offline Players Detected\n\n${message}`);
      if (confirm) {
        offlinePlayers.forEach((p: Player) => {
          socket?.emit('kick_player', { roomCode, targetId: p.id });
        });
        action();
      }
    } else {
      Alert.alert(
        'Offline Players Detected',
        message,
        [
          { text: 'Wait', style: 'cancel' },
          { 
            text: 'Kick & Proceed', 
            style: 'destructive',
            onPress: () => {
              offlinePlayers.forEach((p: Player) => {
                socket?.emit('kick_player', { roomCode, targetId: p.id });
              });
              action();
            }
          }
        ]
      );
    }
  } else {
    action();
  }
};

export const useGameStore = create<GameState>((set, get) => ({
  socket: null,
  playerName: '',
  roomCode: null,
  phase: 'HOME',
  players: {},
  hostId: null,
  killedId: null,
  eliminatedId: null,
  myId: null,
  policeResult: null,
  winner: null,
  votes: {},
  nightActions: {},
  toast: null,
  messages: [],
  round: 0,
  settings: {
    mafiaCount: 1,
    hasPolice: true,
    hasDoctor: true,
    revealRoles: true
  },

  setPlayerName: (name) => set({ playerName: name }),

  showToast: (message) => {
    set({ toast: message });
    setTimeout(() => {
      if (get().toast === message) {
        set({ toast: null });
      }
    }, 3000);
  },

  connectSocket: (serverUrl) => {
    const currentSocket = get().socket;
    const url = serverUrl || SOCKET_URL;
    
    if (currentSocket) {
      const isSameUrl = (currentSocket.io as any).uri === url || (currentSocket.io as any).uri === url + '/';
      const isConnectingOrConnected = currentSocket.connected || (currentSocket.io as any).readyState === 'opening';
      
      if (isSameUrl && isConnectingOrConnected) {
        return; // Already connecting or connected to this server
      }
      currentSocket.disconnect();
    }
    
    console.log('Connecting to socket server at:', url);
    const socket = io(url, {
      timeout: 20000, // 20 seconds timeout for slower networks or server cold-starts
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id);
      const previousId = get().myId; // Store previous socket ID before updating
      set({ myId: socket.id });
      // Auto-rejoin if we were in a room
      const { roomCode, playerName } = get();
      if (roomCode && playerName) {
        socket.emit('join_room', { roomCode, playerName, previousSocketId: previousId });
      }
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      alert(`Connection failed to ${url}. Please verify the server is running and the IP/port are correct.`);
      set({ socket: null, myId: null });
    });

    socket.on('room_created', ({ roomCode, player }) => {
      set({ 
        roomCode, 
        phase: 'LOBBY',
        players: player ? { [player.id]: player } : {},
        hostId: player ? player.id : null
      });
      if (player && player.name) {
        set({ playerName: player.name });
      }
    });

    socket.on('room_joined', ({ roomCode, player }) => {
      set({ 
        roomCode, 
        phase: 'LOBBY',
        players: player ? { [player.id]: player } : {}
      });
      if (player && player.name) {
        set({ playerName: player.name });
      }
    });

    socket.on('update_room', (room) => {
      // Don't override phase unless it's explicitly lobbying still, or let the specific phase events override it
      set(state => ({ 
        players: room.players, 
        hostId: room.hostId,
        votes: room.votes || {},
        nightActions: room.nightActions || {},
        settings: room.settings || state.settings,
        round: room.round !== undefined ? room.round : state.round,
        phase: (room.phase === 'LOBBY' && state.phase !== 'HOME') ? 'LOBBY' : state.phase
      }));
    });

    socket.on('game_started', (room) => {
      set({ 
        players: room.players, 
        phase: room.phase, 
        policeResult: null, 
        killedId: null, 
        eliminatedId: null, 
        winner: null, 
        votes: {}, 
        nightActions: room.nightActions || {}, 
        messages: [],
        round: room.round || 1,
        settings: room.settings || get().settings
      });
    });

    socket.on('day_started', ({ room, killed }) => {
      set({ players: room.players, phase: 'DAY', killedId: killed, votes: {}, nightActions: {}, round: room.round || get().round });
    });
    
    socket.on('voting_started', (room) => {
      set({ phase: 'VOTING', votes: room.votes || {}, nightActions: {}, round: room.round || get().round });
    });

    socket.on('night_started', ({ room, eliminatedId }) => {
      set({ players: room.players, phase: 'NIGHT', eliminatedId, policeResult: null, votes: {}, nightActions: room.nightActions || {}, round: room.round || get().round });
    });
    
    socket.on('police_result', (result) => {
      set({ policeResult: result });
    });

    socket.on('game_ended', ({ room, winner }) => {
      set({ players: room.players, phase: 'END', winner, votes: {}, nightActions: {}, round: room.round || get().round });
    });

    socket.on('room_reset', (room) => {
      set({ 
        players: room.players, 
        phase: 'LOBBY', 
        winner: null, 
        killedId: null, 
        eliminatedId: null, 
        policeResult: null, 
        votes: {}, 
        nightActions: {}, 
        messages: [],
        round: 0,
        settings: room.settings || get().settings
      });
    });

    socket.on('chat_message', (message: ChatMessage) => {
      set((state) => ({
        messages: [...state.messages, message]
      }));
    });

    socket.on('chat_history', (history: ChatMessage[]) => {
      set({ messages: history });
    });

    socket.on('error', (msg) => {
      alert(msg);
    });

    set({ socket });
  },

  createRoom: () => {
    const { socket, playerName } = get();
    if (socket && playerName) socket.emit('create_room', { playerName });
  },

  joinRoom: (code) => {
    const { socket, playerName, myId } = get();
    if (socket && playerName) socket.emit('join_room', { roomCode: code, playerName, previousSocketId: myId });
  },

  startGame: () => {
    const { socket, roomCode } = get();
    if (socket && roomCode) {
      checkOfflineAndProceed(get, () => socket.emit('start_game', { roomCode }));
    }
  },

  submitNightAction: (targetId, role) => {
    const { socket, roomCode } = get();
    if (socket && roomCode) socket.emit('night_action', { roomCode, targetId, role });
  },

  endNight: () => {
    const { socket, roomCode } = get();
    if (socket && roomCode) {
      checkOfflineAndProceed(get, () => socket.emit('end_night', { roomCode }));
    }
  },
  
  startVoting: () => {
    const { socket, roomCode } = get();
    if (socket && roomCode) {
      checkOfflineAndProceed(get, () => socket.emit('start_voting', { roomCode }));
    }
  },

  submitVote: (targetId) => {
    const { socket, roomCode } = get();
    if (socket && roomCode) socket.emit('vote', { roomCode, targetId });
  },
  
  endVoting: () => {
    const { socket, roomCode } = get();
    if (socket && roomCode) {
      checkOfflineAndProceed(get, () => socket.emit('end_voting', { roomCode }));
    }
  },

  startNight: () => {
    const { socket, roomCode } = get();
    if (socket && roomCode) {
      checkOfflineAndProceed(get, () => socket.emit('start_night', { roomCode }));
    }
  },

  resetGame: () => {
    const { socket, roomCode } = get();
    if (socket && roomCode) {
      checkOfflineAndProceed(get, () => socket.emit('reset_game', { roomCode }));
    }
  },

  kickPlayer: (targetId) => {
    const { socket, roomCode } = get();
    if (socket && roomCode) socket.emit('kick_player', { roomCode, targetId });
  },

  sendChatMessage: (text, channel) => {
    const { socket, roomCode } = get();
    if (socket && roomCode) {
      socket.emit('send_chat_message', { roomCode, text, channel });
    }
  },

  updateSettings: (newSettings) => {
    const { socket, roomCode, settings } = get();
    if (socket && roomCode) {
      const updated = { ...settings, ...newSettings };
      socket.emit('update_settings', { roomCode, settings: updated });
    }
  },

  leaveLobby: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
    set({
      socket: null,
      roomCode: null,
      phase: 'HOME',
      players: {},
      hostId: null,
      myId: null,
      policeResult: null,
      winner: null,
      votes: {},
      nightActions: {},
      messages: [],
      round: 0,
      settings: {
        mafiaCount: 1,
        hasPolice: true,
        hasDoctor: true,
        revealRoles: true
      }
    });
  }
}));
