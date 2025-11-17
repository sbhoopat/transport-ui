import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface CustomHeaderProps {
  title?: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title = 'BusTrackr' }) => {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={require('../../assets/meetrix_logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 4,
  },
  logo: {
    width: 32,
    height: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default CustomHeader;

