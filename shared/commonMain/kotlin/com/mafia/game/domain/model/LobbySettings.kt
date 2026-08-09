package com.mafia.game.domain.model

import kotlinx.serialization.Serializable

/**
 * Customizable Lobby & Game Rules Settings
 */
@Serializable
data class LobbySettings(
    val mafiaCount: Int = 1,
    val doctorCount: Int = 1,
    val detectiveCount: Int = 1,
    val nightDurationSeconds: Int = 30,
    val dayDurationSeconds: Int = 60,
    val votingDurationSeconds: Int = 30,
    val allowSelfHeal: Boolean = true,
    val anonymousVoting: Boolean = false
)
