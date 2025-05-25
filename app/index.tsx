import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNavigation from './components/BottomNavigation';
import Chat from './components/Chat';
import CATEGORIES from './constants/categories';
import { useModel } from './context/ModelContext';
import { useNavigation } from './context/NavigationContext';
import { ModelDetailScreen } from './data';

export default function HomeScreen() {
  const { models, downloadModel, isDownloading } = useModel();
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { activeSection, setActiveSection } = useNavigation();
  const [showChat, setShowChat] = useState(false);

  // Load selected model from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      const storedId = await AsyncStorage.getItem('selectedModelId');
      if (storedId) {
        const found = models.find(m => m.id === storedId);
        if (found) setSelectedModel(found);
      }
    })();
    // eslint-disable-next-line
  }, [models.length]);

  // Save selected model to AsyncStorage whenever it changes
  useEffect(() => {
    AsyncStorage.setItem('selectedModelId', selectedModel.id);
  }, [selectedModel.id]);

  // Update selectedModel if models array changes (e.g., after download)
  React.useEffect(() => {
    if (!models.find(m => m.id === selectedModel.id)) {
      setSelectedModel(models[0]);
    } else {
      setSelectedModel(models.find(m => m.id === selectedModel.id) || models[0]);
    }
  }, [models]);

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

  // Model actions/cards UI (from model-actions.tsx)
  const renderModelActions = () => (
    <>
      {/* Model Selector at Top */}
      <TouchableOpacity 
        style={[styles.modelSelector]} 
        onPress={() => setModalVisible(true)} 
        activeOpacity={0.8}
      >
        <Text style={styles.modelSelectorText}>
          {selectedModel.name} Model
        </Text>
        <Text style={styles.modelSelectorChevron}>›</Text>
      </TouchableOpacity>
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
            data={models}
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
                  {/* Download button, progress, or checkmark */}
                  {item.downloadUrl && !item.isDownloaded && (
                    downloadingId === item.id && isDownloading ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
                        <ActivityIndicator size="small" color="#7d3cff" />
                        <Text style={{ marginLeft: 6, color: '#7d3cff', fontWeight: 'bold' }}>
                          {Math.round((item.downloadProgress ?? 0) * 100)}%
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.downloadBtn}
                        onPress={async (e) => {
                          e.stopPropagation();
                          setDownloadingId(item.id);
                          await downloadModel(item.id);
                          setDownloadingId(null);
                        }}
                        disabled={isDownloading && downloadingId === item.id}
                      >
                        <Text style={styles.downloadBtnText}>Download</Text>
                      </TouchableOpacity>
                    )
                  )}
                  {item.isDownloaded && (
                    <Text style={styles.downloadedText}>✓ Downloaded</Text>
                  )}
                  {isSelected && <Text style={styles.modelOptionCheck}>✔️</Text>}
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            contentContainerStyle={{ padding: 16 }}
          />
        </View>
      </Modal>
      {/* Action Cards Grid */}
      <FlatList
        data={CATEGORIES}
        renderItem={renderCategory}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 90 }}
        columnWrapperStyle={{ gap: 16 }}
        ListFooterComponent={<View style={{ height: 24 }} />}
      />
    </>
  );

  const handleCenterPress = () => {
    if (selectedModel.isDownloaded) {
      setShowChat(true);
    }
  };

  let content;
  if (activeSection === 'home') {
    content = renderModelActions();
  } else if (activeSection === 'data') {
    content = <ModelDetailScreen />;
  } else if (activeSection === 'earn') {
    content = <View style={styles.placeholder}><Text style={styles.placeholderText}>Earn Section (Coming Soon)</Text></View>;
  } else if (activeSection === 'airdrop') {
    content = <View style={styles.placeholder}><Text style={styles.placeholderText}>Airdrop Section (Coming Soon)</Text></View>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>
          {showChat ? (
            <Chat model={selectedModel} onClose={() => setShowChat(false)} />
          ) : (
            content
          )}
        </View>
      </SafeAreaView>
      <BottomNavigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
        isModelDownloaded={!!selectedModel.isDownloaded}
        onCenterPress={handleCenterPress}
        onOpenModelList={() => setModalVisible(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  modelSelector: {
    marginTop: 56,
    marginHorizontal: 16,
    backgroundColor: '#fff',
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
  navIcon: { 
    width: 24, 
    height: 24, 
    resizeMode: 'contain',
    tintColor: '#fff'
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
  profileIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    resizeMode: 'cover'
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
  },
  downloadProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  downloadProgressText: {
    color: '#7d3cff',
    fontSize: 13,
    marginLeft: 4,
  },
  downloadBtn: {
    backgroundColor: '#7d3cff',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginLeft: 8,
  },
  downloadBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  downloadedText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 