package com.mafia.game.ui.components

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import com.mafia.game.core.constants.AppColors
import com.mafia.game.core.constants.AppDimensions

enum class MafiaButtonVariant {
    PRIMARY,
    SECONDARY,
    DANGER
}

/**
 * Reusable Custom Styled Mafia App Button
 */
@Composable
fun MafiaButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: MafiaButtonVariant = MafiaButtonVariant.PRIMARY,
    enabled: Boolean = true
) {
    val containerColor = when (variant) {
        MafiaButtonVariant.PRIMARY -> AppColors.ButtonPrimary
        MafiaButtonVariant.SECONDARY -> AppColors.SurfaceElevated
        MafiaButtonVariant.DANGER -> AppColors.RedBright
    }

    val contentColor = when (variant) {
        MafiaButtonVariant.PRIMARY, MafiaButtonVariant.DANGER -> AppColors.TextPrimary
        MafiaButtonVariant.SECONDARY -> AppColors.Gold
    }

    Button(
        onClick = onClick,
        modifier = modifier
            .fillMaxWidth()
            .height(AppDimensions.ButtonHeight),
        enabled = enabled,
        shape = RoundedCornerShape(AppDimensions.RadiusMedium),
        colors = ButtonDefaults.buttonColors(
            containerColor = containerColor,
            contentColor = contentColor,
            disabledContainerColor = AppColors.Surface,
            disabledContentColor = AppColors.TextMuted
        )
    ) {
        Text(
            text = text,
            fontSize = AppDimensions.TextSubtitle,
            fontWeight = FontWeight.Bold
        )
    }
}
