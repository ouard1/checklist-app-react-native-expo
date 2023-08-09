import React, { useContext ,useEffect} from 'react';
import Home from './screens/home';
import ChecklistDetails from './screens/checklistDetails';
import { NavigationContainer ,useNavigation} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChecklistForm from './screens/checklistForm';
import { View, ActivityIndicator } from 'react-native';
import { AuthContext, AuthProvider } from './Context/authContext';
import { ChecklistProvider } from './Context/ChecklistContext';
import checklistUpdate from './screens/checklistUpdate';
import { useFonts } from 'expo-font';
import Login from './screens/login';
import FilterForm from './screens/FilterForm';

const Stack = createNativeStackNavigator();

function AppNavigation() {
  const { isLoading, usertoken } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (usertoken === null) {
      navigation.navigate('Login');
    }
  }, [usertoken, navigation]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {usertoken !== null ? (
        <>
          <Stack.Screen name="Home" component={Home} options={{ title: 'Home',headerShown: false  }} />
          <Stack.Screen name="ChecklistDetails" component={ChecklistDetails} options={{ title: 'Details',headerShown: false  , headerStyle: { backgroundColor: '#F2F2FB' } }} />
          <Stack.Screen name="ChecklistForm" component={ChecklistForm} options={{ title: 'ChecklistForm', headerStyle: { backgroundColor: '#f4511e' } }} />
          <Stack.Screen name="checklistUpdate" component={checklistUpdate} options={{ headerShown: false }} />
          <Stack.Screen name="FilterForm" component={FilterForm} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'poppins-SemiBold' : require('./assets/Fonts/Poppins/Poppins-SemiBold.ttf'),
    'poppins-Medium' : require('./assets/Fonts/Poppins/Poppins-Medium.ttf'),
    'poppins-Light' : require('./assets/Fonts/Poppins/Poppins-Light.ttf'),
    'poppins-Regular' : require('./assets/Fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold' : require('./assets/Fonts/Poppins/Poppins-Bold.ttf'),
    
  });

  if (!fontsLoaded) {
    return null;
  }
 


  return (
    <AuthProvider>
      <ChecklistProvider>
        <NavigationContainer>
          <AppNavigation />
        </NavigationContainer>
      </ChecklistProvider>
    </AuthProvider>
  );
}
