import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type BottomNavigationProps = {
  activeSection: string;
  onSectionChange: (section: string) => void;
};

export default function BottomNavigation({ activeSection, onSectionChange }: BottomNavigationProps) {
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
        <View style={styles.navCenter}>
          <Image source={require('../../assets/images/tip_ai_colored.png')} style={styles.navCenterImage} />
        </View>
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
  navCenterImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  profileIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    resizeMode: 'cover'
  },
}); 