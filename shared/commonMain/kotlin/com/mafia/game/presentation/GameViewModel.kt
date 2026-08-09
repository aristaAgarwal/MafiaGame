package com.mafia.game.presentation

import com.mafia.game.data.socket.SocketRepository
import com.mafia.game.data.storage.SettingsRepository
import com.mafia.game.domain.model.ChatChannel
import com.mafia.game.domain.model.ChatMessage
import com.mafia.game.domain.model.GamePhase
import com.mafia.game.domain.model.LobbySettings
import com.mafia.game.domain.model.Player
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

/**
 * Main ViewModel managing game state and user intent actions.
 * Kept concise, readable, and easy to maintain.
 */
class GameViewModel(
    private val socketRepository: SocketRepository = SocketRepository(),
    private val settingsRepository: SettingsRepository = SettingsRepository(),
    private val scope: CoroutineScope = CoroutineScope(Dispatchers.Main)
) {
    private val _uiState = MutableStateFlow(GameUiState())
    val uiState: StateFlow<GameUiState> = _uiState.asStateFlow()

    private var timerJob: Job? = null

    init {
        // Load initial player profile from settings
        val name = settingsRepository.getPlayerName()
        val avatarId = settingsRepository.getAvatarId()
        _uiState.update { currentState ->
            currentState.copy(
                localPlayer = Player(id = "local_temp_id", name = name, avatarId = avatarId)
            )
        }
    }

    fun createRoom(playerName: String) {
        settingsRepository.setPlayerName(playerName)
        val avatarId = settingsRepository.getAvatarId()
        socketRepository.createRoom(playerName, avatarId)
        
        _uiState.update { currentState ->
            val hostPlayer = Player(
                id = "player_host",
                name = playerName,
                avatarId = avatarId,
                isHost = true
            )
            currentState.copy(
                currentPhase = GamePhase.LOBBY,
                localPlayer = hostPlayer,
                players = listOf(hostPlayer)
            )
        }
    }

    fun joinRoom(roomCode: String, playerName: String) {
        if (roomCode.isBlank()) return
        settingsRepository.setPlayerName(playerName)
        val avatarId = settingsRepository.getAvatarId()
        socketRepository.joinRoom(roomCode, playerName, avatarId)
        
        _uiState.update { currentState ->
            val joiningPlayer = Player(
                id = "player_guest",
                name = playerName,
                avatarId = avatarId,
                isHost = false
            )
            currentState.copy(
                roomCode = roomCode.uppercase(),
                currentPhase = GamePhase.LOBBY,
                localPlayer = joiningPlayer
            )
        }
    }

    fun leaveRoom() {
        val code = _uiState.value.roomCode
        if (code.isNotBlank()) {
            socketRepository.leaveRoom(code)
        }
        timerJob?.cancel()
        _uiState.update { GameUiState() }
    }

    fun startGame() {
        val code = _uiState.value.roomCode
        socketRepository.startGame(code)
    }

    fun selectVoteTarget(targetPlayerId: String) {
        _uiState.update { it.copy(selectedVoteTargetId = targetPlayerId) }
    }

    fun confirmVote() {
        val targetId = _uiState.value.selectedVoteTargetId ?: return
        val roomCode = _uiState.value.roomCode
        socketRepository.castVote(roomCode, targetId)
    }

    fun selectNightTarget(targetPlayerId: String) {
        _uiState.update { it.copy(selectedNightTargetId = targetPlayerId) }
    }

    fun confirmNightAction() {
        val targetId = _uiState.value.selectedNightTargetId ?: return
        val roomCode = _uiState.value.roomCode
        socketRepository.performNightAction(roomCode, targetId)
    }

    fun sendChatMessage(text: String, channel: ChatChannel) {
        if (text.isBlank()) return
        val roomCode = _uiState.value.roomCode
        val isMafiaChannel = (channel == ChatChannel.MAFIA)
        socketRepository.sendChatMessage(roomCode, text, isMafiaChannel)
    }

    fun updateSettings(newSettings: LobbySettings) {
        _uiState.update { it.copy(settings = newSettings) }
        val code = _uiState.value.roomCode
        socketRepository.updateSettings(code, newSettings)
    }

    fun startPhaseTimer(durationSeconds: Int) {
        timerJob?.cancel()
        timerJob = scope.launch {
            var remaining = durationSeconds
            while (remaining >= 0) {
                _uiState.update { it.copy(timerSecondsRemaining = remaining) }
                delay(1000L)
                remaining--
            }
        }
    }
}
