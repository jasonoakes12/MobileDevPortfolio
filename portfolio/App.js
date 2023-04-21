import React, { useState, useEffect } from 'react';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 
import { StatusBar } from 'expo-status-bar';
import { Button, FlatList, StyleSheet, Text, View, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Card } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();



const creationShowcase = ({navigation}) => {
  const [recipes, setRecipes] = useState([
    { id: 1,
      name: 'Strawberry Daiquiri', 
      liquor: 'Rum',
      info: 'A fruity drink',
      instructions: '1. Get 2 parts rum',
     },
    { 
      id: 2,
      name: 'Gin and Tonic', 
      liquor: 'Gin',
      info: 'refreshing drink',
      instructions: 'pog',
  },
  ]);
  const [selectedValue, setSelectedValue] = useState('All');

  const handleSelection = (value) => {
    setSelectedValue(value);
    navigation.setParams({ selectedValue: value });
  };

  useEffect(() => {
    loadCocktails();
  }, [])
  
  const loadCocktails = async () => {
    try {
      const storedCocktais = await AsyncStorage.getItem('@recipes');
      if (storedCocktais !== null) {
        setRecipes(JSON.parse(storedCocktais))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const saveCocktail = async (recipes) => {
    try {
      await AsyncStorage.setItem('@recipes', JSON.stringify(recipes))
    } catch (error) {
      console.log(error)
    }
  }

  const addCocktailHandler = () => {
    navigation.navigate('Add Cocktail', { addNewCocktail })
  }

  const viewCocktailHandler = (recipe) => {
    navigation.navigate('Cocktail Details', { recipe })
  }

  const addNewCocktail = (newCocktail) => {
    setRecipes((prevRecipes) => [
      ...prevRecipes,
      { id: Math.random().toString(), ...newCocktail },
    ])
  }

  const deleteCocktail = async (recipeId) => {
    Alert.alert(
      'Delete Cocktail',
      'Do you want to delete this cocktail?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Ok',
          onPress: async () => {
            const updatedCocktail = recipes.filter(recipe => recipe.id !== recipeId)
            setRecipes(updatedCocktail)
            await saveCocktail(updatedCocktail)
          }
        }
      ]
    )

  }
  return (
    <View>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue) => handleSelection(itemValue)}>
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Gin" value="Gin" />
          <Picker.Item label="Vodka" value="Vodka" />
          <Picker.Item label="Rum" value="Rum" />
          <Picker.Item label="Tequila" value="Tequila" />
        </Picker>
      </View>
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
  const { recipe } = route.params

  const goBackHandler = () => {
    navigation.goBack()
  };

  return (
    <View style={styles.container}>
      <Card containerStyle={styleCard}>
        <Card.Title>{recipe.name}</Card.Title>
        <Card.Divider/>
        <Text style={styles.liquor}>Drink contains {recipe.liquor}</Text>
        <Card.Divider/>
        <Text style={styles.info}>{recipe.info}</Text>
        <Text style={styles.instructions}>{recipe.instructions}</Text>
      </Card>
      <Button title="Return to Showcase!" onPress={goBackHandler}/>
    </View>
  )
}

const addCreation = ({navigation, route}) => {
  const [name, setName] = useState('');
  const [liquor, setLiquor] = useState('');
  const [info, setInfo] = useState('');
  const [instructions, setInstructions] = useState('');

  const addRecipeHandler = () => {
    const newRecipe = {
      name: name,
      liquor: liquor,
      info: info,
      instructions: instructions
    };
    route.params.addNewRecipe(newRecipe)
    navigation.goBack()
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Add a new Cocktail!</Text>
      <TextInput 
        style={{ borderWidth: 1, borderColor: 'grey', padding: 10, margin: 10, width: 300 }}
        placeholder="Recipe Name"
        value={name}
        onChangeText={text => setName(text)}/>
      <TextInput 
        style={{ borderWidth: 1, borderColor: 'grey', padding: 10, margin: 10, width: 300 }}
        placeholder="Liquor Used"
        value={liquor}
        onChangeText={text => setLiquor(text)}/>
      <TextInput
        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, margin: 10, width: 300 }}
        placeholder="Recipe Description"
        value={info}
        onChangeText={text => setInfo(text)}
      />
      <TextInput
        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, margin: 10, width: 300, height: 200 }}
        placeholder="Recipe Instructions"
        multiline={true}
        numberOfLines={10}
        value={instructions}
        onChangeText={text => setInstructions(text)}
      />
      <Button title="Add New Recipe!" onPress={addRecipeHandler} />
      <Button title="Return to Showcase!" onPress={() => navigation.goBack()} />
    </View>
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
  dropdown: {
    marginHorizontal: 10,
    marginVertical: 20,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },
  card: {
    width: '100%',
    marginBottom: 10,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    textAlign: 'center',
  },
  cardDescription: {
    marginBottom: 10,
    textAlign: 'center',
  },
});

const styleCard = {
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    marginBottom: 10,
  };
