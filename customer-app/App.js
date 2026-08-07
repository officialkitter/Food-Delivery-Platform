import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeProvider } from './src/context/ThemeContext';
import { AppStateComposer } from './src/context/AppContext';
import { AppShell } from './src/shell/AppShell';
import AuthNavigator from './src/navigation/folders/AuthNavigator';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <ThemeProvider>
      <AppStateComposer>
        <AppShell showBottomTabBar={isAuthenticated} showHeader={!isAuthenticated}>
          {isAuthenticated ? (
            <View style={styles.authenticatedContainer}>
              <Text style={styles.title}>Welcome to BUZA</Text>
              <Text style={styles.subtitle}>Your delivery experience is ready.</Text>
            </View>
          ) : (
            <AuthNavigator onAppAuthenticationComplete={() => setIsAuthenticated(true)} />
          )}
        </AppShell>
      </AppStateComposer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  authenticatedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E1E24',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});

