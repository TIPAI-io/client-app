import React, { useState } from 'react';
import { Image, Modal, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type BottomNavigationProps = {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isModelDownloaded?: boolean;
  onCenterPress?: () => void;
  onOpenModelList?: () => void;
};

export default function BottomNavigation({ activeSection, onSectionChange, isModelDownloaded, onCenterPress, onOpenModelList }: BottomNavigationProps) {
  const [showModal, setShowModal] = useState(false);

  const handleCenterPress = () => {
    if (isModelDownloaded) {
      onCenterPress?.();
    } else {
      setShowModal(true);
    }
  };

  const handleDownloadPress = () => {
    setShowModal(false);
    onOpenModelList?.();
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#18181b' }}>
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navItem, activeSection === 'home' && styles.navItemActive]} 
          onPress={() => onSectionChange('home')}
        >
          <Image source={require('../../assets/images/home.png')} style={[styles.navIcon, activeSection === 'home' && styles.navIconActive]} />
          <Text style={[styles.navLabel, activeSection === 'home' && styles.navLabelActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navItem, activeSection === 'data' && styles.navItemActive]} 
          onPress={() => onSectionChange('data')}
        >
          <Image source={require('../../assets/images/data_flow.png')} style={[styles.navIcon, activeSection === 'data' && styles.navIconActive]} />
          <Text style={[styles.navLabel, activeSection === 'data' && styles.navLabelActive]}>Data</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navCenter, !isModelDownloaded && styles.navCenterDisabled]} 
          onPress={handleCenterPress}
        >
          <Image 
            source={require('../../assets/images/tip_ai_colored.png')} 
            style={[styles.navCenterImage, !isModelDownloaded && styles.navCenterImageDisabled]} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navItem, activeSection === 'earn' && styles.navItemActive]} 
          onPress={() => onSectionChange('earn')}
        >
          <Image source={require('../../assets/images/money_bag.png')} style={[styles.navIcon, activeSection === 'earn' && styles.navIconActive]} />
          <Text style={[styles.navLabel, activeSection === 'earn' && styles.navLabelActive]}>Earn</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navItem, activeSection === 'airdrop' && styles.navItemActive]} 
          onPress={() => onSectionChange('airdrop')}
        >
          <Image source={require('../../assets/images/profile.png')} style={[styles.profileIcon, activeSection === 'airdrop' && styles.navIconActive]} />
          <Text style={[styles.navLabel, activeSection === 'airdrop' && styles.navLabelActive]}>Airdrop</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Model Required</Text>
            <Text style={styles.modalMessage}>
              You need to download a model first to start chatting. Head to the model list to get started.
            </Text>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonPrimary]} 
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalButtonTextPrimary}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
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
  navIconActive: {
    tintColor: '#fff',
    opacity: 1
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
  navCenterDisabled: {
    backgroundColor: '#e2c3ff',
    opacity: 0.5,
  },
  navCenterImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  navCenterImageDisabled: {
    opacity: 0.5,
  },
  profileIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    resizeMode: 'cover'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#7d3cff',
  },
  modalButtonTextPrimary: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 