package com.mafia.game.presentation

import com.mafia.game.domain.model.ChatMessage
import com.mafia.game.domain.model.GamePhase
import com.mafia.game.domain.model.LobbySettings
import com.mafia.game.domain.model.Player

/**
 * Immutable Single Source of Truth for Mafia Game UI State
 */
data class GameUiState(
    val currentPhase: GamePhase = GamePhase.HOME,
    val roomCode: String = "",
    val localPlayer: Player? = null,
    val players: List<Player> = emptyList(),
    val settings: LobbySettings = LobbySettings(),
    val timerSecondsRemaining: Int = 0,
    val globalChatMessages: List<ChatMessage> = emptyList(),
    val mafiaChatMessages: List<ChatMessage> = emptyList(),
    val selectedVoteTargetId: String? = null,
    val selectedNightTargetId: String? = null,
    val isConnected: Boolean = false,
    val winnerTeam: String? = null,
    val toastMessage: String? = null
) {
    val isHost: Boolean
        get() = localPlayer?.isHost == true

    val isAlive: Boolean
        get() = localPlayer?.isAlive == true
}
