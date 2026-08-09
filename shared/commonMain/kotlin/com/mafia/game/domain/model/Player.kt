package com.mafia.game.domain.model

import kotlinx.serialization.Serializable

/**
 * Player Domain Entity
 */
@Serializable
data class Player(
    val id: String,
    val name: String,
    val avatarId: String = "avatar_1",
    val isHost: Boolean = false,
    val isAlive: Boolean = true,
    val role: Role = Role.CIVILIAN,
    val isReady: Boolean = false,
    val votesReceived: Int = 0
)
