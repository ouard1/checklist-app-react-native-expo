import React, { useState,useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const SegmentedButtons = ({ options, onValueChange, value ,defaultValue}) => {
  
  const [selectedValue, setSelectedValue] = useState(value );

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue);
    onValueChange(newValue);
  };
  useEffect(() => {
    setSelectedValue(defaultValue);
  
  }, [defaultValue])

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => handleValueChange(option.value)}
          style={[
            styles.button,
            {
              backgroundColor: selectedValue === option.value ? 'rgba(35, 36, 126,1) ' :  'transparent',
            },
          ]}
        >
          <Text style={{ color: selectedValue === option.value ? '#ffffff': '#23247E' ,fontFamily:"poppins-Light",fontSize:12 }}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 7,
    overflow: 'hidden',
    width:"100%" ,
    backgroundColor: "rgba(35, 36, 126, 0.02)",
    borderColor: "rgba(35, 36, 126, 0.3) ",
   height:37,
   borderWidth:0.5,
    marginBottom:5,
    alignItems:"center",
    justifyContent:"center"
  },
 
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height:"100%",
    borderRadius:0,
    borderColor: "rgba(35, 36, 126, 0.3) ",
    borderWidth:0.5,
   
  },
  label: {
    color: "#23247E",
    fontSize: 5,
    fontFamily: "poppins-Light",
  },
});

export default SegmentedButtons;
