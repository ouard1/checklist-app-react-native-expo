import {Camera , CameraType} from 'expo-camera';
import React,{useState,useEffect,useRef} from 'react';
import{ StyleSheet , View,Text ,Image} from 'react-native';
import * as MediaLibrary from 'expo-media-library';

export default function Camerae(){
    const [hasCameraPermission ,setHasCameraPermission] = useState(null);
    const [image,setImage] = useState(null);
    const [type ,setType] = useState(Camera.Constants.Type.back)
    const [flash , SetFlash] = useState(Camera.Constants.FlashMode.off ) 
    const cameraRef =  useRef(null);
    useEffect(()=>{ 
        (async ()=>{MediaLibrary.requestPermissionsAsync()
        const cameraStatus= await Camera.requestCameraPermissionsAsync();
        console.log(cameraStatus.status);
        setHasCameraPermission(cameraStatus.status==='granted')
    
    })();
    },[])
    const takePicture = async ()=>{
        if (cameraRef) {
            try{
                const data=await cameraRef.current.takePictureAsync();
                console.log(data) ;
                setImage(data.uri);
            }catch(e){ console.log(e) ; }
        }
    }
    const saveImage = async()=>{
        if(image) {
            try{ await MediaLibrary.createAssetAsync(image) ; 
            alert('picture saved') ;
        setImage(null) }catch(e){ console.log(e);}
        } 
    }
    if(hasCameraPermission===false){
        <Text>No access to Camera</Text>
    }
    return(
        <View style={globalStyles.container}>
            {!image ? 
            <Camera
            style = {styles.camera}
            type = {type}
            flashMode={flash}
            ref = {cameraRef}
            >
                <View style={{flexDirection :'row' ,justifyContent:'space-between' ,padding:30 }}>
                    <Button icon={"retweet"} onPress={()=>{setType(type===CameraType.back? CameraType.front : CameraType.back)}}></Button>
                    <Button icon ={"flash"} color={flash===Camera.Constants.FlashMode.off? "gray" : "#f1f1f1"} onPress={()=>{ SetFlash(flash===Camera.Constants.flashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off)}}></Button>
                </View>
            </Camera>
            :
            <Image style={ styles.camera} source={{uri : image}}/>}
            <View>
                {image? <View style={{ flexDirection : 'row' , justifyContent:'space-between'  ,paddingHorizontal : 50}}>
                    <Button title={"retake picture"} icon={"retweet"} onPress={()=> setImage(null)}></Button>
                    <Button title = {"save"} icon={"check"} onPress={saveImage}></Button>
                </View> :
                <Button icon={"camera"} title={'take a picture'}  onPress={takePicture}></Button>
            }
            </View>
        </View>

    );
}

const styles =StyleSheet.create(
    {
        camera: {
            flex : 3/2 , 
            borderRadius:20,

        },
       
    }
);