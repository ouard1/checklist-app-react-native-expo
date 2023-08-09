import React from 'react';
import {StyleSheet , View} from 'react-native';

export default function Card(props){
    return (
        <View style={styles.card}>
            
                {props.children}
            
        </View>
    )
}
const styles =StyleSheet.create({
    card:{
        borderRadius: 10,
        elevation:3,
        backgroundColor :'#fff',
        shadowOffset : {width:1 ,height:1},
        shadowColor :'#263962',
        shadowOpacity : 0.3,
        shadowRadius:2,
        marginHorizontal:10,
        marginVertical:3,
        paddingHorizontal:18,
        width:"90%",
        height:80,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        alignSelf:"center"
        
    },
  
})