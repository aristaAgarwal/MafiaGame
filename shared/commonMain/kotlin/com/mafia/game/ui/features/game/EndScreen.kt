package com.mafia.game.ui.features.game

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import com.mafia.game.core.constants.AppColors
import com.mafia.game.core.constants.AppDimensions
import com.mafia.game.core.constants.AppStrings
import com.mafia.game.presentation.GameUiState
import com.mafia.game.ui.components.MafiaButton
import com.mafia.game.ui.components.MafiaCard

/**
 * Game Over & Victory Breakdown Screen
 */
@Composable
fun EndScreen(
    uiState: GameUiState,
    onReturnToHome: () -> Unit,
    modifier: Modifier = Modifier
) {
    val winningTeam = uiState.winnerTeam ?: "VILLAGERS"
    val victoryTitle = if (winningTeam.contains("MAFIA", ignoreCase = true)) {
        "MAFIA VICTORY"
    } else {
        "CIVILIAN VICTORY"
    }

    val bannerColor = if (winningTeam.contains("MAFIA", ignoreCase = true)) {
        AppColors.RedBright
    } else {
        AppColors.Gold
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(AppDimensions.SpaceLarge),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = AppStrings.PHASE_END,
            color = AppColors.TextMuted,
            fontSize = AppDimensions.TextSubtitle,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(AppDimensions.SpaceMedium))

        Text(
            text = victoryTitle,
            color = bannerColor,
            fontSize = AppDimensions.TextDisplay,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(AppDimensions.SpaceLarge))

        MafiaCard(modifier = Modifier.weight(1f)) {
            Text(
                text = "ROLE SUMMARY",
                color = AppColors.Gold,
                fontSize = AppDimensions.TextSubtitle,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(AppDimensions.SpaceMedium))

            LazyColumn(modifier = Modifier.fillMaxWidth()) {
                items(uiState.players) { player ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = AppDimensions.SpaceSmall),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = player.name,
                            color = AppColors.TextPrimary,
                            fontSize = AppDimensions.TextBody
                        )
                        Text(
                            text = player.role.title,
                            color = AppColors.Gold,
                            fontSize = AppDimensions.TextBody,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(AppDimensions.SpaceMedium))

        MafiaButton(
            text = "RETURN TO MAIN MENU",
            onClick = onReturnToHome
        )
    }
}
