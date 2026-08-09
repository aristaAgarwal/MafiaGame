package com.mafia.game.ui

import androidx.compose.ui.window.ComposeUIViewController
import platform.UIKit.UIViewController

/**
 * iOS ViewController Launcher Entry Point
 * Renders the shared Compose Multiplatform App on iOS
 */
fun MainViewController(): UIViewController = ComposeUIViewController {
    App()
}
