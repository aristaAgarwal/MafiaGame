import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useGameStore } from '../store/gameStore';
import { BlurView } from 'expo-blur';

interface AvatarSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (avatarPath: string) => void;
  selectedAvatar: string | null;
  serverUrl?: string;
}

/**
 * A premium modal overlay for selecting a player avatar.
 * Fetches available avatars from the backend /api/avatars endpoint.
 */
export default function AvatarSelector({
  visible,
  onClose,
  onSelect,
  selectedAvatar,
  serverUrl,
}: AvatarSelectorProps) {
  const socket = useGameStore((state) => state.socket);
  const [avatars, setAvatars] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Resolve the base URL: prefer connected socket URI > explicit prop > env var > fallback
  const getBaseUrl = (): string => {
    // If socket is connected, use its actual URI (most reliable)
    if (socket) {
      const socketUri = (socket.io as any)?.uri;
      if (socketUri) {
        return socketUri.replace(/\/$/, '');
      }
    }
    return serverUrl || process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:3000';
  };

  const baseUrl = getBaseUrl();

  useEffect(() => {
    if (visible) {
      fetchAvatars();
    }
  }, [visible]);

  const fetchAvatars = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(`${baseUrl}/api/avatars`);
      if (!response.ok) {
        throw new Error('Failed to fetch avatars');
      }
      const data = await response.json();
      setAvatars(data);
    } catch (err) {
      console.error('Error fetching avatars:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const resolveUri = (path: string): string => {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `${baseUrl}${path}`;
  };

  const getDisplayName = (path: string): string => {
    const filename = path.split('/').pop() || '';
    return filename
      .replace(/\.(png|jpe?g|gif|svg|webp)$/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ImageBackground
            source={require('../../assets/chatBg.jpeg')}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <BlurView intensity={90} tint="dark" style={styles.blurContainer}>
              {/* Close Button absolute-positioned at top-right */}
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color={COLORS.white} />
              </TouchableOpacity>

              {/* Centered title below the cross button */}
              <Text style={styles.title}>SELECT IDENTITY</Text>

              {/* Content */}
              {loading ? (
                <View style={styles.centeredContent}>
                  <ActivityIndicator size="large" color={COLORS.gold} />
                  <Text style={styles.loadingText}>LOADING IDENTITIES...</Text>
                </View>
              ) : error ? (
                <View style={styles.centeredContent}>
                  <Ionicons name="cloud-offline-outline" size={40} color={COLORS.textMuted} />
                  <Text style={styles.errorText}>COULD NOT REACH SERVER</Text>
                  <Text style={styles.errorSubtext}>
                    Connect to the server first via Settings, then try again.
                  </Text>
                  <TouchableOpacity style={styles.retryBtn} onPress={fetchAvatars}>
                    <Text style={styles.retryBtnText}>RETRY</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <ScrollView
                  contentContainerStyle={styles.grid}
                  showsVerticalScrollIndicator={false}
                >
                  {avatars.map((avatarPath) => {
                    const isSelected = selectedAvatar === avatarPath;
                    return (
                      <TouchableOpacity
                        key={avatarPath}
                        style={[styles.avatarCard, isSelected && styles.avatarCardSelected]}
                        onPress={() => {
                          onSelect(avatarPath);
                          onClose();
                        }}
                        activeOpacity={0.7}
                      >
                        <Image
                          source={{ uri: resolveUri(avatarPath) }}
                          style={styles.avatarImage}
                          resizeMode="cover"
                        />
                        <Text style={[styles.avatarName, isSelected && styles.avatarNameSelected]} numberOfLines={1}>
                          {getDisplayName(avatarPath)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}
            </BlurView>
          </ImageBackground>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    width: '100%',
    maxWidth: 360,
    maxHeight: '80%',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.borderGold,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.gold,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
      default: {},
    }),
  },
  backgroundImage: {
    width: '100%',
  },
  blurContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    width: '100%',
  },
  centeredContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  title: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 18,
    color: COLORS.white,
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
  loadingText: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 11,
    color: COLORS.gold,
    letterSpacing: 1.5,
    marginTop: 16,
  },
  errorText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 13,
    color: COLORS.textPrimary,
    letterSpacing: 1.5,
    marginTop: 12,
  },
  errorSubtext: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
    letterSpacing: 0.5,
    paddingHorizontal: 16,
  },
  retryBtn: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.goldTranslucent,
  },
  retryBtnText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 10,
    color: COLORS.gold,
    letterSpacing: 1.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  avatarCard: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  avatarCardSelected: {
    borderColor: COLORS.redBright,
    backgroundColor: 'rgba(255, 74, 74, 0.08)',
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 6,
    overflow: 'hidden',
    transform: [{ scale: 1.2 }],
  },

  avatarName: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 8,
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  avatarNameSelected: {
    color: COLORS.redBright,
    fontFamily: 'Cinzel_700Bold',
  },
});
