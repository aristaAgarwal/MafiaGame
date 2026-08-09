package com.mafia.game.ui.features.home

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import com.mafia.game.core.constants.AppColors
import com.mafia.game.core.constants.AppDimensions
import com.mafia.game.core.constants.AppStrings
import com.mafia.game.domain.model.Role
import com.mafia.game.ui.components.MafiaButton
import com.mafia.game.ui.components.MafiaButtonVariant
import com.mafia.game.ui.components.MafiaCard

/**
 * How to Play Rules & Roles Summary Screen
 */
@Composable
fun RulesScreen(
    onClose: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(AppDimensions.SpaceLarge)
            .verticalScroll(rememberScrollState())
    ) {
        Text(
            text = AppStrings.RULES,
            color = AppColors.Gold,
            fontSize = AppDimensions.TextHeader,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(AppDimensions.SpaceMedium))

        Role.entries.forEach { role ->
            MafiaCard(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = role.title,
                    color = AppColors.Gold,
                    fontSize = AppDimensions.TextSubtitle,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(AppDimensions.SpaceExtraSmall))
                Text(
                    text = role.description,
                    color = AppColors.TextPrimary,
                    fontSize = AppDimensions.TextBody
                )
            }
            Spacer(modifier = Modifier.height(AppDimensions.SpaceMedium))
        }

        MafiaButton(
            text = AppStrings.CLOSE,
            onClick = onClose,
            variant = MafiaButtonVariant.SECONDARY
        )
    }
}
