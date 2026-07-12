import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Platform,
  Modal,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../store/gameStore';
import { COLORS } from '../constants/theme';

const chatBg = require('../../assets/chatBg.jpeg');

interface ChatOverlayProps {
  channel: 'day' | 'mafia' | 'lobby';
  visible: boolean;
  onClose: () => void;
}

export default function ChatOverlay({ channel, visible, onClose }: ChatOverlayProps) {
  const { messages, myId, players, sendChatMessage, phase } = useGameStore();
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const me = myId ? players[myId] : null;
  // In the lobby phase, everyone is considered active/alive
  const isAlive = phase === 'LOBBY' || (me ? me.isAlive : false);

  // Filter messages for the current channel
  const filteredMessages = messages.filter((m) => m.channel === channel);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [filteredMessages.length, visible]);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    sendChatMessage(trimmed, channel);
    setInputText('');
    Keyboard.dismiss();
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const isMafiaChannel = channel === 'mafia';
  const isLobbyChannel = channel === 'lobby';
  const borderHighlightColor = isMafiaChannel ? COLORS.redAccent : COLORS.borderGold;
  const channelTitle = isMafiaChannel
    ? 'MAFIA CONSPIRACY CHAT'
    : isLobbyChannel
      ? 'LOBBY CHAT'
      : 'TOWN DISCUSSION';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlayContainer}>
        <ImageBackground
          source={chatBg}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
        <SafeAreaView style={styles.safeArea}>
          {/* Header Row */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <Text style={[
                styles.channelTitle,
                { color: isMafiaChannel ? COLORS.redBright : COLORS.gold }
              ]}>
                {channelTitle}
              </Text>
            </View>

            {/* Empty view to balance the flex layout for centering */}
            <View style={styles.backButtonSpacer} />
          </View>

          {/* Chat Messages scroll area */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            {filteredMessages.length === 0 ? (
              <View style={styles.emptyChatContainer}>
                <Text style={styles.emptyChatText}>
                  {isMafiaChannel
                    ? 'Conspire in secret with other Mafia members here.'
                    : isLobbyChannel
                      ? 'Welcome to the lobby! Chat with other players here before the game starts.'
                      : 'Share your accusations and defend yourself in the Town Chat.'}
                </Text>
              </View>
            ) : (
              filteredMessages.map((msg) => {
                const isMe = msg.senderId === myId;
                const displayName = isMe ? 'You' : msg.senderName;

                // Resolve name color
                const nameColor = isMe
                  ? COLORS.white
                  : isMafiaChannel
                    ? COLORS.redBright
                    : COLORS.gold;

                return (
                  <View
                    key={msg.id}
                    style={[
                      styles.messageRow,
                      isMe ? styles.messageRowRight : styles.messageRowLeft,
                    ]}
                  >
                    <View
                      style={[
                        styles.messageBubble,
                        isMe ? styles.bubbleRight : styles.bubbleLeft,
                        isMafiaChannel ? styles.bubbleMafia : styles.bubbleTown,
                      ]}
                    >
                      <Text style={[
                        styles.senderNameInBubble,
                        { color: nameColor, alignSelf: isMe ? 'flex-end' : 'flex-start' }
                      ]}>
                        {displayName}
                      </Text>

                      <Text style={[
                        styles.messageText,
                        { textAlign: isMe ? 'right' : 'left' }
                      ]}>
                        {msg.text}
                      </Text>

                      <Text style={[
                        styles.timestampText,
                        { alignSelf: isMe ? 'flex-end' : 'flex-start' }
                      ]}>
                        {formatTime(msg.timestamp)}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>

          {/* Input container */}
          <View style={[styles.inputContainer, { borderColor: borderHighlightColor }]}>
            {isAlive ? (
              <>
                <TextInput
                  style={styles.textInput}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder={
                    isMafiaChannel
                      ? "Coordinate the next kill..."
                      : isLobbyChannel
                        ? "Chat with the players in lobby..."
                        : "Cast suspicion, discuss clues..."
                  }
                  placeholderTextColor={COLORS.textMuted}
                  maxLength={150}
                  onSubmitEditing={handleSend}
                  returnKeyType="send"
                  autoCapitalize="none"
                  autoCorrect={false}
                  blurOnSubmit={false}
                />
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    { backgroundColor: isMafiaChannel ? COLORS.redAccent : COLORS.surfaceElevated }
                  ]}
                  onPress={handleSend}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="send"
                    size={14}
                    color={inputText.trim() ? (isMafiaChannel ? COLORS.white : COLORS.gold) : COLORS.textMuted}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.spectatorContainer}>
                <Ionicons name="eye" size={16} color={COLORS.redBright} style={{ marginRight: 6 }} />
                <Text style={styles.spectatorText}>YOU ARE ELIMINATED (SPECTATING CHAT)</Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  backButtonSpacer: {
    width: 40,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  channelTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 13,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  messageListContent: {
    paddingBottom: 24,
  },
  emptyChatContainer: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyChatText: {
    fontFamily: 'Cinzel_400Regular',
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: 0.5,
    paddingHorizontal: 24,
  },
  messageRow: {
    marginVertical: 6,
    maxWidth: '85%',
  },
  messageRowLeft: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageRowRight: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  senderNameInBubble: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  messageBubble: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1.2,
    backgroundColor: 'rgba(10, 8, 7, 0.75)',
    minWidth: 120,
  },
  bubbleLeft: {
    borderBottomLeftRadius: 0,
  },
  bubbleRight: {
    borderBottomRightRadius: 0,
  },
  bubbleMafia: {
    borderColor: 'transparent',
    borderTopColor: COLORS.redBright,
  },
  bubbleTown: {
    borderColor: 'transparent',
    borderTopColor: COLORS.gold,
  },
  messageText: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 12.5,
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
    lineHeight: 18,
  },
  timestampText: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 8,
    color: COLORS.textMuted,
    marginTop: 4,
    alignSelf: 'flex-end',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    fontFamily: 'Cinzel_400Regular',
    fontSize: 12,
    color: COLORS.textPrimary,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    paddingHorizontal: 14,
    backgroundColor: COLORS.inputOverlayBg,
    borderRadius: 6,
    borderColor: COLORS.border,
    borderWidth: 1,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
      default: {},
    }),
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  spectatorContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  spectatorText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 10,
    color: COLORS.redBright,
    letterSpacing: 1,
  },
});
