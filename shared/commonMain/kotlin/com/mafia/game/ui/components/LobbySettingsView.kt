package com.mafia.game.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import com.mafia.game.core.constants.AppColors
import com.mafia.game.core.constants.AppDimensions
import com.mafia.game.core.constants.AppStrings
import com.mafia.game.domain.model.LobbySettings

/**
 * Lobby Rules & Game Options Configuration View
 */
@Composable
fun LobbySettingsView(
    settings: LobbySettings,
    onSettingsChanged: (LobbySettings) -> Unit,
    isHost: Boolean,
    modifier: Modifier = Modifier
) {
    MafiaCard(modifier = modifier) {
        Text(
            text = AppStrings.LOBBY_SETTINGS,
            color = AppColors.Gold,
            fontSize = AppDimensions.TextSubtitle,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(AppDimensions.SpaceMedium))

        SettingRow(
            label = "Mafia Count",
            value = "${settings.mafiaCount}",
            onDecrement = { if (isHost && settings.mafiaCount > 1) onSettingsChanged(settings.copy(mafiaCount = settings.mafiaCount - 1)) },
            onIncrement = { if (isHost && settings.mafiaCount < 5) onSettingsChanged(settings.copy(mafiaCount = settings.mafiaCount + 1)) }
        )

        SettingRow(
            label = "Night Phase (sec)",
            value = "${settings.nightDurationSeconds}",
            onDecrement = { if (isHost && settings.nightDurationSeconds > 15) onSettingsChanged(settings.copy(nightDurationSeconds = settings.nightDurationSeconds - 5)) },
            onIncrement = { if (isHost && settings.nightDurationSeconds < 120) onSettingsChanged(settings.copy(nightDurationSeconds = settings.nightDurationSeconds + 5)) }
        )

        SettingRow(
            label = "Day Discussion (sec)",
            value = "${settings.dayDurationSeconds}",
            onDecrement = { if (isHost && settings.dayDurationSeconds > 30) onSettingsChanged(settings.copy(dayDurationSeconds = settings.dayDurationSeconds - 10)) },
            onIncrement = { if (isHost && settings.dayDurationSeconds < 300) onSettingsChanged(settings.copy(dayDurationSeconds = settings.dayDurationSeconds + 10)) }
        )
    }
}

@Composable
private fun SettingRow(
    label: String,
    value: String,
    onDecrement: () -> Unit,
    onIncrement: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(AppDimensions.ButtonHeight),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = label, color = AppColors.TextPrimary, fontSize = AppDimensions.TextBody)

        Row(verticalAlignment = Alignment.CenterVertically) {
            MafiaButton(text = "-", onClick = onDecrement, modifier = Modifier.height(AppDimensions.InputHeight))
            Text(
                text = value,
                color = AppColors.Gold,
                fontSize = AppDimensions.TextSubtitle,
                fontWeight = FontWeight.Bold
            )
            MafiaButton(text = "+", onClick = onIncrement, modifier = Modifier.height(AppDimensions.InputHeight))
        }
    }
}
