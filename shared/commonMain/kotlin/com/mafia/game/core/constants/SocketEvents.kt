package com.mafia.game.core.constants

/**
 * Centralized Socket.IO Event Name Constants
 * Matches server event contract in Server/src/
 */
object SocketEvents {
    // Client Emitters (Outgoing)
    const val CLIENT_CREATE_ROOM = "room:create"
    const val CLIENT_JOIN_ROOM = "room:join"
    const val CLIENT_LEAVE_ROOM = "room:leave"
    const val CLIENT_START_GAME = "game:start"
    const val CLIENT_CAST_VOTE = "vote:cast"
    const val CLIENT_NIGHT_ACTION = "night:action"
    const val CLIENT_SEND_CHAT = "chat:send"
    const val CLIENT_UPDATE_SETTINGS = "settings:update"

    // Server Listeners (Incoming)
    const val SERVER_ROOM_UPDATED = "room:updated"
    const val SERVER_GAME_STARTED = "game:started"
    const val SERVER_PHASE_CHANGED = "phase:changed"
    const val SERVER_VOTE_UPDATED = "vote:updated"
    const val SERVER_NIGHT_RESULT = "night:result"
    const val SERVER_CHAT_RECEIVED = "chat:received"
    const val SERVER_GAME_OVER = "game:over"
    const val SERVER_ERROR = "error"
}
