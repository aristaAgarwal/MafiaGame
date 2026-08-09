package com.mafia.game.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.mafia.game.core.constants.AppColors
import com.mafia.game.core.constants.AppDimensions
import com.mafia.game.core.constants.AppStrings
import com.mafia.game.ui.theme.MafiaTheme

/**
 * Root Entry Composable for Android & iOS Shared UI
 */
@Composable
fun App() {
    MafiaTheme {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(AppColors.Background),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = AppStrings.APP_TITLE,
                color = AppColors.Gold,
                fontSize = AppDimensions.TextDisplay
            )
        }
    }
}
