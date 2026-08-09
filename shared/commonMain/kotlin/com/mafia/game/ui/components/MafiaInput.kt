package com.mafia.game.ui.components

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.TextStyle
import com.mafia.game.core.constants.AppColors
import com.mafia.game.core.constants.AppDimensions

/**
 * Custom Styled Text Input Field
 */
@Composable
fun MafiaInput(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    modifier: Modifier = Modifier,
    singleLine: Boolean = true
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        placeholder = {
            Text(
                text = placeholder,
                color = AppColors.TextMuted,
                fontSize = AppDimensions.TextBody
            )
        },
        modifier = modifier
            .fillMaxWidth()
            .height(AppDimensions.InputHeight),
        singleLine = singleLine,
        textStyle = TextStyle(
            color = AppColors.TextPrimary,
            fontSize = AppDimensions.TextSubtitle
        ),
        shape = RoundedCornerShape(AppDimensions.RadiusSmall),
        colors = OutlinedTextFieldDefaults.colors(
            focusedContainerColor = AppColors.InputOverlayBg,
            unfocusedContainerColor = AppColors.InputOverlayBg,
            focusedBorderColor = AppColors.Gold,
            unfocusedBorderColor = AppColors.Border
        )
    )
}
