import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 
import { StatusBar } from 'expo-status-bar';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';

const Stack = createStackNavigator();

const creationShowcase = ({navigation}) => {
  return (
    <View>
      <Button title="Go to Recipe Detail"
        onPress={() => 
          navigation.navigate('Details', { name: 'Strawberry Daiquiri' })} />
      <Button title="Add a Recipe"
        onPress={() => 
          navigation.navigate('Add')} />
    </View>
  )
}

const creationDetail = ({navigation, route}) => {
  return <Text>Recipe for {route.params.name}</Text>
}

const addCreation = ({navigation, route}) => {
  return (
    <Text>Add Creation Screen</Text>
  )
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Showcase">
        <Stack.Screen name="Showcase" component={creationShowcase} options={{ title: 'Cocktail Recipes'}}/>
        <Stack.Screen name="Details" component={creationDetail} options={{ title: 'Recipe Details'}}/>
        <Stack.Screen name="Add" component={addCreation} options={{ title: 'Add a Recipe'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
