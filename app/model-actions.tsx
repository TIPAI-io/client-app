import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNavigation from './components/BottomNavigation';
import FULL_MODELS from './constants/models';
import { useNavigation } from './context/NavigationContext';

const MODELS = FULL_MODELS.map(({id, name}) => ({id, name}));

const ACTIONS = [
  {
    id: 'order-food',
    icon: '🍔',
    title: 'Order food',
    desc: 'Get food delivered to your home with Doordash, Uber Eats, etc.',
    actionScore: '+120',
    tipPoints: '+10k',
  },
  {
    id: 'ask-for-rides',
    icon: '🚗',
    title: 'Ask for rides',
    desc: 'Schedule rides from Uber, Lyft or Tesla RoboTaxi, etc.',
    actionScore: '+150',
    tipPoints: '+20k',
  },
  {
    id: 'shopping',
    icon: '🛍️',
    title: 'Shopping',
    desc: 'Shop from home goods, fashion, electronics from 100+ online stores.',
    actionScore: '+150',
    tipPoints: '+20k',
  },
  {
    id: 'calendar-summary',
    icon: '🗓️',
    title: 'Calendar Summary',
    desc: 'Generate a summary of meetings and events you have in the next few days.',
    actionScore: '+150',
    tipPoints: '+20k',
    faded: true,
  },
  {
    id: 'email-summary',
    icon: '📧',
    title: 'Email Summary',
    desc: 'Generate a summary of emails you received in last week.',
    actionScore: '+150',
    tipPoints: '+20k',
    faded: true,
  },
  {
    id: 'friends-story',
    icon: '🧑‍🤝‍🧑',
    title: 'Friends Story',
    desc: 'Generate a summary of posts or stories of friends.',
    actionScore: '+150',
    tipPoints: '+20k',
    faded: true,
  },
];

export default function ModelActionsScreen() {
  const { id } = useLocalSearchParams();
  const { activeSection } = useNavigation();
  const model = MODELS.find((m) => m.id === id) || MODELS[0];

  const renderCard = ({ item }: { item: typeof ACTIONS[0] }) => (
    <View style={[styles.card, item.faded && styles.cardFaded]}>
      <Text style={styles.cardIcon}>{item.icon}</Text>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDesc}>{item.desc}</Text>
      <Text style={styles.cardActionScore}>Action Score: <Text style={{ fontWeight: 'bold' }}>{item.actionScore} ⚡</Text></Text>
      <View style={styles.tipPointsRow}>
        <Text style={styles.tipPointsLabel}>TIP Points:</Text>
        <View style={styles.tipPointsPill}>
          <Text style={styles.tipPointsText}>{item.tipPoints}</Text>
          <Image source={require('../assets/images/tip_ai_colored.png')} style={styles.tipPointsIcon} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Model Selector at Top */}
      <TouchableOpacity style={styles.modelSelector} onPress={() => {}} activeOpacity={0.8}>
        <Text style={styles.modelSelectorText}>{model.name} Model</Text>
        <Text style={styles.modelSelectorChevron}>›</Text>
      </TouchableOpacity>
      {/* Action Cards Grid */}
      <FlatList
        data={ACTIONS}
        renderItem={renderCard}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 90 }}
        columnWrapperStyle={{ gap: 16 }}
        ListFooterComponent={<View style={{ height: 24 }} />}
      />
      {/* Bottom Navigation */}
      <BottomNavigation activeSection={activeSection} onSectionChange={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  modelSelector: {
    marginTop: 32,
    marginHorizontal: 16,
    backgroundColor: '#faf8ff',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  modelSelectorText: { fontWeight: 'bold', fontSize: 20, color: '#222' },
  modelSelectorChevron: { fontSize: 24, color: '#888', marginLeft: 8 },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 160,
    maxWidth: 200,
  },
  cardFaded: {
    opacity: 0.4,
  },
  cardIcon: { fontSize: 40, marginBottom: 8 },
  cardTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 4, textAlign: 'center' },
  cardDesc: { color: '#888', fontSize: 14, marginBottom: 8, textAlign: 'center' },
  cardActionScore: { color: '#444', marginBottom: 8, fontSize: 13 },
  tipPointsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  tipPointsLabel: { color: '#b47aff', fontWeight: 'bold', fontSize: 13, marginRight: 4 },
  tipPointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginLeft: 4,
    overflow: 'hidden',
    backgroundColor: '#e2c3ff', // fallback for gradient
  },
  tipPointsText: { color: '#7d3cff', fontWeight: 'bold', fontSize: 15, marginRight: 4 },
  tipPointsIcon: { width: 18, height: 18, resizeMode: 'contain' },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#18181b',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 64,
  },
  navItem: { alignItems: 'center', flex: 1 },
  navIcon: { 
    width: 24, 
    height: 24, 
    resizeMode: 'contain',
    tintColor: '#fff'
  },
  profileIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    resizeMode: 'cover'
  },
  navLabel: { color: '#fff', fontSize: 12, marginTop: 2 },
  navCenter: {
    backgroundColor: '#fff',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  navCenterImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
}); 