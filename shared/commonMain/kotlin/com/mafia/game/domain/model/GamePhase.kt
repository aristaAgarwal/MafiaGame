package com.mafia.game.domain.model

import com.mafia.game.core.constants.AppStrings

/**
 * Game Progression Phases
 */
enum class GamePhase(val title: String) {
    HOME(AppStrings.APP_TITLE),
    LOBBY(AppStrings.LOBBY_TITLE),
    ROLE_REVEAL("ROLE REVEAL"),
    NIGHT(AppStrings.PHASE_NIGHT),
    DAY(AppStrings.PHASE_DAY),
    VOTING(AppStrings.PHASE_VOTING),
    END(AppStrings.PHASE_END);

    companion object {
        fun fromString(value: String?): GamePhase {
            return entries.find { it.name.equals(value, ignoreCase = true) } ?: HOME
        }
    }
}
