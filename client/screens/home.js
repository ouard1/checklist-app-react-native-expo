import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Keyboard,
  Alert,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Card from "../shared/card";
import { Feather } from "@expo/vector-icons";
import ChecklistForm from "./checklistForm";
import axios from "axios";
import { AuthContext } from "../Context/authContext";
import { ChecklistContext } from "../Context/ChecklistContext";
import FilterForm from "./FilterForm";
import CustomChip from "../shared/CustomChip";
import { SvgXml } from "react-native-svg";
import { deletexml, updatexml, xmllogout, filterxml } from "../shared/svgIcons";
import { useIsFocused } from "@react-navigation/native";

export default function Home({ navigation }) {
  const [checklistOptions, setChecklistOptions] = useState(null);
  const { chauffeurs, equipements } = useContext(ChecklistContext);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const { logout, usertoken } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [checklists, setChecklists] = useState(null);
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [filterValues, setFilterValues] = useState({
    equipement_id: null,
    chauffeur_id: null,
    dateDebut: "",
    dateFin: "",
    type: "",
  });
  const [appliedFilters, setAppliedFilters] = useState([]);
  const screenHeight = Dimensions.get("window").height;
  const removeFilter = (filter) => {
    const updatedFilters = appliedFilters.filter((item) => item !== filter);
    setAppliedFilters(updatedFilters);
    if (filter.startsWith("Equipement:") && filterValues.equipement_id) {
      setFilterValues((prevValues) => ({
        ...prevValues,
        equipement_id: null,
      }));
    }

    if (filter.startsWith("Chauffeur:") && filterValues.chauffeur_id) {
      setFilterValues((prevValues) => ({
        ...prevValues,
        chauffeur_id: null,
      }));
    }
    if (filterValues.dateDebut && filter === filterValues.dateDebut) {
      setFilterValues((prevValues) => ({
        ...prevValues,
        dateDebut: "",
      }));
    }
    if (filterValues.dateFin && filter === filterValues.dateFin) {
      setFilterValues((prevValues) => ({
        ...prevValues,
        dateFin: "",
      }));
    }
    if (filterValues.type && filter === filterValues.type) {
      setFilterValues((prevValues) => ({
        ...prevValues,
        type: "",
      }));
    }
  };

  useEffect(() => {
    if (checklists) {
      try {
        const filteredData = checklists.filter((item) => {
          if (
            (filterValues.equipement_id &&
              item.entete.vehicule_id !== filterValues.equipement_id) ||
            (filterValues.chauffeur_id &&
              item.entete.chauffeur_id !== filterValues.chauffeur_id) ||
            (filterValues.dateDebut &&
              item.entete.date < filterValues.dateDebut) ||
            (filterValues.dateFin && item.entete.date > filterValues.dateFin) ||
            (filterValues.type && item.entete.type !== filterValues.type)
          ) {
            return false;
          }
          return true;
        });

        setFilteredDataSource(filteredData);
      } catch (e) {
        console.log(e);
      }
    }
  }, [filterValues, checklists]);

  const handleFilterSubmit = (filterValues) => {
    setFilterValues(filterValues);
    const filteredData = checklists.filter((item) => {
      if (
        (filterValues.equipement_id &&
          item.entete.vehicule_id !== filterValues.equipement_id) ||
        (filterValues.chauffeur_id &&
          item.entete.chauffeur_id !== filterValues.chauffeur_id) ||
        (filterValues.dateDebut && item.entete.date < filterValues.dateDebut) ||
        (filterValues.dateFin && item.entete.date > filterValues.dateFin) ||
        (filterValues.type && item.entete.type !== filterValues.type)
      ) {
        return false;
      }
      return true;
    });

    setFilteredDataSource(filteredData);
    setModalVisible(false);
  };

  const fetchChecklists = async () => {
    try {
      const response = await axios.get(
        "http://192.168.43.56:3000/checklistdetails",
        {
          headers: {
            Authorization: `Bearer ${usertoken}`,
          },
        }
      );
      const data = response.data;

      setChecklists(data);
      setFilteredDataSource(data);
    } catch (error) {
      console.error("Error fetching checklists:", error);
    }
  };

  const fetchChecklistOptions = async () => {
    try {
      const response = await axios.get(
        "http://192.168.43.56:3000/checklistoptions",
        {
          headers: {
            Authorization: `Bearer ${usertoken}`,
          },
        }
      );
      const data = response.data;
      setChecklistOptions(data);
    } catch (error) {
      console.error("Error fetching checklists options", error);
    }
  };

  useEffect(() => {
    fetchChecklistOptions();
    if (isFocused) {
      fetchChecklists();
    }
  }, [isFocused]);

  const sendFormData = async (formData) => {
    try {
      // Filter out undefined or null values from checklistDetails array
      const filteredChecklistDetails = formData.checklistDetails.filter(
        (detail) => detail && detail.checklistopt_id !== null
      );
      if (filteredChecklistDetails.length === 0) {
        alert(
          "Veuillez ajouter au moins un détail de liste de contrôle valide."
        );
        return;
      }
      // Create a new formData object with the filtered checklistDetails
      const updatedFormData = {
        entete: {
          date: formData.date,
          heure: formData.heure,
          vehicule_id: formData.vehicule_id,
          chauffeur_id: formData.chauffeur_id,
          type: formData.type,
        },
        checklistDetails: filteredChecklistDetails,
      };

      const response = await axios.post(
        "http://192.168.43.56:3000/checklistdetails",
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${usertoken}`,
          },
        }
      );

      setModalOpen(false);
      const createdChecklist = response.data;

      // Update the local state checklists with the newly created checklist
      //setChecklists((currentChecklists) => {
      //  return [createdChecklist, ...currentChecklists];
      //});

      // Update the filteredDataSource with the new checklist
      // setFilteredDataSource((currentChecklists) => {
      // return [createdChecklist, ...currentChecklists];
      //});

      fetchChecklists();
    } catch (error) {
      console.log("Error sending Form data:", error);
    }
  };

  const deleteChecklist = async (id) => {
    try {
      Alert.alert(
        "Confirmation",
        "Êtes-vous sûr de vouloir supprimer cette checklist ?",
        [
          {
            text: "Annuler",
            style: "cancel",
          },
          {
            text: "Supprimer",
            onPress: async () => {
              try {
                await axios.delete(
                  `http://192.168.43.56:3000/checklistdetails/${id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${usertoken}`,
                    },
                  }
                );
                console.log("Checklist deleted successfully");

                setChecklists((currentChecklists) =>
                  currentChecklists.filter(
                    (checklist) => checklist.entete.id !== id
                  )
                );
                setFilteredDataSource((currentDataSource) =>
                  currentDataSource.filter(
                    (checklist) => checklist.entete.id !== id
                  )
                );
              } catch (error) {
                console.error("Error deleting checklist:", error);
              }
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error("Error showing confirmation alert:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.rectangle} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          paddingHorizontal: 18,
          paddingTop: 10,
        }}
      >
        <Text
          style={{ color: "#fff", fontFamily: "poppins-Light", fontSize: 17 }}
        >
          {" "}
          Home
        </Text>
        <TouchableOpacity onPress={logout}>
          <SvgXml xml={xmllogout} width="23" height="23" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginTop: 23,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            width: "50%",
            color: "white",
            fontSize: 22,
            fontFamily: "poppins-SemiBold",
            marginLeft: 18,
          }}
        >
          Toutes les checklists
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setModalOpen(true)}
          >
            <Feather
              name="plus"
              size={21}
              color="#23247E"
              style={{ marginRight: 5 }}
            />
            <Text style={styles.addBtnText}>Ajouter</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={{ marginRight: 18, marginTop: 10, alignSelf: "flex-end" }}
        onPress={() => setModalVisible(true)}
      >
        <SvgXml xml={filterxml} width="25" height="25" />
      </TouchableOpacity>

      <View style={styles.checklistsContainer}>
        <View style={styles.filtersContainer}>
          <ScrollView horizontal>
            {appliedFilters.map((filter) => {
              if (filter.startsWith("Equipement:")) {
                const equipementId = parseInt(filter.split(":")[1]);
                const equipement = equipements?.find(
                  (item) => item.id === equipementId
                );
                if (equipement) {
                  return (
                    <CustomChip
                      key={filter}
                      label={`${equipement.matricule}`}
                      onPress={() => removeFilter(filter)}
                    />
                  );
                }
              } else if (filter.startsWith("Chauffeur:")) {
                const chauffeurId = parseInt(filter.split(":")[1]);
                const chauffeur = chauffeurs.find(
                  (item) => item.id === chauffeurId
                );
                if (chauffeur) {
                  return (
                    <CustomChip
                      key={filter}
                      label={` ${chauffeur.nom} ${chauffeur.prenom}`}
                      onPress={() => removeFilter(filter)}
                    />
                  );
                }
              } else {
                return (
                  <CustomChip
                    key={filter}
                    label={filter}
                    onPress={() => removeFilter(filter)}
                  />
                );
              }
            })}
          </ScrollView>
        </View>
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <FilterForm
                  onSubmit={handleFilterSubmit}
                  setAppliedFilters={setAppliedFilters}
                  setModalVisible={setModalVisible}
                />
              </View>
            </View>
          </View>
        </Modal>
        <View style={{ maxHeight: screenHeight * 0.67 }}>
          <FlatList
            style={{ marginTop: 22 }}
            data={filteredDataSource}
            renderItem={({ item }) => {
              const equipement = equipements?.find(
                (equipement) => equipement.id === item.entete?.vehicule_id
              );
              const matricule = equipement ? equipement.matricule : "";
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ChecklistDetails", {
                      item,
                      checklistOptions,
                    })
                  }
                >
                  <Card>
                    <View>
                      <Text
                        style={{
                          fontFamily: "poppins-Regular",
                          fontSize: 14,
                          color: "#23247E",
                        }}
                      >
                        {matricule}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "poppins-Regular",
                          fontSize: 12,
                          color: "#6d727c",
                        }}
                      >
                        le {item.entete?.date}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        style={{ marginRight: 8 }}
                        onPress={() => deleteChecklist(item.entete.id)}
                      >
                        <SvgXml xml={deletexml} width="34" height="34" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("checklistUpdate", {
                            defaultValues: item,
                            checklistOptions,
                          })
                        }
                      >
                        <SvgXml xml={updatexml} width="34" height="34" />
                      </TouchableOpacity>
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <Modal visible={modalOpen} animationType="slide">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContent}>
              <ChecklistForm
                sendFormData={sendFormData}
                checklistOptions={checklistOptions}
                setModalOpen={setModalOpen}
              />
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#23247E",
    display: "flex",
    flex: 1,
  },
  rectangle: {
    position: "absolute",
    backgroundColor: "#E8ECEF",
    top: "37%",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 53,
    borderTopRightRadius: 53,
  },

  checklistsContainer: {
    paddingBottom: 20,
    marginTop: 1,
    alignItems: "center",
  },

  modalToggle: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
  },

  filterIcon: {
    position: "absolute",
    top: "5%",
    right: "5%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  modalContent: {
    flex: 1,
    zIndex: 2,
  },
  modalContainer: {
    flex: 1,
  },
  filtersContainer: {
    flexDirection: "row",
    marginTop: 13,
    padding: 18,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  addBtn: {
    flexDirection: "row",
    backgroundColor: "#C0F6E7",
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    width: 140,
    height: 55,
  },
  addBtnText: {
    color: "#23247E",
    fontSize: 16,
    fontFamily: "poppins-Regular",
  },
  iconcontainer: {
    backgroundColor: "#C0F6E7",
    height: 39,
    width: 39,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});
