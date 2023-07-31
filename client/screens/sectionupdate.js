import React, { useState, useRef, useEffect } from "react";
import { SvgXml } from "react-native-svg";
import {
  View,
  Text,
  Image,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Camera, CameraType } from "expo-camera";
import {
  AntDesign,
  Entypo,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { addphoto, importphoto } from "../shared/svgIcons";
import SegmentedButtons from "../shared/segmentedButtons";

const Section = ({ title, setFormData, sectionIndex, defaultValues }) => {
  const note = defaultValues?.note;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      note: note,
    },
  });
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, SetFlash] = useState(Camera.Constants.FlashMode.off);
  const [image, setImage] = useState(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const cameraRef = useRef(null);
  const [value, setValue] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [etatError, setEtatError] = useState(false);
  const handleSectionSubmit = (data) => {
    if (value == undefined) {
      setEtatError(true);
    } else {
    setEtatError(false);
    setFormData((prevData) => {
      const updatedData = [...prevData];
      const existingSection = updatedData.find(
        (section) => section.checklistopt_id === sectionIndex
      );

      if (existingSection) {
        existingSection.etat_id = value;
        existingSection.photo = image;
        existingSection.note = data.note;
      } else {
        updatedData.push({
          ...data,
          photo: image,
          etat_id: value,
          checklistopt_id: sectionIndex,
        });
      }

      return updatedData;
    });

    setIsSubmitted(true);
   } };
  useEffect(() => {
    setValue(defaultValues?.etat_id);
    setImage(defaultValues?.photo);
  }, [defaultValues?.etat_id, defaultValues?.photo]);
  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);
  

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: true,
      });
      setImage(photo.uri);
    }
  };

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission denied");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveImage = async () => {
    if (image) {
      try {
        await MediaLibrary.createAssetAsync(image);
        alert("Image enregistrée");
        setImage(null);
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>{title}</Text>
        <Text style={styles.label}>État</Text>

        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          options={[
            {
              value: 1,
              label: "Bon",
            },
            {
              value: 2,
              label: "Déterioré",
            },
            { value: 3, label: "Sensible" },
          ]}
          defaultValue={defaultValues?.etat_id}
        />
         {etatError && (
          <Text style={styles.errorText}>veuillez choisir un état</Text>
        )}
        <Text style={styles.label}>Observation : </Text>
        <View style={styles.holder}>
          <Controller
            control={control}
            rules={{
              required: false,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                multiline
                placeholder={
                  note !== undefined ? note : "écrire une observation"
                }
                placeholderTextColor={"rgba(35, 36, 126, 0.8)"}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="note"
          />
        </View>

        <Modal
          visible={showCameraModal}
          animationType="slide"
          onRequestClose={() => setShowCameraModal(false)}
        >
          <View style={{ flex: 1 }}>
            {!image ? (
              <View style={{ flex: 1 }}>
                <Camera
                  style={{ flex: 1 }}
                  type={type}
                  flashMode={flash}
                  ref={cameraRef}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 22,
                    paddingHorizontal: 30,
                    alignItems: "center",
                  }}
                >
                  <Entypo
                    name="retweet"
                    size={24}
                    color="black"
                    onPress={() => {
                      setType(
                        type === CameraType.back
                          ? CameraType.front
                          : CameraType.back
                      );
                    }}
                  />
                  <MaterialIcons
                    name="camera"
                    size={40}
                    color="black"
                    onPress={takePicture}
                  />
                  <Entypo
                    name="flash"
                    size={24}
                    color={
                      flash === Camera.Constants.FlashMode.off
                        ? "black"
                        : "gray"
                    }
                    onPress={() => {
                      SetFlash(
                        flash === Camera.Constants.FlashMode.off
                          ? Camera.Constants.FlashMode.on
                          : Camera.Constants.FlashMode.off
                      );
                    }}
                  />
                </View>

                <AntDesign
                  name="close"
                  size={27}
                  color="white"
                  style={{ position: "absolute", top: 15, right: 15 }}
                  onPress={() => setShowCameraModal(false)}
                />
              </View>
            ) : (
              <Image style={{ flex: 1 }} source={{ uri: image }} />
            )}

            {image && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 22,
                  paddingHorizontal: 30,
                  alignItems: "center",
                }}
              >
                <FontAwesome5
                  name="redo-alt"
                  size={24}
                  onPress={() => setImage(null)}
                />
                <AntDesign
                  name="checkcircle"
                  size={40}
                  color="black"
                  onPress={() => setShowCameraModal(false)}
                />
                <Entypo name="save" size={24} onPress={saveImage} />
              </View>
            )}
          </View>
        </Modal>

        <Text style={styles.label}>Photo :</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {image && (
            <View style={styles.imagecontainer}>
              <Image
                source={{ uri: image }}
                style={{
                  height: "100%",
                  width: "100%",
                  margin: 2,
                  borderRadius: 7,
                  overflow: "hidden",
                }}
              />
            </View>
          )}
          {!image && (
            <View style={styles.imagecontainer}>
              <Text style={styles.input}> la photo va s'afficher ici</Text>
            </View>
          )}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{ marginRight: 9 }}
              onPress={() => setShowCameraModal(true)}
            >
              <SvgXml xml={addphoto} width="36" height="36" />
            </TouchableOpacity>
            <TouchableOpacity onPress={selectImage}>
              <SvgXml xml={importphoto} width="36" height="36" />
            </TouchableOpacity>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            {
              borderColor: isSubmitted
                ? "rgba(94, 95, 98, 0.7)"
                : "rgba(35, 36, 126, 0.3) ",
              backgroundColor: isSubmitted
                ? "rgba(94, 95, 98, 0.5)"
                : pressed
                ? "rgba(35, 36, 126, 0.3)"
                : "#fff",
              opacity: isSubmitted ? 0.7 : 1,
            },
          ]}
          disabled={isSubmitted}
          onPress={handleSubmit(handleSectionSubmit)}
        >
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "#23247E",
                fontFamily: "poppins-Regular",
                marginRight: 3,
                fontSize: 14,
              }}
            >
              Terminé
            </Text>
            <AntDesign name="check" size={23} color="#23247E" />
          </View>
        </Pressable>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 2,
    alignItems: "center",
    backgroundColor: "rgba(52, 52, 52, alpha)",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 7,
    width: "100%",
    marginVertical: 4,
    paddingHorizontal: 18,
    paddingBottom: 7,
    elevation: 5,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    shadowColor: "#23247E",
  },
  holder: {
    borderWidth: 0.7,
    height: 37,
    width: "100%",
    borderRadius: 7,
    backgroundColor: "rgba(35, 36, 126, 0.02)",
    borderColor: "rgba(35, 36, 126, 0.3) ",
    justifyContent: "center",
    marginBottom: 2,
  },
  camera: {
    flex: 3 / 2,
    borderRadius: 20,
  },

  label: {
    fontFamily: "poppins-Regular",
    color: "#23247E",
    marginBottom: 5,
    fontSize: 13,
  },
  input: {
    fontFamily: "poppins-Light",
    color: "rgba(35, 36, 126, 0.8)",
    fontSize: 12,
    padding: 5,
  },
  photobtn: {
    backgroundColor: "#C0F6E7",
    height: 50,
    width: "49%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  button: {
    height: 40,
    width: "100%",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 10,
    borderColor: "#23247E",
    borderWidth: 2,
    borderRadius: 7,
    justifyContent: "center",
  },
  insertpt: {
    borderWidth: 0.5,

    backgroundColor: "rgba(35, 36, 126, 0.05)",
    height: 38,
    borderRadius: 7,
    borderColor: "rgba(35, 36, 126, 0.2) ",
    justifyContent: "center",
  },

  imagecontainer: {
    borderWidth: 0.7,
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    width: 200,
    borderRadius: 7,
    marginRight: 2,
    backgroundColor: "rgba(35, 36, 126, 0.02)",
    borderColor: "rgba(35, 36, 126, 0.3) ",
  },
});

export default Section;
