package com.mafia.game.core.constants

import androidx.compose.ui.graphics.Color

/**
 * Centralized Color Palette for Mafia Game
 * Matches the dark, mysterious theme with gold accents and crimson highlights.
 */
object AppColors {
    val Background = Color(0xFF0D0B0A)
    val Surface = Color(0x4D443F3F) // rgba(68, 63, 63, 0.3)
    val SurfaceElevated = Color(0xFF221C17)
    
    val Gold = Color(0xFFE8C06A)
    val RedAccent = Color(0xFF8B2020)
    val RedBright = Color(0xFFFF4A4A)
    val ButtonPrimary = Color(0xFF8B0000)
    
    val TextPrimary = Color(0xFFF0E8D8)
    val TextMuted = Color(0xFF6B5E4E)
    
    val Border = Color(0xFF3A2E22)
    val BorderGold = Color(0x66C8A04A) // rgba(200, 160, 74, 0.4)
    val CardBorder = Color(0xFFD5BF9A)
    val CardDivider = Color(0xFF80736E)
    val BorderLight = Color(0x1AFFFFFF) // rgba(255, 255, 255, 0.1)
    val BorderSubtle = Color(0x0DFFFFFF) // rgba(255, 255, 255, 0.05)
    val GoldTranslucent = Color(0x4DE8C06A) // rgba(232, 192, 106, 0.3)

    // Role Colors
    val Mafia = Color(0xFFFF4A4A)
    val Police = Color(0xFFC8A04A)
    val Doctor = Color(0xFFE8C06A)
    val Villager = Color(0xFFF0E8D8)

    // Utility Colors
    val White = Color(0xFFFFFFFF)
    val WhiteTranslucent = Color(0x4DFFFFFF)
    val Black = Color(0xFF000000)
    
    val BottomNavBg = Color(0xFF141210)
    val BottomNavBorder = Color(0xFF2A2018)
    val NavIconInactive = Color(0xFF4A3E32)
    val TitleShadow = Color(0x26C8A04A)

    // Overlays
    val OverlayGold05 = Color(0x0DE8C06A)
    val OverlayGold08 = Color(0x14E8C06A)
    val OverlayGold20 = Color(0x33E8C06A)
    val OverlayRed05 = Color(0x0DC0392B)
    val OverlayRed15 = Color(0x268B2020)
    val OverlayRed20 = Color(0x33C0392B)
    val OverlayRedBright30 = Color(0x4DFF4A4A)
    val InputOverlayBg = Color(0x66000000)
    val DarkTintOverlay = Color(0xD10A0807)
    val ToastBg = Color(0xF21A1612)

    // Phase Gradient Pairs [Start, End]
    val NightGradient = listOf(Color(0xFF140F0B), Color(0xFF0D0B0A))
    val DayGradient = listOf(Color(0xFF261D15), Color(0xFF0D0B0A))
    val VotingGradient = listOf(Color(0xFF2C1311), Color(0xFF0D0B0A))
    val MafiaVictoryGradient = listOf(Color(0xFF3D1515), Color(0xFF0D0B0A))
    val VillagerVictoryGradient = listOf(Color(0xFF17261B), Color(0xFF0D0B0A))
    val DefaultGradient = listOf(Color(0xFF1F1A15), Color(0xFF0D0B0A))
}
