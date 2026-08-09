package com.mafia.game.ui.features.lobby

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import com.mafia.game.core.constants.AppColors
import com.mafia.game.core.constants.AppDimensions
import com.mafia.game.core.constants.AppStrings
import com.mafia.game.domain.model.LobbySettings
import com.mafia.game.presentation.GameUiState
import com.mafia.game.ui.components.LobbySettingsView
import com.mafia.game.ui.components.MafiaButton
import com.mafia.game.ui.components.MafiaButtonVariant
import com.mafia.game.ui.components.MafiaCard
import com.mafia.game.ui.components.PlayerAvatar

/**
 * Lobby Room Screen
 */
@Composable
fun LobbyScreen(
    uiState: GameUiState,
    onStartGame: () -> Unit,
    onLeaveRoom: () -> Unit,
    onUpdateSettings: (LobbySettings) -> Unit,
    modifier: Modifier = Modifier
) {
    var showSettingsSheet by remember { mutableStateOf(false) }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(AppDimensions.SpaceLarge)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = AppStrings.LOBBY_TITLE,
                    color = AppColors.Gold,
                    fontSize = AppDimensions.TextHeader,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "ROOM CODE: ${uiState.roomCode}",
                    color = AppColors.TextPrimary,
                    fontSize = AppDimensions.TextSubtitle
                )
            }

            if (uiState.isHost) {
                MafiaButton(
                    text = "Settings",
                    onClick = { showSettingsSheet = !showSettingsSheet },
                    variant = MafiaButtonVariant.SECONDARY,
                    modifier = Modifier.height(AppDimensions.InputHeight)
                )
            }
        }

        Spacer(modifier = Modifier.height(AppDimensions.SpaceMedium))

        if (showSettingsSheet && uiState.isHost) {
            LobbySettingsView(
                settings = uiState.settings,
                onSettingsChanged = onUpdateSettings,
                isHost = uiState.isHost
            )
            Spacer(modifier = Modifier.height(AppDimensions.SpaceMedium))
        }

        MafiaCard(modifier = Modifier.weight(1f)) {
            Text(
                text = "${AppStrings.PLAYERS_HEADER} (${uiState.players.size})",
                color = AppColors.Gold,
                fontSize = AppDimensions.TextSubtitle,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(AppDimensions.SpaceMedium))

            LazyVerticalGrid(
                columns = GridCells.Fixed(3),
                verticalArrangement = Arrangement.spacedBy(AppDimensions.SpaceMedium),
                horizontalArrangement = Arrangement.spacedBy(AppDimensions.SpaceMedium)
            ) {
                items(uiState.players) { player ->
                    PlayerAvatar(player = player)
                }
            }
        }

        Spacer(modifier = Modifier.height(AppDimensions.SpaceMedium))

        if (uiState.isHost) {
            MafiaButton(
                text = AppStrings.START_GAME,
                onClick = onStartGame,
                enabled = uiState.players.size >= 4
            )
        }

        Spacer(modifier = Modifier.height(AppDimensions.SpaceSmall))

        MafiaButton(
            text = AppStrings.LEAVE_GAME,
            onClick = onLeaveRoom,
            variant = MafiaButtonVariant.SECONDARY
        )
    }
}
