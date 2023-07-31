import React from "react";
import {
  
  StyleSheet,
  Text,
  
  TouchableOpacity,
  
} from "react-native";
const CustomChip = ({ label, onPress }) => {
    return (
      <TouchableOpacity style={styles.chipContainer} onPress={onPress}>
        <Text style={styles.chipText}>{label}</Text>
      </TouchableOpacity>
    );
  };
  
  const styles = StyleSheet.create({
    chipContainer: {
      paddingVertical: 1,
      paddingHorizontal: 8,
      borderRadius: 20,
      backgroundColor: "#23247E",
      borderWidth: 1.3,
      borderColor: "#ffffff",
      margin:2,
      height:31,
      alignItems:"center",
      justifyContent:"center",
     
    },
    chipText: {
      color: "#ffffff",
      fontSize: 10,
      fontWeight:"500",
      fontFamily: "poppins-Light",
    },
  });
  
  export default CustomChip;
  