package com.mafia.game.ui.features.game

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import com.mafia.game.core.constants.AppColors
import com.mafia.game.core.constants.AppDimensions
import com.mafia.game.core.constants.AppStrings
import com.mafia.game.domain.model.Role
import com.mafia.game.presentation.GameUiState
import com.mafia.game.ui.components.MafiaButton
import com.mafia.game.ui.components.MafiaCard

/**
 * Secret Role Reveal Screen
 */
@Composable
fun RoleRevealScreen(
    uiState: GameUiState,
    onConfirmRole: () -> Unit,
    modifier: Modifier = Modifier
) {
    val assignedRole = uiState.localPlayer?.role ?: Role.CIVILIAN

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(AppDimensions.SpaceLarge),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "YOUR SECRET ROLE",
            color = AppColors.TextMuted,
            fontSize = AppDimensions.TextSubtitle,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(AppDimensions.SpaceLarge))

        MafiaCard(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = assignedRole.title,
                color = AppColors.Gold,
                fontSize = AppDimensions.TextDisplay,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(AppDimensions.SpaceMedium))

            Text(
                text = assignedRole.description,
                color = AppColors.TextPrimary,
                fontSize = AppDimensions.TextSubtitle,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth()
            )
        }

        Spacer(modifier = Modifier.height(AppDimensions.SpaceExtraLarge))

        MafiaButton(
            text = AppStrings.CONFIRM,
            onClick = onConfirmRole
        )
    }
}
