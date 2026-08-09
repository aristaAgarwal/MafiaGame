package com.mafia.game.data.storage

/**
 * Key-Value Storage Repository for User Preferences & Local Profile
 * Replaces storage.ts with a clean, readable Kotlin interface.
 */
class SettingsRepository {
    private var cachedPlayerName: String = "Player"
    private var cachedAvatarId: String = "avatar_1"
    private var cachedBgmVolume: Float = 0.5f
    private var cachedSfxVolume: Float = 0.8f

    fun getPlayerName(): String = cachedPlayerName

    fun setPlayerName(name: String) {
        cachedPlayerName = name.ifBlank { "Player" }
    }

    fun getAvatarId(): String = cachedAvatarId

    fun setAvatarId(avatarId: String) {
        cachedAvatarId = avatarId
    }

    fun getBgmVolume(): Float = cachedBgmVolume

    fun setBgmVolume(volume: Float) {
        cachedBgmVolume = volume.coerceIn(0f, 1f)
    }

    fun getSfxVolume(): Float = cachedSfxVolume

    fun setSfxVolume(volume: Float) {
        cachedSfxVolume = volume.coerceIn(0f, 1f)
    }
}
