package com.mafia.game.core.constants

/**
 * Centralized String Literals for Mafia App UI
 * Keeps text consistent, readable, and ready for future localization.
 */
object AppStrings {
    const val APP_TITLE = "MAFIA"
    const val APP_SUBTITLE = "PARTY OF DECEIT"

    // Home Screen Actions
    const val CREATE_GAME = "CREATE GAME"
    const val JOIN_GAME = "JOIN GAME"
    const val RULES = "HOW TO PLAY"
    const val ENTER_CODE = "ENTER ROOM CODE"
    const val ENTER_NAME = "ENTER YOUR NAME"

    // Lobby Screen
    const val LOBBY_TITLE = "GAME LOBBY"
    const val PLAYERS_HEADER = "PLAYERS"
    const val START_GAME = "START GAME"
    const val READY = "READY"
    const val NOT_READY = "NOT READY"
    const val LOBBY_SETTINGS = "LOBBY SETTINGS"
    const val COPY_ROOM_CODE = "Copy Code"
    const val KICK_PLAYER = "Kick"

    // Role Names
    const val ROLE_MAFIA = "Mafia"
    const val ROLE_DOCTOR = "Doctor"
    const val ROLE_DETECTIVE = "Detective"
    const val ROLE_VILLAGER = "Civilian"
    const val UNKNOWN_ROLE = "Unknown Role"

    // Role Descriptions
    const val DESC_MAFIA = "Eliminate non-Mafia players during the night without getting caught."
    const val DESC_DOCTOR = "Save one player each night from elimination."
    const val DESC_DETECTIVE = "Investigate one player each night to learn their secret identity."
    const val DESC_VILLAGER = "Find and vote out the Mafia members during the day."

    // Game Phases
    const val PHASE_NIGHT = "NIGHT PHASE"
    const val PHASE_DAY = "DAY DISCUSSION"
    const val PHASE_VOTING = "VOTING PHASE"
    const val PHASE_END = "GAME OVER"

    // Phase Instructions
    const val INSTRUCT_NIGHT_MAFIA = "Choose a target to eliminate tonight."
    const val INSTRUCT_NIGHT_DOCTOR = "Choose a player to heal tonight."
    const val INSTRUCT_NIGHT_DETECTIVE = "Choose a player to investigate."
    const val INSTRUCT_NIGHT_VILLAGER = "Sleep tight... The night is quiet."
    const val INSTRUCT_DAY = "Discuss who seems suspicious among the surviving players."
    const val INSTRUCT_VOTING = "Cast your vote to eliminate a suspect."

    // General Actions
    const val CONFIRM = "Confirm"
    const val CANCEL = "Cancel"
    const val BACK = "Back"
    const val LEAVE_GAME = "Leave Game"
    const val CLOSE = "Close"
    const val SEND = "Send"
    const val CHAT_PLACEHOLDER = "Type a message..."
}
