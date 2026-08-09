package com.mafia.game.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import com.mafia.game.core.constants.AppColors
import com.mafia.game.core.constants.AppDimensions
import com.mafia.game.core.constants.AppStrings
import com.mafia.game.domain.model.ChatChannel
import com.mafia.game.domain.model.ChatMessage

/**
 * Real-Time Chat Drawer Component supporting Global and Mafia channels
 */
@Composable
fun ChatOverlay(
    messages: List<ChatMessage>,
    onSendMessage: (String, ChatChannel) -> Unit,
    isMafiaRole: Boolean = false,
    modifier: Modifier = Modifier
) {
    var messageText by remember { mutableStateOf("") }
    var selectedChannel by remember { mutableStateOf(ChatChannel.GLOBAL) }

    val filteredMessages = messages.filter { it.channel == selectedChannel }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .fillMaxHeight(0.6f)
            .background(AppColors.SurfaceElevated)
            .padding(AppDimensions.SpaceMedium)
    ) {
        Row(modifier = Modifier.fillMaxWidth()) {
            MafiaButton(
                text = "Global Chat",
                onClick = { selectedChannel = ChatChannel.GLOBAL },
                variant = if (selectedChannel == ChatChannel.GLOBAL) MafiaButtonVariant.PRIMARY else MafiaButtonVariant.SECONDARY,
                modifier = Modifier.weight(1f)
            )

            if (isMafiaRole) {
                Spacer(modifier = Modifier.width(AppDimensions.SpaceSmall))
                MafiaButton(
                    text = "Mafia Chat",
                    onClick = { selectedChannel = ChatChannel.MAFIA },
                    variant = if (selectedChannel == ChatChannel.MAFIA) MafiaButtonVariant.DANGER else MafiaButtonVariant.SECONDARY,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        Spacer(modifier = Modifier.height(AppDimensions.SpaceSmall))

        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
        ) {
            items(filteredMessages) { msg ->
                Row(modifier = Modifier.padding(vertical = AppDimensions.SpaceExtraSmall)) {
                    Text(
                        text = "${msg.senderName}: ",
                        color = AppColors.Gold,
                        fontWeight = FontWeight.Bold,
                        fontSize = AppDimensions.TextBody
                    )
                    Text(
                        text = msg.messageText,
                        color = AppColors.TextPrimary,
                        fontSize = AppDimensions.TextBody
                    )
                }
            }
        }

        Row(modifier = Modifier.fillMaxWidth()) {
            MafiaInput(
                value = messageText,
                onValueChange = { messageText = it },
                placeholder = AppStrings.CHAT_PLACEHOLDER,
                modifier = Modifier.weight(1f)
            )
            Spacer(modifier = Modifier.width(AppDimensions.SpaceSmall))
            MafiaButton(
                text = AppStrings.SEND,
                onClick = {
                    if (messageText.isNotBlank()) {
                        onSendMessage(messageText, selectedChannel)
                        messageText = ""
                    }
                },
                modifier = Modifier.width(AppDimensions.AvatarSizeMedium)
            )
        }
    }
}
