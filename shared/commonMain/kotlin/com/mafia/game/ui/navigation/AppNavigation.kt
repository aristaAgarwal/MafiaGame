package com.mafia.game.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.mafia.game.domain.model.GamePhase
import com.mafia.game.presentation.GameUiState
import com.mafia.game.presentation.GameViewModel
import com.mafia.game.ui.features.game.DayScreen
import com.mafia.game.ui.features.game.EndScreen
import com.mafia.game.ui.features.game.NightScreen
import com.mafia.game.ui.features.game.RoleRevealScreen
import com.mafia.game.ui.features.game.VotingScreen
import com.mafia.game.ui.features.home.HomeScreen
import com.mafia.game.ui.features.home.RulesScreen
import com.mafia.game.ui.features.lobby.LobbyScreen

/**
 * Type-Safe Screen Navigation Router
 */
@Composable
fun AppNavigation(
    uiState: GameUiState,
    viewModel: GameViewModel,
    modifier: Modifier = Modifier
) {
    var isShowingRules by remember { mutableStateOf(false) }

    if (isShowingRules) {
        RulesScreen(
            onClose = { isShowingRules = false },
            modifier = modifier
        )
        return
    }

    when (uiState.currentPhase) {
        GamePhase.HOME -> HomeScreen(
            uiState = uiState,
            onCreateRoom = { name -> viewModel.createRoom(name) },
            onJoinRoom = { code, name -> viewModel.joinRoom(code, name) },
            onOpenRules = { isShowingRules = true },
            modifier = modifier
        )

        GamePhase.LOBBY -> LobbyScreen(
            uiState = uiState,
            onStartGame = { viewModel.startGame() },
            onLeaveRoom = { viewModel.leaveRoom() },
            onUpdateSettings = { settings -> viewModel.updateSettings(settings) },
            modifier = modifier
        )

        GamePhase.ROLE_REVEAL -> RoleRevealScreen(
            uiState = uiState,
            onConfirmRole = { /* Role confirmed action */ },
            modifier = modifier
        )

        GamePhase.NIGHT -> NightScreen(
            uiState = uiState,
            onSelectTarget = { targetId -> viewModel.selectNightTarget(targetId) },
            onConfirmAction = { viewModel.confirmNightAction() },
            onSendChat = { text, channel -> viewModel.sendChatMessage(text, channel) },
            modifier = modifier
        )

        GamePhase.DAY -> DayScreen(
            uiState = uiState,
            onSendChat = { text, channel -> viewModel.sendChatMessage(text, channel) },
            modifier = modifier
        )

        GamePhase.VOTING -> VotingScreen(
            uiState = uiState,
            onSelectVoteTarget = { targetId -> viewModel.selectVoteTarget(targetId) },
            onConfirmVote = { viewModel.confirmVote() },
            modifier = modifier
        )

        GamePhase.END -> EndScreen(
            uiState = uiState,
            onReturnToHome = { viewModel.leaveRoom() },
            modifier = modifier
        )
    }
}
