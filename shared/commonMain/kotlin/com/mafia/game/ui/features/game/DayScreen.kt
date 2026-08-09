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
 * Day Discussion Phase Screen
 */
@Composable
fun DayScreen(
    uiState: GameUiState,
    onSendChat: (String, ChatChannel) -> Unit,
    modifier: Modifier = Modifier
) {
    var showChatDrawer by remember { mutableStateOf(false) }

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
                text = AppStrings.PHASE_DAY,
                color = AppColors.Gold,
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
                text = AppStrings.INSTRUCT_DAY,
                color = AppColors.TextPrimary,
                fontSize = AppDimensions.TextBody
            )
        }

        Spacer(modifier = Modifier.height(AppDimensions.SpaceMedium))

        MafiaCard(modifier = Modifier.weight(1f)) {
            Text(
                text = AppStrings.PLAYERS_HEADER,
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

        MafiaButton(
            text = if (showChatDrawer) "Hide Discussion Chat" else "Open Discussion Chat",
            onClick = { showChatDrawer = !showChatDrawer },
            variant = MafiaButtonVariant.PRIMARY
        )

        if (showChatDrawer) {
            Spacer(modifier = Modifier.height(AppDimensions.SpaceMedium))
            ChatOverlay(
                messages = uiState.globalChatMessages,
                onSendMessage = onSendChat,
                isMafiaRole = (uiState.localPlayer?.role == Role.MAFIA)
            )
        }
    }
}
