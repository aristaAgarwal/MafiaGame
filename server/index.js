const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const rooms = {};

// Helper to generate a 4 digit room code
function generateRoomCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

const ROLES = ['MAFIA', 'POLICE', 'DOCTOR', 'VILLAGER'];

function assignRoles(players) {
  const rolesToAssign = ['MAFIA', 'POLICE', 'DOCTOR'];
  const assigned = [];
  const playersList = Object.values(players);
  
  // Basic assignment for prototype: 1 Mafia, 1 Police, 1 Doctor, rest Villagers
  let shuffledPlayers = [...playersList].sort(() => 0.5 - Math.random());
  
  shuffledPlayers.forEach((player, index) => {
    if (index < rolesToAssign.length) {
      player.role = rolesToAssign[index];
    } else {
      player.role = 'VILLAGER';
    }
  });
  
  return players;
}

function checkWinCondition(room) {
  const playersList = Object.values(room.players);
  const alivePlayers = playersList.filter(p => p.isAlive);
  const mafiaAlive = alivePlayers.filter(p => p.role === 'MAFIA').length;
  const villagersAlive = alivePlayers.filter(p => p.role !== 'MAFIA').length;

  if (mafiaAlive === 0) {
    return 'VILLAGERS';
  } else if (mafiaAlive >= villagersAlive) {
    return 'MAFIA';
  }
  return null;
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create_room', ({ playerName }) => {
    const roomCode = generateRoomCode();
    rooms[roomCode] = {
      code: roomCode,
      hostId: socket.id,
      phase: 'LOBBY', // LOBBY, NIGHT, DAY, VOTING, END
      players: {
        [socket.id]: { id: socket.id, name: playerName, isHost: true, isAlive: true, role: null }
      },
      nightActions: {},
      votes: {}
    };
    socket.join(roomCode);
    socket.emit('room_created', { roomCode, player: rooms[roomCode].players[socket.id] });
    io.to(roomCode).emit('update_room', rooms[roomCode]);
  });

  socket.on('join_room', ({ roomCode, playerName }) => {
    if (rooms[roomCode]) {
      socket.join(roomCode);
      rooms[roomCode].players[socket.id] = { id: socket.id, name: playerName, isHost: false, isAlive: true, role: null };
      socket.emit('room_joined', { roomCode, player: rooms[roomCode].players[socket.id] });
      io.to(roomCode).emit('update_room', rooms[roomCode]);
    } else {
      socket.emit('error', 'Room not found');
    }
  });

  socket.on('start_game', ({ roomCode }) => {
    const room = rooms[roomCode];
    if (room && room.hostId === socket.id) {
      room.players = assignRoles(room.players);
      room.phase = 'NIGHT';
      room.nightActions = {};
      room.votes = {};
      io.to(roomCode).emit('game_started', room);
    }
  });

  socket.on('night_action', ({ roomCode, targetId, role }) => {
    const room = rooms[roomCode];
    if (room && room.phase === 'NIGHT') {
      room.nightActions[role] = targetId;
      
      // If Police, reveal identity immediately to the police
      if (role === 'POLICE') {
        const targetRole = room.players[targetId].role;
        socket.emit('police_result', { targetId, role: targetRole });
      }
      
      io.to(room.hostId).emit('update_room', room); // Let host know someone acted
    }
  });

  socket.on('end_night', ({ roomCode }) => {
    const room = rooms[roomCode];
    if (room && room.hostId === socket.id) {
      const { MAFIA, DOCTOR } = room.nightActions;
      let killed = null;
      
      if (MAFIA && MAFIA !== DOCTOR) {
        killed = MAFIA;
        if (room.players[killed]) {
          room.players[killed].isAlive = false;
        }
      }
      
      const winner = checkWinCondition(room);
      if (winner) {
        room.phase = 'END';
        room.winner = winner;
        io.to(roomCode).emit('game_ended', { room, winner });
      } else {
        room.phase = 'DAY';
        room.nightActions = {}; // reset for next night
        io.to(roomCode).emit('day_started', { room, killed });
      }
    }
  });
  
  socket.on('start_voting', ({ roomCode }) => {
    const room = rooms[roomCode];
    if (room && room.hostId === socket.id) {
       room.phase = 'VOTING';
       room.votes = {};
       io.to(roomCode).emit('voting_started', room);
    }
  });

  socket.on('vote', ({ roomCode, targetId }) => {
    const room = rooms[roomCode];
    if (room && room.phase === 'VOTING' && room.players[socket.id].isAlive) {
      room.votes[socket.id] = targetId;
      io.to(roomCode).emit('update_room', room);
    }
  });
  
  socket.on('end_voting', ({ roomCode }) => {
    const room = rooms[roomCode];
    if (room && room.hostId === socket.id) {
      // Calculate max votes
      const voteCounts = {};
      Object.values(room.votes).forEach(targetId => {
        voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
      });
      
      let maxVotes = 0;
      let eliminatedId = null;
      
      Object.entries(voteCounts).forEach(([id, count]) => {
        if (count > maxVotes) {
          maxVotes = count;
          eliminatedId = id;
        } else if (count === maxVotes) {
          eliminatedId = null; // Tie
        }
      });
      
      if (eliminatedId && room.players[eliminatedId]) {
        room.players[eliminatedId].isAlive = false;
      }
      
      const winner = checkWinCondition(room);
      if (winner) {
        room.phase = 'END';
        room.winner = winner;
        io.to(roomCode).emit('game_ended', { room, winner });
      } else {
        room.phase = 'NIGHT';
        room.votes = {};
        io.to(roomCode).emit('night_started', { room, eliminatedId });
      }
    }
  });

  socket.on('reset_game', ({ roomCode }) => {
    const room = rooms[roomCode];
    if (room && room.hostId === socket.id) {
      room.phase = 'LOBBY';
      room.winner = null;
      room.nightActions = {};
      room.votes = {};
      Object.values(room.players).forEach(player => {
        player.isAlive = true;
        player.role = null;
      });
      io.to(roomCode).emit('room_reset', room);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Real implementation should handle cleanup or reconnection
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
