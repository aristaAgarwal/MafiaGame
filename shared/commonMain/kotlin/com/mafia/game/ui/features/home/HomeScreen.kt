package com.mafia.game.ui.features.home

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import com.mafia.game.core.constants.AppColors
import com.mafia.game.core.constants.AppDimensions
import com.mafia.game.core.constants.AppStrings
import com.mafia.game.presentation.GameUiState
import com.mafia.game.ui.components.AvatarSelector
import com.mafia.game.ui.components.MafiaButton
import com.mafia.game.ui.components.MafiaButtonVariant
import com.mafia.game.ui.components.MafiaCard
import com.mafia.game.ui.components.MafiaInput

/**
 * Home & Room Entry Screen
 */
@Composable
fun HomeScreen(
    uiState: GameUiState,
    onCreateRoom: (String) -> Unit,
    onJoinRoom: (String, String) -> Unit,
    onOpenRules: () -> Unit,
    modifier: Modifier = Modifier
) {
    var nameInput by remember { mutableStateOf(uiState.localPlayer?.name ?: "") }
    var roomCodeInput by remember { mutableStateOf("") }
    var selectedAvatar by remember { mutableStateOf(uiState.localPlayer?.avatarId ?: "avatar_1") }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(AppDimensions.SpaceLarge),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = AppStrings.APP_TITLE,
            color = AppColors.Gold,
            fontSize = AppDimensions.TextDisplay,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )

        Text(
            text = AppStrings.APP_SUBTITLE,
            color = AppColors.TextMuted,
            fontSize = AppDimensions.TextSubtitle,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(AppDimensions.SpaceExtraLarge))

        MafiaCard(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = AppStrings.ENTER_NAME,
                color = AppColors.Gold,
                fontSize = AppDimensions.TextBody,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(AppDimensions.SpaceSmall))

            MafiaInput(
                value = nameInput,
                onValueChange = { nameInput = it },
                placeholder = "Your Nickname"
            )

            Spacer(modifier = Modifier.height(AppDimensions.SpaceMedium))

            AvatarSelector(
                selectedAvatarId = selectedAvatar,
                onAvatarSelected = { selectedAvatar = it }
            )

            Spacer(modifier = Modifier.height(AppDimensions.SpaceMedium))

            MafiaButton(
                text = AppStrings.CREATE_GAME,
                onClick = { onCreateRoom(nameInput) },
                enabled = nameInput.isNotBlank()
            )

            Spacer(modifier = Modifier.height(AppDimensions.SpaceMedium))

            MafiaInput(
                value = roomCodeInput,
                onValueChange = { roomCodeInput = it.uppercase() },
                placeholder = AppStrings.ENTER_CODE
            )

            Spacer(modifier = Modifier.height(AppDimensions.SpaceSmall))

            MafiaButton(
                text = AppStrings.JOIN_GAME,
                onClick = { onJoinRoom(roomCodeInput, nameInput) },
                variant = MafiaButtonVariant.SECONDARY,
                enabled = nameInput.isNotBlank() && roomCodeInput.isNotBlank()
            )
        }

        Spacer(modifier = Modifier.height(AppDimensions.SpaceLarge))

        MafiaButton(
            text = AppStrings.RULES,
            onClick = onOpenRules,
            variant = MafiaButtonVariant.SECONDARY
        )
    }
}
