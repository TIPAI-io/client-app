import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MODELS = [
  {
    id: '1',
    name: 'TinyLlama',
    image: require('../assets/images/tiny_llama.png'),
    desc: "Meta AI's most performant LLM",
  },
  {
    id: '2',
    name: 'Gemma-2b',
    image: require('../assets/images/gemma.png'),
    desc: 'Gemma is a family of lightweight open models from Google.',
  },
  {
    id: '3',
    name: 'Qwen2-1.5b',
    image: require('../assets/images/qwen.png'),
    desc: 'A language model series including decoder language models of different model sizes',
  },
  {
    id: '4',
    name: 'Phi-3 Mini-3.8b',
    image: require('../assets/images/msft.png'),
    desc: "Microsoft's smaller, less compute-intensive models for generative AI solutions",
  },
  {
    id: '5',
    name: 'Claude 3 Opus',
    image: require('../assets/images/claude.png'),
    desc: 'Designed to be helpful, honest, and harmless.',
  },
];

const CATEGORIES = [
  {
    id: 'order-food',
    icon: require('../assets/images/order_food.png'), // Replace with your asset or emoji
    title: 'Order food',
    desc: 'Get food delivered to your home with Doordash, Uber Eats, etc.',
    actionScore: '+120',
    tipPoints: '+10k',
  },
  {
    id: 'ask-for-rides',
    icon: require('../assets/images/ask_for_rides.png'),
    title: 'Ask for rides',
    desc: 'Schedule rides from Uber, Lyft or Tesla RoboTaxi, etc.',
    actionScore: '+150',
    tipPoints: '+20k',
  },
  {
    id: 'shopping',
    icon: require('../assets/images/shopping.png'),
    title: 'Shopping',
    desc: 'Shop from home goods, fashion, electronics from 100+ online stores.',
    actionScore: '+150',
    tipPoints: '+20k',
  },
  {
    id: 'calendar-summary',
    icon: require('../assets/images/calendar_summary.png'),
    title: 'Calendar Summary',
    desc: 'Generate a summary of meetings and events you have in the next few days.',
    actionScore: '+150',
    tipPoints: '+20k',
    faded: true,
  },
  {
    id: 'email-summary',
    icon: require('../assets/images/email_summary.png'),
    title: 'Email Summary',
    desc: 'Generate a summary of emails you received in last week.',
    actionScore: '+150',
    tipPoints: '+20k',
    faded: true,
  },
  {
    id: 'friends-story',
    icon: require('../assets/images/friends_story.png'),
    title: 'Friends Story',
    desc: 'Generate a summary of posts or stories of friends.',
    actionScore: '+150',
    tipPoints: '+20k',
    faded: true,
  },
];

