import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ItemsListScreen from '../screens/ItemsListScreen';
import ItemDetailScreen from '../screens/ItemDetailScreen';
import AddItemScreen from '../screens/AddItemScreen';
import EditItemScreen from '../screens/EditItemScreen';
import ClaimItemScreen from '../screens/ClaimItemScreen';
import ItemClaimsScreen from '../screens/ItemClaimsScreen';
import MyClaimsScreen from '../screens/MyClaimsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#2563EB', headerShown: true }}>
      <Tab.Screen name="Items" component={ItemsListScreen} options={{ title: 'Feed' }} />
      <Tab.Screen name="MyClaims" component={MyClaimsScreen} options={{ title: 'My Claims' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerStyle: { backgroundColor: '#F8FAFC' }, headerTintColor: '#0F172A' }}
      >
        {user ? (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="ItemDetail" component={ItemDetailScreen} options={{ title: 'Details' }} />
            <Stack.Screen name="AddItem" component={AddItemScreen} options={{ title: 'Report Item' }} />
            <Stack.Screen name="EditItem" component={EditItemScreen} options={{ title: 'Edit Item' }} />
            <Stack.Screen name="ClaimItem" component={ClaimItemScreen} options={{ title: 'File Claim' }} />
            <Stack.Screen name="ItemClaims" component={ItemClaimsScreen} options={{ title: 'Manage Claims' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create Account' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
