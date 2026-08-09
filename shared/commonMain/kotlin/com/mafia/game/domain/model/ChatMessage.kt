package com.mafia.game.domain.model

import kotlinx.serialization.Serializable

/**
 * Chat Channel Type
 */
enum class ChatChannel {
    GLOBAL,
    MAFIA
}

/**
 * Chat Message Model
 */
@Serializable
data class ChatMessage(
    val id: String,
    val senderId: String,
    val senderName: String,
    val messageText: String,
    val timestamp: Long,
    val channel: ChatChannel = ChatChannel.GLOBAL
)
