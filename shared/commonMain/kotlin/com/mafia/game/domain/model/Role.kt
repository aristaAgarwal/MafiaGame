package com.mafia.game.domain.model

import com.mafia.game.core.constants.AppColors
import com.mafia.game.core.constants.AppStrings

/**
 * Mafia Game Roles
 */
enum class Role(
    val title: String,
    val description: String,
    val colorHex: Long
) {
    MAFIA(
        title = AppStrings.ROLE_MAFIA,
        description = AppStrings.DESC_MAFIA,
        colorHex = 0xFFFF4A4A
    ),
    DOCTOR(
        title = AppStrings.ROLE_DOCTOR,
        description = AppStrings.DESC_DOCTOR,
        colorHex = 0xFFE8C06A
    ),
    DETECTIVE(
        title = AppStrings.ROLE_DETECTIVE,
        description = AppStrings.DESC_DETECTIVE,
        colorHex = 0xFFC8A04A
    ),
    CIVILIAN(
        title = AppStrings.ROLE_VILLAGER,
        description = AppStrings.DESC_VILLAGER,
        colorHex = 0xFFF0E8D8
    );

    companion object {
        fun fromString(value: String?): Role {
            return entries.find { it.name.equals(value, ignoreCase = true) } ?: CIVILIAN
        }
    }
}