export default function HomeScreen() {
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const renderCategory = ({ item }: { item: typeof CATEGORIES[0] }) => (
    <View style={[styles.card, item.faded && styles.cardFaded]}>
      <Image source={item.icon} style={styles.cardIcon} />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDesc}>{item.desc}</Text>
      <Text style={styles.cardActionScore}>Action Score: <Text style={{ fontWeight: 'bold' }}>{item.actionScore} ⚡</Text></Text>
      <View style={styles.tipPointsRow}>
        <Text style={styles.tipPointsLabel}>TIP Points:</Text>
        <View style={styles.tipPointsPill}>
          <Text style={styles.tipPointsText}>{item.tipPoints}</Text>
          <Image source={require('../assets/images/stack.png')} style={styles.tipPillIcon} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Model Selector Pill */}
      <TouchableOpacity style={styles.modelSelector} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
        <Image source={selectedModel.image} style={styles.modelSelectorImage} />
        <Text style={styles.modelSelectorText}>{selectedModel.name} Model</Text>
        <Text style={styles.modelSelectorChevron}>›</Text>
      </TouchableOpacity>
      {/* Categories Grid */}
      <FlatList
        data={CATEGORIES}
        renderItem={renderCategory}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 90 }}
        columnWrapperStyle={{ gap: 16 }}
        ListFooterComponent={<View style={{ height: 24 }} />}
      />
      {/* Model Picker Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)} />
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Choose Model</Text>
          <Text style={styles.modalSubtitle}>Choose an on-device local model, you can change it at any time.</Text>
          <FlatList
            data={MODELS}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              const isSelected = item.id === selectedModel.id;
              return (
                <TouchableOpacity
                  style={[styles.modelOption, isSelected && styles.modelOptionSelected]}
                  onPress={() => {
                    setSelectedModel(item);
                    setModalVisible(false);
                  }}
                  activeOpacity={0.8}
                >
                  <Image source={item.image} style={styles.modelOptionImage} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modelOptionText}>{item.name}</Text>
                    <Text style={[styles.modelOptionDesc, isSelected ? styles.modelOptionDescSelected : undefined]}>{item.desc}</Text>
                  </View>
                  {isSelected && <Text style={styles.modelOptionCheck}>✔️</Text>}
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            contentContainerStyle={{ padding: 16 }}
          />
        </View>
      </Modal>
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <View style={[styles.navItem, styles.navItemActive]}><Text style={[styles.navIcon, styles.navIconActive]}>💲</Text><Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text></View>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/model-detail')}><Text style={styles.navIcon}>🔀</Text><Text style={styles.navLabel}>Data</Text></TouchableOpacity>
        <View style={styles.navCenter}>
          <Image source={require('../assets/images/tip_ai_colored.png')} style={styles.navCenterImage} />
        </View>
        <View style={styles.navItem}><Text style={styles.navIcon}>💰</Text><Text style={styles.navLabel}>Earn</Text></View>
        <View style={styles.navItem}><Text style={styles.navIcon}>👤</Text><Text style={styles.navLabel}>Airdrop</Text></View>
      </View>
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
    shadowColor: '#b47aff',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    borderColor: '#b47aff',
    borderWidth: 1,
  },
  modelSelectorImage: { width: 32, height: 32, marginRight: 12, resizeMode: 'contain' },
  modelSelectorText: { fontWeight: 'bold', fontSize: 20, color: '#222' },
  modelSelectorChevron: { fontSize: 24, color: '#888', marginLeft: 8 },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#b47aff',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 160,
    maxWidth: 200,
  },
  cardFaded: {
    opacity: 0.4,
  },
  cardIcon: { width: 40, height: 40, marginBottom: 8, resizeMode: 'contain' },
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
    backgroundColor: '#e2c3ff',
  },
  tipPointsText: { color: '#7d3cff', fontWeight: 'bold', fontSize: 15, marginRight: 4 },
  tipIconInline: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginLeft: 2,
    marginBottom: -2,
  },
  tipPillIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginLeft: 2,
    marginBottom: -2,
  },
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
  navItemActive: {
    // Highlighted background or effect for active tab
  },
  navIcon: { color: '#fff', fontSize: 22 },
  navIconActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  navLabel: { color: '#fff', fontSize: 12, marginTop: 2 },
  navLabelActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalContent: {
    position: 'absolute',
    top: 100,
    left: 24,
    right: 24,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingBottom: 16,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 16,
  },
  modelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#faf8ff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  modelOptionSelected: {
    borderColor: '#b47aff',
    backgroundColor: '#f7f0ff',
  },
  modelOptionImage: { width: 40, height: 40, marginRight: 16, resizeMode: 'contain' },
  modelOptionText: { fontWeight: 'bold', fontSize: 17, marginBottom: 2 },
  modelOptionDesc: { color: '#888', fontSize: 14 },
  modelOptionDescSelected: { color: '#b47aff', fontWeight: 'bold' },
  modelOptionCheck: { fontSize: 22, color: '#b47aff', marginLeft: 8 },
}); 