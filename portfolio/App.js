import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 
import { FlatList, StyleSheet, View, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Card, Button, Text } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();



const creationShowcase = ({navigation}) => {
  const [recipes, setRecipes] = useState([
    { id: 1,
      name: 'Strawberry Daiquiri', 
      liquor: 'Rum',
      info: 'An all time classic for a perfect Summers day',
      instructions: '1. Add to a blender: 4 cups of frozen strawberries, 5oz of simple syrup, 4 ounces of light rum, and the juice of 1 lime. Blend until completely smooth. 2. Pour into glasses and garnish with fresh strawberries ',
     },
    { 
      id: 2,
      name: 'Gin and Tonic', 
      liquor: 'Gin',
      info: 'A bright and Zesty drink!',
      instructions: '1. Fill a highball glass with ice, then add 2 ounces of your favorite gin! 2. Pour around 4 ounces of tonic water and gently stir. 3. (Optional) Add some lime wheels or other garnishes',
  },
  {
      id: 3,
      name: 'Vodka Redbull',
      liquor: 'Vodka',
      info: 'Something to keep you going through a night of partying',
      instructions: '1. Fill a highball glass with ice, then add 2 ounces of your favorite vodka! 2. Pour the Original Red Bull ontop and gently stir',
  },
  ]);
  const [selectedValue, setSelectedValue] = useState('All');
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  const handleSelection = (value) => {
    setSelectedValue(value);
    navigation.setParams({ selectedValue: value });
    if(value === 'All') {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter(recipe => recipe.liquor === value);
      setFilteredRecipes(filtered);
    }
  };

  useEffect(() => {
    loadCocktails();
  }, [])
  
  useEffect(() => {
    if(selectedValue === 'All') {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter(recipe => recipe.liquor === selectedValue);
      setFilteredRecipes(filtered);
    }
  }, [recipes, selectedValue])

  const loadCocktails = async () => {
    try {
      const storedCocktails = await AsyncStorage.getItem('@recipes');
      if (storedCocktails !== null) {
        setRecipes(JSON.parse(storedCocktails));
        setFilteredRecipes(JSON.parse(storedCocktails));
      }
    } catch (error) {
      console.log(error)
    }
  }


  const addCocktailHandler = () => {
    navigation.navigate('Add', { addNewCocktail })
  }

  const viewCocktailHandler = (recipe) => {
    navigation.navigate('Details', { recipe })
  }

  const addNewCocktail = (newCocktail) => {
    setRecipes((prevRecipes) => [
      ...prevRecipes,
      { id: Math.random().toString(), ...newCocktail },
    ]);
  }



  const renderItem = ({ item }) => (
    <Card containerStyle={styles.container}>
      <Card.Title style={styles.cardTitle}>{item.name}</Card.Title>
      <Card.Divider/>
      <Text style={styles.cardDescription}>{item.info}</Text>
      <Button
      buttonStyle={{
        backgroundColor: 'rgba(249,101,116,1)',
      }}
      title="View Cocktail Recipe"
      onPress={() => viewCocktailHandler(item)}
      />
    </Card>
  );

  return (
    <View>
      <Text>Filter Main Ingredient</Text>
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
      <View style={styles.container}>
        <Text style={styles.heading}>Cocktail Showcase</Text>
        <Button 
          buttonStyle={{
            backgroundColor: 'rgba(255, 203, 173, 1)',
          }}
          title="Create new Cocktail!" 
          onPress={addCocktailHandler}/>
        <FlatList
        data={recipes.filter(recipe => selectedValue === 'All' || recipe.liquor === selectedValue)}
        keyExtractor={(recipe) => recipe.id}
        renderItem={renderItem}
        />
      </View>
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
        <Text style={styles.info}>{recipe.info}</Text>
        <Card.Divider/>
        <Text style={styles.instructions}>{recipe.instructions}</Text>
      </Card>
      <Button 
        buttonStyle={{
          backgroundColor: 'rgba(0, 188, 163, 1)',
        }}
        title="Return to Showcase!" 
        onPress={goBackHandler}/>
    </View>
  )
}

const addCreation = ({navigation, route}) => {
  const [name, setName] = useState('');
  const [liquor, setLiquor] = useState('');
  const [info, setInfo] = useState('');
  const [instructions, setInstructions] = useState('');

  const addRecipeHandler = () => {
    const newCocktail = {
      name: name,
      liquor: liquor,
      info: info,
      instructions: instructions
    };
    route.params.addNewCocktail(newCocktail)
    navigation.goBack()
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Add a new Cocktail!</Text>
      <TextInput 
        style={{ borderWidth: 1, borderColor: 'grey', padding: 10, margin: 10, width: 300 }}
        placeholder="Cocktail Name"
        value={name}
        onChangeText={text => setName(text)}/>
      <TextInput 
        style={{ borderWidth: 1, borderColor: 'grey', padding: 10, margin: 10, width: 300 }}
        placeholder="Liquor Used"
        value={liquor}
        onChangeText={text => setLiquor(text)}/>
      <TextInput
        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, margin: 10, width: 300 }}
        placeholder="Cocktail Description"
        value={info}
        onChangeText={text => setInfo(text)}
      />
      <TextInput
        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, margin: 10, width: 300, height: 200 }}
        placeholder="Cocktail Instructions"
        multiline={true}
        numberOfLines={10}
        value={instructions}
        onChangeText={text => setInstructions(text)}
      />
      <Button color="secondary" title="Add New Cocktail!" onPress={addRecipeHandler} />
      <Button color ="warning" title="Return to Showcase!" onPress={() => navigation.goBack()} />
    </View>
  )
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Showcase">
        <Stack.Screen name="Showcase" component={creationShowcase} options={{ title: 'Cocktail Showcase'}}/>
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
    paddingHorizontal: 10
  },
  dropdown: {
    marginHorizontal: 20,
    marginVertical: 20,
    borderColor: '#fff',
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
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
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
