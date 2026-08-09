package com.mafia.game.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.mafia.game.core.constants.AppColors
import com.mafia.game.core.constants.AppDimensions

/**
 * Glassmorphism Translucent Surface Card Container
 */
@Composable
fun MafiaCard(
    modifier: Modifier = Modifier,
    borderColor: Color = AppColors.BorderGold,
    content: @Composable ColumnScope.() -> Unit
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(AppDimensions.RadiusMedium),
        colors = CardDefaults.cardColors(
            containerColor = AppColors.Surface
        ),
        border = BorderStroke(AppDimensions.BorderThin, borderColor)
    ) {
        Column(
            modifier = Modifier.padding(AppDimensions.SpaceMedium),
            content = content
        )
    }
}
