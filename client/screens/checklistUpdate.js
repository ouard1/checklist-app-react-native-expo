import React, { useState, useRef, useContext, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ChecklistContext } from "../Context/ChecklistContext";
import Collapsible from "react-native-collapsible";
import { AuthContext } from "../Context/authContext";
import { Entypo, Ionicons } from "@expo/vector-icons";
import Section from "./sectionupdate";
import SegmentedButtons from "../shared/segmentedButtons";

export default function ChecklistForm({ route, navigation }) {
  const { defaultValues, checklistOptions } = route.params;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  console.log(defaultValues);

  const { usertoken } = useContext(AuthContext);
  const [date, setDate] = useState(new Date());
  const [activeSections, setActiveSections] = useState([]);
  const [time, setTime] = useState(new Date());
  const [value, setValue] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState(defaultValues.details || []);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { equipements, chauffeurs } = useContext(ChecklistContext);
  const [search, setSearch] = useState("");
  const [clickedChauffeur, setClickedChauffeur] = useState(false);
  const [equipementClicked, setEquipementClicked] = useState(false);
  const [data, setData] = useState(equipements);
  const [datac, setDatac] = useState(chauffeurs);
  const [selectedEquipement, setSelectedEquipement] = useState("");
  const [selectedChauffeur, setSelectedChauffeur] = useState("");
  const [selectedEquipementId, setSelectedEquipementId] = useState(null);
  const [selectedChauffeurId, setSelectedChauffeurId] = useState(null);
  const searchRef = useRef();

  const onSearch = (search) => {
    if (search !== "") {
      let tempData = equipements.filter((item) => {
        return item.matricule.toLowerCase().indexOf(search.toLowerCase()) > -1;
      });
      setData(tempData);
    } else {
      setData(equipements);
    }
  };

  const [activeChecklistDetails, setActiveChecklistDetails] = useState({});

  const toggleSection = (section) => {
    const isActive = activeSections.includes(section);
    setActiveSections((prevSections) =>
      isActive
        ? prevSections.filter((s) => s !== section)
        : [...prevSections, section]
    );

    setActiveChecklistDetails((prevDetails) =>
      isActive
        ? {
            ...prevDetails,
            [section]: undefined,
          }
        : {
            ...prevDetails,
            [section]: defaultValues.details.find(
              (detail) => detail.checklistopt_id === section
            ),
          }
    );
  };

  useEffect(() => {
    setSelectedEquipement(
      equipements.find((ve) => ve.id === defaultValues.entete.vehicule_id)
        ?.matricule
    );
    const chauffeur = chauffeurs.find(
      (chauf) => chauf.id === defaultValues.entete.chauffeur_id
    );
    setSelectedChauffeur(`${chauffeur?.nom} ${chauffeur?.prenom}`);
    setSelectedChauffeurId(defaultValues.entete.chauffeur_id);
    setSelectedEquipementId(defaultValues.entete.vehicule_id);
    setDate(new Date(defaultValues.entete.date));
    setValue(defaultValues?.type);
  }, [
    defaultValues.entete.vehicule_id,
    defaultValues.entete.chauffeur_id,
    equipements,
    chauffeurs,
    defaultValues.entete.date,
    defaultValues.entete.type,
  ]);
  const onSearchChauffeur = (search) => {
    if (search !== "") {
      let tempData = chauffeurs.filter((item) => {
        return (
          item.nom.toLowerCase().includes(search.toLowerCase()) ||
          item.prenom.toLowerCase().includes(search.toLowerCase())
        );
      });
      setDatac(tempData);
    } else {
      setDatac(chauffeurs);
    }
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const toggleTimePicker = () => {
    setShowTimePicker(!showTimePicker);
  };

  const onChangeTime = (event, selectedTime) => {
    if (selectedTime) {
      console.log(selectedTime.toTimeString());
      const currentTime = selectedTime;
      setTime(currentTime);
    }
    toggleTimePicker();
  };

  const onChangeDate = (event, selectedDate) => {
    if (selectedDate) {
      console.log(selectedDate.toISOString());
      const currentDate = selectedDate;
      setDate(currentDate);
    }
    toggleDatePicker();
  };

  const onSubmit = (data) => {
    const updatedFormData = {
      date: date.toISOString().slice(0, 10),
      heure: time.toTimeString().slice(0, 8),
      vehicule_id: selectedEquipementId,
      chauffeur_id: selectedChauffeurId,
      type: value,
      checklistDetails: formData,
    };

    setFormData(updatedFormData);
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir modifier cette checklist ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Modifier",
          onPress: () => {
            axios
              .put(
                `http://192.168.43.56:3000/checklistdetails/${defaultValues.entete.id}`,
                updatedFormData,
                {
                  headers: {
                    Authorization: `Bearer ${usertoken}`,
                  },
                }
              )
              .then((response) => {
                console.log(response.data);
                navigation.goBack();
              })
              .catch((error) => {
                console.log(error);
              });
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.rectangle}>
        <View style={styles.headerContainer}>
          <Ionicons
            name="chevron-back"
            color="#fff"
            style={styles.icon}
            size={24}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerText}>Modifier checklist</Text>
          <View style={styles.placeholderIcon}></View>
        </View>
      </View>
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 45,
            marginBottom: 4,
          }}
        >
          <Text style={styles.label}>Date :</Text>
          <View>
            {showDatePicker && (
              <DateTimePicker
                mode="date"
                display="spinner"
                value={date}
                onChange={onChangeDate}
              />
            )}
            {!showDatePicker && (
              <Pressable onPress={toggleDatePicker}>
                <TextInput
                  style={styles.dateinput}
                  editable={false}
                  placeholderTextColor={"rgba(35, 36, 126, 0.8)"}
                  placeholder={
                    !date
                      ? "veuillez rentrer la date"
                      : date.toISOString().slice(0, 10)
                  }
                />
              </Pressable>
            )}
          </View>

          <Text style={styles.label}>Heure :</Text>
          <View>
            {showTimePicker && (
              <DateTimePicker
                mode="time"
                display="spinner"
                value={time}
                onChange={onChangeTime}
              />
            )}
            {!showTimePicker && (
              <Pressable onPress={toggleTimePicker}>
                <TextInput
                  style={styles.timeinput}
                  editable={false}
                  placeholderTextColor={"rgba(35, 36, 126, 0.8)"}
                  placeholder={
                    !time
                      ? "veuillez rentrer le temps"
                      : time.toTimeString().slice(0, 8)
                  }
                />
              </Pressable>
            )}
          </View>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.label}>Chauffeur :</Text>

          <TouchableOpacity
            style={styles.holder}
            onPress={() => {
              setClickedChauffeur(!clickedChauffeur);
            }}
          >
            <Text
              style={{
                padding: 10,
                fontSize: 12,
                color: "rgba(35, 36, 126, 0.8)",
                fontFamily: "poppins-Light",
              }}
            >
              {selectedChauffeur == ""
                ? "selectionner un chauffeur"
                : selectedChauffeur}
            </Text>
          </TouchableOpacity>
          <Modal
            visible={clickedChauffeur}
            transparent={true}
            animationType="fade"
          >
            <TouchableWithoutFeedback
              onPress={() => setClickedChauffeur(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.dropdownModal}>
                  <TextInput
                    ref={searchRef}
                    style={styles.searchInput}
                    placeholderTextColor={"#23247E"}
                    placeholder=" Rechercher.."
                    value={search}
                    onChangeText={(text) => {
                      setSearch(text);
                      onSearchChauffeur(text);
                    }}
                  />
                  <FlatList
                    data={datac}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.listItem}
                        onPress={() => {
                          setSelectedChauffeur(`${item.nom} ${item.prenom}`);
                          setSelectedChauffeurId(item.id);
                          setClickedChauffeur(false);
                        }}
                      >
                        <Text
                          style={styles.listItemText}
                        >{`${item.nom} ${item.prenom}`}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <Text style={styles.label}>Véhicule :</Text>

          <TouchableOpacity
            style={styles.holder}
            onPress={() => {
              setEquipementClicked(!equipementClicked);
            }}
          >
            <Text
              style={{
                padding: 10,
                fontSize: 12,
                color: "rgba(35, 36, 126, 0.8)",
                fontFamily: "poppins-Light",
              }}
            >
              {selectedEquipement == ""
                ? "selectionner véhicule"
                : selectedEquipement}
            </Text>
          </TouchableOpacity>
          <Modal
            visible={equipementClicked}
            transparent={true}
            animationType="fade"
          >
            <TouchableWithoutFeedback
              onPress={() => setEquipementClicked(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.dropdownModal}>
                  <TextInput
                    ref={searchRef}
                    style={styles.searchInput}
                    placeholderTextColor={"#23247E"}
                    placeholder="  Rechercher.."
                    value={search}
                    onChangeText={(text) => {
                      setSearch(text);
                      onSearch(text);
                    }}
                  />
                  <FlatList
                    data={data}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.listItem}
                        onPress={() => {
                          setSelectedEquipement(item.matricule);
                          setSelectedEquipementId(item.id);
                          setEquipementClicked(false);
                        }}
                      >
                        <Text style={styles.listItemText}>
                          {item.matricule}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          <Text style={styles.label}>Type :</Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <SegmentedButtons
                options={[
                  {
                    value: "entree",
                    label: "Entrée",
                  },
                  {
                    value: "sortie",
                    label: "Sortie",
                  },
                ]}
                value={value}
                onValueChange={setValue}
                defaultValue={defaultValues.entete.type}
              />
            )}
            name="type"
          />
        </View>

        <View style={styles.sectionsContainer}>
          {checklistOptions.map((option) => (
            <View key={option.id}>
              <TouchableOpacity
                style={styles.sections}
                onPress={() => toggleSection(option.id)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.label}>{option.lib}</Text>
                  <Entypo name="chevron-down" size={24} color="#23247E" />
                </View>
              </TouchableOpacity>
              <View style={styles.collaps}>
                <Collapsible collapsed={!activeSections.includes(option.id)}>
                  <Section
                    control={control}
                    errors={errors}
                    section={option}
                    setFormData={setFormData}
                    onSubmit={onSubmit}
                    sectionIndex={option.id}
                    defaultValues={activeChecklistDetails[option.id]}
                  />
                </Collapsible>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity onPress={onSubmit} style={styles.button}>
        <Text
          style={{
            color: "#ffffff",
            fontFamily: "poppins-Medium",
            fontSize: 16,
          }}
        >
          {" "}
          Modifier{" "}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  rectangle: {
    position: "absolute",
    backgroundColor: "#23247E",
    top: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    bottom: "98%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    zIndex: 2,
  },

  title: {
    fontFamily: "Inter-Bold",
    color: "#23247E",
    fontSize: 22,
    marginBottom: 8,
  },
  container: {
    flex: 1,
    padding: 18,
    paddingHorizontal: 23,
    backgroundColor: "#fff",
  },

  imagecontainer: {
    position: "relative",
  },

  sections: {
    width: "99%",
    height: 45,
    borderRadius: 7,
    padding: 8,
    backgroundColor: "#fff",
    marginTop: 6,
    elevation: 5,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    shadowColor: "#23247E",
    margin: 2,
    zIndex: 2,
    alignSelf: "center",
    justifyContent: "center",
  },

  label: {
    fontFamily: "poppins-Regular",
    color: "#23247E",
    marginBottom: 2,
    fontSize: 13,
    alignSelf: "flex-start",
  },

  holder: {
    borderWidth: 0.7,
    height: 36,
    width: "100%",
    borderRadius: 7,
    backgroundColor: "rgba(35, 36, 126, 0.02)",
    borderColor: "rgba(35, 36, 126, 0.3) ",
    justifyContent: "center",
    marginBottom: 2,
  },
  paragraph: {
    marginVertical: 8,
    lineHeight: 20,
  },

  dateinput: {
    borderWidth: 0.5,
    width: 104,
    height: 32,
    borderRadius: 7,
    backgroundColor: "rgba(35, 36, 126, 0.02)",
    borderColor: "rgba(35, 36, 126, 0.3) ",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    fontSize: 12,
    fontFamily: "poppins-Light",
  },
  timeinput: {
    borderWidth: 0.5,
    width: 75,
    height: 32,
    borderRadius: 7,
    backgroundColor: "rgba(35, 36, 126, 0.02)",
    borderColor: "rgba(35, 36, 126, 0.3) ",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 8,
    fontSize: 12,
    fontFamily: "poppins-Light",
  },
  button: {
    height: 40,
    width: "100%",
    backgroundColor: "#23247E",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  input: {
    padding: 10,
    fontSize: 12,
    fontFamily: "poppins-Light",
  },
  error: {
    color: "red",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#23247E",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  icon: {
    marginTop: 1,
    marginLeft: 10,
  },

  headerText: {
    flex: 1,
    textAlign: "center",
    fontFamily: "poppins-SemiBold",
    color: "#fff",
  },

  placeholderIcon: {
    width: 24,
    height: 24,
    marginRight: "auto",
  },

  searchInput: {
    height: 37,
    borderRadius: 5,
    borderColor: "white",
    borderWidth: 2,
    paddingHorizontal: 10,
    fontFamily: "poppins-Light",
    fontSize: 13,
    backgroundColor: "rgba(35, 36, 126, 0.03)",
  },
  dropdownelements: {
    elevation: 5,
    height: 150,
    alignSelf: "center",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    zIndex: 2,
  },
  dropdownContainer: {
    flex: 1,
    position: "relative",
    zIndex: 1,
  },
  listItem: {
    padding: 10,
    backgroundColor: "rgba(35, 36, 126, 0.07)",
    borderBottomColor: "#ffffff",
    borderBottomWidth: 2,
  },
  listItemText: {
    fontSize: 12,
    color: "rgba(35, 36, 126, 0.8)",
    fontFamily: "poppins-Light",
  },
  dropdownbutton: {
    width: 316,
    backgroundColor: "rgba(35, 36, 126, 0.7)",
    borderColor: "rgba(35, 36, 126, 0.51) ",
    height: 37,
    borderRadius: 7,
    justifyContent: "center",
    borderWidth: 0.5,
    paddingHorizontal: 10,
  },
  sectionsContainer: {
    backgroundColor: "#fff",
    height: "100%",
    width: "100%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dropdownModal: {
    width: "80%",
    height: 350,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    shadowColor: "#23247E",
  },
});
