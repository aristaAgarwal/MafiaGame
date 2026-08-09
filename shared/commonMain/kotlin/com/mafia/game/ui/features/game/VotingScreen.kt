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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import com.mafia.game.core.constants.AppColors
import com.mafia.game.core.constants.AppDimensions
import com.mafia.game.core.constants.AppStrings
import com.mafia.game.presentation.GameUiState
import com.mafia.game.ui.components.MafiaButton
import com.mafia.game.ui.components.MafiaCard
import com.mafia.game.ui.components.PlayerAvatar

/**
 * Voting Phase Screen
 */
@Composable
fun VotingScreen(
    uiState: GameUiState,
    onSelectVoteTarget: (String) -> Unit,
    onConfirmVote: () -> Unit,
    modifier: Modifier = Modifier
) {
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
                text = AppStrings.PHASE_VOTING,
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
                text = AppStrings.INSTRUCT_VOTING,
                color = AppColors.TextPrimary,
                fontSize = AppDimensions.TextBody
            )
        }

        Spacer(modifier = Modifier.height(AppDimensions.SpaceMedium))

        MafiaCard(modifier = Modifier.weight(1f)) {
            Text(
                text = "CAST YOUR VOTE",
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
                        isSelected = (player.id == uiState.selectedVoteTargetId),
                        onClick = {
                            if (uiState.isAlive) {
                                onSelectVoteTarget(player.id)
                            }
                        }
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(AppDimensions.SpaceMedium))

        if (uiState.isAlive) {
            MafiaButton(
                text = "SUBMIT VOTE",
                onClick = onConfirmVote,
                enabled = uiState.selectedVoteTargetId != null
            )
        } else {
            Text(
                text = "You are eliminated. You can observe the vote.",
                color = AppColors.TextMuted,
                fontSize = AppDimensions.TextBody
            )
        }
    }
}
