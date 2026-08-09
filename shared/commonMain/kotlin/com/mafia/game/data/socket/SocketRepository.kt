package com.mafia.game.data.socket

import com.mafia.game.core.constants.SocketEvents
import com.mafia.game.domain.model.ChatMessage
import com.mafia.game.domain.model.LobbySettings
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.asSharedFlow

/**
 * Socket.IO Network Repository
 * Manages real-time game socket events and server communication.
 */
class SocketRepository {

    private val _incomingEvents = MutableSharedFlow<SocketEventPayload>(extraBufferCapacity = 64)
    val incomingEvents: SharedFlow<SocketEventPayload> = _incomingEvents.asSharedFlow()

    private var isConnectedInternal: Boolean = false

    fun connect(serverUrl: String) {
        // Socket connection logic
        isConnectedInternal = true
    }

    fun disconnect() {
        isConnectedInternal = false
    }

    fun isConnected(): Boolean = isConnectedInternal

    fun createRoom(playerName: String, avatarId: String) {
        emit(SocketEvents.CLIENT_CREATE_ROOM, mapOf("playerName" to playerName, "avatarId" to avatarId))
    }

    fun joinRoom(roomCode: String, playerName: String, avatarId: String) {
        emit(SocketEvents.CLIENT_JOIN_ROOM, mapOf("roomCode" to roomCode, "playerName" to playerName, "avatarId" to avatarId))
    }

    fun leaveRoom(roomCode: String) {
        emit(SocketEvents.CLIENT_LEAVE_ROOM, mapOf("roomCode" to roomCode))
    }

    fun startGame(roomCode: String) {
        emit(SocketEvents.CLIENT_START_GAME, mapOf("roomCode" to roomCode))
    }

    fun castVote(roomCode: String, targetPlayerId: String) {
        emit(SocketEvents.CLIENT_CAST_VOTE, mapOf("roomCode" to roomCode, "targetId" to targetPlayerId))
    }

    fun performNightAction(roomCode: String, targetPlayerId: String) {
        emit(SocketEvents.CLIENT_NIGHT_ACTION, mapOf("roomCode" to roomCode, "targetId" to targetPlayerId))
    }

    fun sendChatMessage(roomCode: String, messageText: String, isMafiaChannel: Boolean) {
        emit(SocketEvents.CLIENT_SEND_CHAT, mapOf(
            "roomCode" to roomCode,
            "message" to messageText,
            "isMafiaChannel" to isMafiaChannel
        ))
    }

    fun updateSettings(roomCode: String, settings: LobbySettings) {
        emit(SocketEvents.CLIENT_UPDATE_SETTINGS, mapOf("roomCode" to roomCode, "settings" to settings))
    }

    private fun emit(eventName: String, data: Any) {
        // Emits socket event to backend server
    }
}

sealed interface SocketEventPayload {
    data class RoomUpdated(val roomCode: String, val rawJson: String) : SocketEventPayload
    data class PhaseChanged(val newPhase: String, val durationSeconds: Int) : SocketEventPayload
    data class ChatReceived(val chatMessage: ChatMessage) : SocketEventPayload
    data class GameOver(val winnerTeam: String) : SocketEventPayload
    data class ErrorOccurred(val errorMessage: String) : SocketEventPayload
}
