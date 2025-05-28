import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from './context/NavigationContext';

export const options = { headerShown: false };

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'utility', label: 'Utility' },
  { key: 'social', label: 'Social' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'travel', label: 'Travel' },
];

const CONNECTORS = [
  // Utility
  {
    id: 'chrome',
    name: 'Chrome',
    category: 'utility',
    icon: require('../assets/images/chrome.png'),
    dataScore: 1000,
    tipToken: 850,
    lvlValue: 900,
    level: 3,
    locked: true,
  },
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'utility',
    icon: require('../assets/images/spotify.png'),
    dataScore: 100,
    tipToken: 500,
    lvlValue: 600,
    level: 2,
    locked: true,
  },
  // Calendar
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    category: 'calendar',
    icon: require('../assets/images/google_calendar.png'),
    dataScore: 400,
    tipToken: 900,
    lvlValue: 950,
    level: 3,
    locked: true,
  },
  // Social
  {
    id: 'facebook',
    name: 'Facebook',
    category: 'social',
    icon: require('../assets/images/facebook.png'),
    dataScore: 20,
    tipToken: 250,
    lvlValue: 300,
    level: 1,
    locked: true,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'social',
    icon: require('../assets/images/instagram.png'),
    dataScore: 100,
    tipToken: 500,
    lvlValue: 550,
    level: 2,
    locked: true,
  },
  {
    id: 'x',
    name: 'Twitter',
    category: 'social',
    icon: require('../assets/images/x.png'),
    dataScore: 60,
    tipToken: 300,
    lvlValue: 350,
    level: 1,
    locked: true,
  },
  // Travel
  {
    id: 'uber',
    name: 'Uber',
    category: 'travel',
    icon: require('../assets/images/uber.png'),
    dataScore: 200,
    tipToken: 650,
    lvlValue: 700,
    level: 2,
    locked: true,
  },
];

const PIN_POINTS = 850400;
const DATA_SCORE = 3670;

const CARD_WIDTH = (Dimensions.get('window').width - 48) / 2;

// Storage keys
const STORAGE_KEYS = {
  UNLOCKED_CONNECTORS: 'unlocked_connectors',
  CONNECTOR_DETAILS: 'connector_details',
};

