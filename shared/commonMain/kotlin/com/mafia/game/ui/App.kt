package com.mafia.game.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import com.mafia.game.core.constants.AppColors
import com.mafia.game.presentation.GameViewModel
import com.mafia.game.ui.navigation.AppNavigation
import com.mafia.game.ui.theme.MafiaTheme

/**
 * Root Entry Composable for Android & iOS Shared UI
 */
@Composable
fun App() {
    val viewModel = remember { GameViewModel() }
    val uiState by viewModel.uiState.collectAsState()

    MafiaTheme {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(AppColors.Background)
        ) {
            AppNavigation(
                uiState = uiState,
                viewModel = viewModel
            )
        }
    }
}
