package com.mafia.game.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import com.mafia.game.core.constants.AppColors
import com.mafia.game.core.constants.AppDimensions

/**
 * Custom Status Toast Popup Banner
 */
@Composable
fun MafiaToast(
    message: String,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .padding(AppDimensions.SpaceMedium)
            .background(
                color = AppColors.ToastBg,
                shape = RoundedCornerShape(AppDimensions.RadiusMedium)
            )
            .border(
                width = AppDimensions.BorderThin,
                color = AppColors.BorderGold,
                shape = RoundedCornerShape(AppDimensions.RadiusMedium)
            )
            .padding(AppDimensions.SpaceMedium),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = message,
            color = AppColors.Gold,
            fontSize = AppDimensions.TextSubtitle,
            textAlign = TextAlign.Center
        )
    }
}
