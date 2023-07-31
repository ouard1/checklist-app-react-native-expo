import React, { useContext, useState } from "react";
import {
  StatusBar,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { AuthContext } from "../Context/authContext";

const Login = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user: "",
      pwd: "",
    },
  });

  const { login,errorMessage ,isLoading } = useContext(AuthContext);
  
  const Onsubmit = async (data) => {
    try {
      await login(data.user, data.pwd);
    } catch (error) {
     
      
      console.log(error)
    }
  };
 
  return (
    <>
      <StatusBar hidden />
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <View style={styles.contentContainer}>
          <Text style={styles.welcomeText}>Bienvenue</Text>
          <Text style={styles.loginText}>Connectez-vous à votre compte</Text>

          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder=" Username"
                keyboardType="email-address"
                onChangeText={onChange}
                value={value}
              />
            )}
            name="user"
          />
          {errors.user && (
            <Text style={styles.errorText}>*Veuillez remplir ce champ</Text>
          )}

          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                secureTextEntry={true}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="pwd"
          />

          {errors.pwd && (
            <Text style={styles.errorText}>*Veuillez remplir ce champ</Text>
          )}
         {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleSubmit(Onsubmit)}>
             
             {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
              
           
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#26247E",
  },
  errorText: {
    color: "red",
    fontSize: 10,
    marginTop:2,
    fontFamily: "poppins-Light",
    alignSelf: "flex-start",
    marginLeft: 40,
  },
  contentContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 100,
    paddingTop: 100,

    alignItems: "center",
    width: "100%",
    height: "100%",
  },

  title: {
    color: "#fff",
    fontSize: 45,
    fontFamily: "Poppins-Bold",
    marginVertical: 20,
  },
  welcomeText: {
    fontSize: 30,
    color: "#23247E",
    fontFamily: "Poppins-Bold",
    marginBottom: 1,
  },
  loginText: {
    color: "grey",
    fontSize: 14,
    fontFamily: "poppins-Light",
    marginBottom: 20,
  },
  input: {
    borderRadius: 7,
    color: "#23247E",
    paddingHorizontal: 15,
    borderWidth: 0.7,
    borderColor: "rgba(35, 36, 126, 0.51)",
    backgroundColor: "rgba(35, 36, 126, 0.07)",
    marginVertical: 7,
    height: 40,
    width: 316,
    fontSize: 12,
    fontFamily: "poppins-Light",
  },

  loginButton: {
    backgroundColor: "#23247E",
    borderRadius: 7,
    alignItems: "center",
    paddingVertical: 8,
    marginVertical: 30,
    height: 40,
    width: 316,
  },
  loginButtonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "poppins-Medium",
  },
});

export default Login;
