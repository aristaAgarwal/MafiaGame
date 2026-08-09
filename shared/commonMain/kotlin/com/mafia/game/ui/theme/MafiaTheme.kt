package com.mafia.game.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import com.mafia.game.core.constants.AppColors

private val DarkColorScheme = darkColorScheme(
    primary = AppColors.ButtonPrimary,
    onPrimary = AppColors.TextPrimary,
    secondary = AppColors.Gold,
    onSecondary = AppColors.Black,
    background = AppColors.Background,
    onBackground = AppColors.TextPrimary,
    surface = AppColors.Surface,
    onSurface = AppColors.TextPrimary,
    error = AppColors.RedBright
)

/**
 * Mafia App Global Compose Theme Wrapper
 */
@Composable
fun MafiaTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
