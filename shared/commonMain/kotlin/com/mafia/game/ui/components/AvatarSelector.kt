package com.mafia.game.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.LazyRow
import androidx.compose.foundation.layout.items
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import com.mafia.game.core.constants.AppColors
import com.mafia.game.core.constants.AppDimensions

val AVAILABLE_AVATARS = listOf("avatar_1", "avatar_2", "avatar_3", "avatar_4", "avatar_5", "avatar_6")

/**
 * Avatar Selection Picker Row
 */
@Composable
fun AvatarSelector(
    selectedAvatarId: String,
    onAvatarSelected: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    LazyRow(
        modifier = modifier.padding(vertical = AppDimensions.SpaceSmall),
        horizontalArrangement = Arrangement.spacedBy(AppDimensions.SpaceSmall)
    ) {
        items(AVAILABLE_AVATARS) { avatarId ->
            val isSelected = (avatarId == selectedAvatarId)
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(AppDimensions.AvatarSizeSmall)
                    .clip(CircleShape)
                    .background(AppColors.SurfaceElevated)
                    .border(
                        width = if (isSelected) AppDimensions.BorderMedium else AppDimensions.BorderThin,
                        color = if (isSelected) AppColors.Gold else AppColors.Border,
                        shape = CircleShape
                    )
                    .clickable { onAvatarSelected(avatarId) }
            ) {
                Text(
                    text = avatarId.takeLast(1),
                    color = AppColors.TextPrimary,
                    fontSize = AppDimensions.TextCaption,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}
