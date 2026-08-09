package com.mafia.game.ui.features.game

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
import com.mafia.game.domain.model.ChatChannel
import com.mafia.game.domain.model.Role
import com.mafia.game.presentation.GameUiState
import com.mafia.game.ui.components.ChatOverlay
import com.mafia.game.ui.components.MafiaButton
import com.mafia.game.ui.components.MafiaButtonVariant
import com.mafia.game.ui.components.MafiaCard
import com.mafia.game.ui.components.PlayerAvatar

/**
 * Night Action Phase Screen
 */
@Composable
fun NightScreen(
    uiState: GameUiState,
    onSelectTarget: (String) -> Unit,
    onConfirmAction: () -> Unit,
    onSendChat: (String, ChatChannel) -> Unit,
    modifier: Modifier = Modifier
) {
    var showChatDrawer by remember { mutableStateOf(false) }
    val myRole = uiState.localPlayer?.role ?: Role.CIVILIAN
    val instruction = when (myRole) {
        Role.MAFIA -> AppStrings.INSTRUCT_NIGHT_MAFIA
        Role.DOCTOR -> AppStrings.INSTRUCT_NIGHT_DOCTOR
        Role.DETECTIVE -> AppStrings.INSTRUCT_NIGHT_DETECTIVE
        Role.CIVILIAN -> AppStrings.INSTRUCT_NIGHT_VILLAGER
    }

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
            Text(
                text = AppStrings.PHASE_NIGHT,
                color = AppColors.RedBright,
                fontSize = AppDimensions.TextHeader,
                fontWeight = FontWeight.Bold
            )

            Text(
                text = "${uiState.timerSecondsRemaining}s",
                color = AppColors.Gold,
                fontSize = AppDimensions.TextHeader,
                fontWeight = FontWeight.Bold
            )
        }

        Spacer(modifier = Modifier.height(AppDimensions.SpaceMedium))

        MafiaCard(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = instruction,
                color = AppColors.TextPrimary,
                fontSize = AppDimensions.TextBody
            )
        }

        Spacer(modifier = Modifier.height(AppDimensions.SpaceMedium))

        MafiaCard(modifier = Modifier.weight(1f)) {
            Text(
                text = "SELECT TARGET",
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
                items(uiState.players.filter { it.isAlive }) { player ->
                    PlayerAvatar(
                        player = player,
                        isSelected = (player.id == uiState.selectedNightTargetId),
                        onClick = { onSelectTarget(player.id) }
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(AppDimensions.SpaceMedium))

        if (myRole != Role.CIVILIAN) {
            MafiaButton(
                text = AppStrings.CONFIRM,
                onClick = onConfirmAction,
                enabled = uiState.selectedNightTargetId != null
            )
            Spacer(modifier = Modifier.height(AppDimensions.SpaceSmall))
        }

        MafiaButton(
            text = if (showChatDrawer) "Hide Chat" else "Chat Overlay",
            onClick = { showChatDrawer = !showChatDrawer },
            variant = MafiaButtonVariant.SECONDARY
        )

        if (showChatDrawer) {
            Spacer(modifier = Modifier.height(AppDimensions.SpaceMedium))
            ChatOverlay(
                messages = uiState.globalChatMessages + uiState.mafiaChatMessages,
                onSendMessage = onSendChat,
                isMafiaRole = (myRole == Role.MAFIA)
            )
        }
    }
}
