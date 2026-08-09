package com.mafia.game.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import com.mafia.game.core.constants.AppColors
import com.mafia.game.core.constants.AppDimensions
import com.mafia.game.domain.model.Player

/**
 * Player Avatar Badge with Status Indicator & Selection Ring
 */
@Composable
fun PlayerAvatar(
    player: Player,
    modifier: Modifier = Modifier,
    isSelected: Boolean = false,
    size: Dp = AppDimensions.AvatarSizeMedium,
    onClick: (() -> Unit)? = null
) {
    val borderColor = when {
        isSelected -> AppColors.Gold
        !player.isAlive -> AppColors.TextMuted
        else -> AppColors.Border
    }

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = modifier.clickable(enabled = onClick != null) { onClick?.invoke() }
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .size(size)
                .clip(CircleShape)
                .background(AppColors.SurfaceElevated)
                .border(
                    width = if (isSelected) AppDimensions.BorderMedium else AppDimensions.BorderThin,
                    color = borderColor,
                    shape = CircleShape
                )
        ) {
            Text(
                text = player.name.take(2).uppercase(),
                color = if (player.isAlive) AppColors.TextPrimary else AppColors.TextMuted,
                fontSize = AppDimensions.TextSubtitle,
                fontWeight = FontWeight.Bold
            )

            if (player.isHost) {
                Box(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .size(AppDimensions.SpaceMedium)
                        .background(AppColors.Gold, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text("★", fontSize = AppDimensions.TextCaption, color = AppColors.Black)
                }
            }
        }

        Spacer(modifier = Modifier.height(AppDimensions.SpaceExtraSmall))

        Text(
            text = player.name,
            color = if (player.isAlive) AppColors.TextPrimary else AppColors.TextMuted,
            fontSize = AppDimensions.TextCaption,
            fontWeight = FontWeight.Medium
        )
    }
}