export default function ModelDetailScreen() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [unlockedConnectors, setUnlockedConnectors] = useState<string[]>([]);
  const [connectorDetails, setConnectorDetails] = useState<Record<string, any>>({});
  const { activeSection } = useNavigation();

  // Load persisted data on component mount
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const [savedUnlocked, savedDetails] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.UNLOCKED_CONNECTORS),
          AsyncStorage.getItem(STORAGE_KEYS.CONNECTOR_DETAILS),
        ]);

        if (savedUnlocked) {
          setUnlockedConnectors(JSON.parse(savedUnlocked));
        }
        if (savedDetails) {
          setConnectorDetails(JSON.parse(savedDetails));
        }
      } catch (error) {
        console.error('Error loading persisted data:', error);
      }
    };

    loadPersistedData();
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.UNLOCKED_CONNECTORS, JSON.stringify(unlockedConnectors)),
          AsyncStorage.setItem(STORAGE_KEYS.CONNECTOR_DETAILS, JSON.stringify(connectorDetails)),
        ]);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };

    saveData();
  }, [unlockedConnectors, connectorDetails]);

  useEffect(() => {
    // Initialize Google Sign-In for iOS
    GoogleSignin.configure({
      iosClientId: '576698307273-0f5imbfeuo0fc8bqllh8tautkdlr99qm.apps.googleusercontent.com',
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
  }, []);

  const handleUnlock = useCallback(async (connector: typeof CONNECTORS[0]) => {
    switch (connector.id) {
      case 'chrome':
        try {
          // Implement Chrome data access logic here
          Alert.alert('Chrome Access', 'Requesting access to Chrome data...');
          setUnlockedConnectors(prev => [...prev, connector.id]);
          setConnectorDetails(prev => ({
            ...prev,
            [connector.id]: {
              unlockedAt: new Date().toISOString(),
              // Add any other Chrome-specific details here
            }
          }));
        } catch (error) {
          Alert.alert('Error', 'Failed to connect to Chrome');
        }
        break;

      case 'google-calendar':
        try {
          console.log('Starting iOS Google Sign-In process...');
          
          const userInfo = await GoogleSignin.signIn();
          console.log('iOS Sign in response:', userInfo);

          if (!userInfo) {
            throw new Error('No user info received after sign in');
          }

          const tokens = await GoogleSignin.getTokens();
          console.log('iOS Tokens received:', tokens);

          // Store the connector details
          setUnlockedConnectors(prev => [...prev, connector.id]);
          setConnectorDetails(prev => ({
            ...prev,
            [connector.id]: {
              unlockedAt: new Date().toISOString(),
              userInfo,
              tokens,
              // Add any other calendar-specific details here
            }
          }));

          Alert.alert('Success', 'Successfully connected to Google Calendar!');
        } catch (error: any) {
          console.error('iOS Google Sign-In Error Details:', {
            code: error.code,
            message: error.message,
            stack: error.stack
          });

          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            Alert.alert('Cancelled', 'Sign in was cancelled by user');
          } else if (error.code === statusCodes.IN_PROGRESS) {
            Alert.alert('In Progress', 'Sign in is already in progress');
          } else {
            Alert.alert('Error', `Failed to connect to Google Calendar: ${error.message}`);
          }
        }
        break;

      default:
        // For other connectors, implement their specific connection logic
        Alert.alert('Coming Soon', `${connector.name} integration coming soon!`);
        break;
    }
  }, []);

  const connectors = selectedTab === 'all'
    ? CONNECTORS
    : CONNECTORS.filter(c => c.category === selectedTab);

  // Only unlocked connectors count toward totals
  const unlocked = (selectedTab === 'all' ? CONNECTORS : connectors)
    .filter(c => unlockedConnectors.includes(c.id));
  const totalTipPoints = unlocked.reduce((sum, c) => sum + c.tipToken, 0);
  const totalDataScore = unlocked.reduce((sum, c) => sum + c.dataScore, 0);

  const renderCard = ({ item }: { item: typeof CONNECTORS[0] }) => {
    const isLocked = !unlockedConnectors.includes(item.id);
    const details = connectorDetails[item.id] || {};
    
    return (
      <View style={[styles.card, isLocked && styles.cardLocked]}>
        <Image source={item.icon} style={styles.cardIcon} />
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Data Score:</Text>
          <Text style={styles.cardValue}>+{item.dataScore} ⚡</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>TIP Token:</Text>
          <Text style={styles.cardValue}>+{item.tipToken} <Image source={require('../assets/images/stack.png')} style={styles.tipIconInline} /></Text>
        </View>
        <View style={styles.lvlRow}>
          <Text style={styles.lvlText}>Lvl {item.level}</Text>
          <LinearGradient
            colors={["#e2c3ff", "#b47aff", "#f7bfa3"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.lvlPill}
          >
            <Text style={styles.lvlPillText}>{item.lvlValue}</Text>
            <Image source={require('../assets/images/stack.png')} style={styles.lvlPillIcon} />
          </LinearGradient>
        </View>
        {isLocked && (
          <View style={styles.lockOverlay} pointerEvents="box-none">
            <TouchableOpacity 
              style={styles.unlockBtn} 
              activeOpacity={0.8}
              onPress={() => handleUnlock(item)}
            >
              <Text style={styles.unlockBtnText}>🔒 Unlock</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Bar with Gradient */}
      <LinearGradient
        colors={['#f9f9f9', '#f9fbfc', '#eae6f7', '#f9fbfc']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.topBarGradient}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={styles.topBarLabel}>TIP Points</Text>
            <Text style={styles.topBarValue}>{totalTipPoints.toLocaleString()} <Image source={require('../assets/images/stack.png')} style={styles.tipIconInline} /></Text>
          </View>
          <View>
            <Text style={styles.topBarLabel}>Data Score <Text style={{ fontSize: 12 }}>ⓘ</Text></Text>
            <Text style={styles.topBarValue}>{totalDataScore.toLocaleString()} ⚡</Text>
          </View>
        </View>
      </LinearGradient>
      {/* Tab Selector */}
      <View style={styles.tabs}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, selectedTab === tab.key && styles.tabSelected]}
            onPress={() => setSelectedTab(tab.key)}
          >
            <Text style={[styles.tabText, selectedTab === tab.key && styles.tabTextSelected]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Card Grid */}
      <FlatList
        data={connectors}
        renderItem={renderCard}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 90 }}
        columnWrapperStyle={{ gap: 16 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#aaa', marginTop: 40 }}>No connectors in this category.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FBFC' },
  topBarGradient: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  topBarLabel: { color: '#888', fontSize: 14 },
  topBarValue: { fontWeight: 'bold', fontSize: 24, color: '#222', flexDirection: 'row', alignItems: 'center' },
  tipIconInline: {
    width: 13,
    height: 13,
    resizeMode: 'contain',
    marginLeft: 2,
    marginBottom: -2,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    paddingBottom: 4,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  tabSelected: {
    borderColor: '#b47aff',
  },
  tabText: { color: '#888', fontSize: 16 },
  tabTextSelected: { color: '#b47aff', fontWeight: 'bold' },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  cardLocked: {
    backgroundColor: '#e5e5e5',
  },
  cardIcon: { width: 40, height: 40, marginBottom: 8, resizeMode: 'contain' },
  cardTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 8, textAlign: 'center' },
  cardRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  cardLabel: { color: '#888', fontSize: 14, marginRight: 4 },
  cardValue: { color: '#222', fontWeight: 'bold', fontSize: 14 },
  lvlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 2,
    width: '100%',
  },
  lvlText: {
    color: '#b47aff',
    fontWeight: '600',
    fontSize: 15,
  },
  lvlPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 16,
    minWidth: 60,
    justifyContent: 'center',
  },
  lvlPillText: {
    color: '#2d1457',
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 4,
  },
  lvlPillIcon: {
    width: 13,
    height: 13,
    resizeMode: 'contain',
    marginBottom: -2,
  },
  unlockBtn: {
    backgroundColor: '#d1aaff',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 8,
    alignSelf: 'center',
    minWidth: 120,
  },
  unlockBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderRadius: 20,
    paddingBottom: 24,
  },
  unlockedInfo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  unlockedText: {
    color: '#2d1457',
    fontWeight: 'bold',
    fontSize: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
});

export { ModelDetailScreen };
