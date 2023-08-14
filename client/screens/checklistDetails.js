import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ChecklistContext } from "../Context/ChecklistContext";
import { useContext } from "react";
import Collapsible from "react-native-collapsible";
import { Entypo, Ionicons } from "@expo/vector-icons";

export default function ChecklistDetails({ route, navigation }) {
  const { item, checklistOptions } = route.params;
  const [activeSections, setActiveSections] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const toggleSection = (section) => {
    const isActive = activeSections.includes(section);
    setActiveSections((prevSections) =>
      isActive
        ? prevSections.filter((s) => s !== section)
        : [...prevSections, section]
    );
  };

  const { chauffeurs, equipements, etats } = useContext(ChecklistContext);
  
  const handleImageClick = () => {
    setModalVisible(true);
    setImageLoaded(false);
  };

  return ( <>
    <View style={styles.rectangle}>
    <View
      style={{
        flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  position: "relative",
      }}
    >
      <Ionicons
        name="chevron-back"
        color="#fff"
        style={{ marginTop:17,alignSelf: "flex-start",marginRight: "auto",}}
        size={24}
        onPress={() => navigation.goBack()}
      ></Ionicons>
      <Text
        style={{
          fontFamily: "poppins-SemiBold",
          color: "#fff",
        
        }}
      >
        {" "}
        Details de la checklist{" "}
      </Text>
      <View style={{ width: 24,
  height: 24,
  marginRight: "auto", }}></View>
    </View>
  </View>
    <ScrollView style={styles.container}>
    
       
          <View style={styles.card}>
            <View style={styles.smrectangle}>
              <Text style={{ fontFamily: "poppins-Regular", color: "#23247E" }}>
                Entete
              </Text>
            </View>
            <View style={{ padding: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 30,
                  alignItems: "center",
                }}
              >
                <Text style={styles.label}>Date: </Text>
                <Text style={styles.info}> {item.entete.date}</Text>
                <Text style={styles.sidelabel}>Heure: </Text>
                <Text style={styles.info}>{item.entete.heure}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.label}>Type: </Text>
                <Text style={styles.info}>{item.entete.type}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.label}>Chauffeur:</Text>
                <Text style={styles.info}>
                  {" "}
                  {
                    chauffeurs.find(
                      (chauf) => chauf.id === item.entete.chauffeur_id
                    )?.nom
                  }{" "}
                  {
                    chauffeurs.find(
                      (chauf) => chauf.id === item.entete.chauffeur_id
                    )?.prenom
                  }
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.label}>Véhicule : </Text>
                <Text style={styles.info}>
                  {
                    equipements?.find((ve) => ve.id === item.entete.vehicule_id)
                      ?.matricule
                  }{" "}
                  
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.detail}>
            <Text
              style={{
                color: "#23247E",
                fontFamily: "poppins-SemiBold",
                fontSize: 15,
              }}
            >
              Details
            </Text>
          </View>

          {item.details.map((detail, index) => (
            <View key={detail.checklistopt_id}>
              <TouchableOpacity
                style={styles.sections}
                onPress={() => toggleSection(detail.checklistopt_id)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.label}>
                    {" "}
                    {
                      checklistOptions.find(
                        (op) => op.id === detail.checklistopt_id
                      )?.lib
                    }
                  </Text>
                  <Entypo name="chevron-down" size={24} color="#23247E" />
                </View>
              </TouchableOpacity>

              <Collapsible
                style={styles.collapsible}
                collapsed={!activeSections.includes(detail.checklistopt_id)}
              >
                <View style={styles.cards}>
                  {detail.photo && (
                    <TouchableOpacity onPress={handleImageClick}>
                      <View style={styles.imageContainer}>
                        <Image
                          source={{ uri: detail.photo }}
                          style={styles.image}
                        />
                        <MaterialIcons
                          name="fullscreen"
                          size={40}
                          style={styles.fullscreen}
                        />
                      </View>
                    </TouchableOpacity>
                  )}

                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.sidelabel}>Note : </Text>
                    <Text style={styles.info}>{detail.note}</Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.sidelabel}>Etat : </Text>
                    <Text style={styles.info}>
                      {" "}
                      {etats.find((ve) => ve.id === detail.etat_id)?.lib}
                    </Text>
                  </View>

                  <Modal visible={modalVisible} animationType="fade">
                    <View style={styles.modalContainer}>
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                      >
                        <MaterialCommunityIcons
                          name="image-area-close"
                          size={30}
                          color="#fff"
                        />
                      </TouchableOpacity>
                      <Image
                        source={{ uri: detail.photo }}
                        style={styles.fullImage}
                        resizeMode="contain"
                      />
                    </View>
                  </Modal>
                </View>
              </Collapsible>
            </View>
          ))}
      
    
    </ScrollView></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
   
  },
  detail: {
    alignSelf: "flex-start",

    paddingHorizontal: 20,

    marginTop: 15,
    paddingVertical: 4,
    marginbottom: 10,
    marginLeft: 20,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  rectangle: {
    position: "relative",
    backgroundColor: "#23247E",
    height:60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    
  },
  smrectangle: {
    position: "absolute",
    backgroundColor: "#C0F6E7",
    top: 0,
    left: 0,
    right: "60%",
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 30,
    bottom: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    borderRadius: 10,
    elevation: 5,
    backgroundColor: "#fff",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowColor: "#23247E",
    marginHorizontal: 7,
   marginTop: 5 ,
    width: "85%",
    height: 150,
    alignSelf: "center",
    flexDirection: "column",
    justifyContent: "space-between",
    
   
  },

  label: {
    color: "#23247E",
    fontSize: 13,
    fontFamily: "poppins-Light",
  },
  sidelabel: {
    color: "#23247E",
    fontSize: 13,
    marginLeft: 10,
    fontFamily: "poppins-Light",
  },
  info: {
    fontFamily: "poppins-Light",
    color: "gray",
    fontSize: 13,
    marginLeft: 7,
    
  },

  imageContainer: {
    position: "relative",
    alignItems: "center",
    height: 200,
  },
  image: {
    width: "100%",
    height: 160,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 7,
    opacity: 0.5,
    backgroundColor: "#23247E",
  },
  fullscreen: {
    position: "absolute",
    alignSelf: "center",
    marginVertical: 60,
    padding: 5,
    borderRadius: 5,
    color: "#fff",
  },
  modalContainer: {
   flex:1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "relative",
    top: 20,
    marginTop: 20,
    marginHorizontal: 20,
  },
  sections: {
    alignSelf: "center",
    width: "85%",
    height: 45,
    borderRadius: 7,
    padding: 10,
    backgroundColor: "#fff",
    marginTop: 7,
    elevation: 4,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowColor: "#23247E",
  },

  collapsible: {
    backgroundColor: "rgba(254, 254, 254, 0.5)",
    borderRadius: 7,
    marginTop: 1,
    padding: 10,
  },
  cards: {
    backgroundColor: "#ffffff",
    borderRadius: 7,
    width: "89%",
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingBottom: 7,
    elevation: 4,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    shadowColor: "#23247E",
  },
});