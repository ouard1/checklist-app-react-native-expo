import React, { useState, useRef, useContext } from "react";
import { useForm } from "react-hook-form";
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ChecklistContext } from "../Context/ChecklistContext";
import Collapsible from "react-native-collapsible";
import { Entypo, Ionicons } from "@expo/vector-icons";
import Section from "./Section";
import SegmentedButtons from "../shared/segmentedButtons";

export default function ChecklistForm({
  sendFormData,
  checklistOptions,
  setModalOpen,
}) {
  const {
    control,
    formState: { errors },
  } = useForm();
  const [date, setDate] = useState(new Date());
  const [activeSections, setActiveSections] = useState([]);
  const [time, setTime] = useState(new Date());
  const [value, setValue] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { equipements, chauffeurs } = useContext(ChecklistContext);
  const [search, setSearch] = useState("");
  const [clickedChauffeur, setClickedChauffeur] = useState(false);
  const [equipementClicked, setEquipementClicked] = useState(false);
  const [data, setData] = useState(equipements);
  const [datac, setDatac] = useState(chauffeurs);
  const [selectedEquipement, setSelectedEquipement] = useState("");
  const [selectedChauffeur, setSelectedChauffeur] = useState("");
  const [typeError, setTypeError] = useState(false);
  const [selectedEquipementId, setSelectedEquipementId] = useState(null);
  const [chauffeurError, setChauffeurError] = useState(false);
  const [equipementsError, setEquipementsError] = useState(false);
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

  const toggleSection = (section) => {
    const isActive = activeSections.includes(section);
    setActiveSections((prevSections) =>
      isActive
        ? prevSections.filter((s) => s !== section)
        : [...prevSections, section]
    );
  };
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

  const onSubmit = () => {
    const updatedFormData = {
      date: date.toISOString().slice(0, 10),
      heure: time.toTimeString().slice(0, 8),
      vehicule_id: selectedEquipementId,
      chauffeur_id: selectedChauffeurId,
      type: value,
      checklistDetails: formData,
    };
    console.log(updatedFormData);
    if (selectedChauffeurId === null) {
      setChauffeurError(true);
      setEquipementsError(false); // Reset equipementsError if it was previously set
      setTypeError(false); // Reset typeError if it was previously set
    } else if (selectedEquipementId === null) {
      setEquipementsError(true);
      setChauffeurError(false); // Reset chauffeurError if it was previously set
      setTypeError(false); // Reset typeError if it was previously set
    } else if (value == "") {
      setTypeError(true);
      setChauffeurError(false); // Reset chauffeurError if it was previously set
      setEquipementsError(false); // Reset equipementsError if it was previously set
    } else {
      setChauffeurError(false);
      setEquipementsError(false);
      setTypeError(false);
      setFormData(updatedFormData);
      sendFormData(updatedFormData);
    }
  };

  console.log(formData);
  return (
    <View style={styles.container}>
      <View style={styles.rectangle}>
        <Ionicons
          name="chevron-back"
          color="#fff"
          style={{ marginTop: 1, marginLeft: 10 }}
          size={24}
          onPress={() => setModalOpen(false)}
        ></Ionicons>
        <Text
          style={{
            fontFamily: "poppins-SemiBold",
            color: "#fff",
            paddingHorizontal: "27%",
          }}
        >
          Ajouter checklist
        </Text>
      </View>

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
        {clickedChauffeur && (
          <View style={styles.dropdownelements}>
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
        )}

        {chauffeurError && (
          <Text style={styles.errorText}>
            Un chauffeur doit être sélectionné.
          </Text>
        )}

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
        {equipementClicked && (
          <View style={styles.dropdownelements}>
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
                  <Text style={styles.listItemText}>{item.matricule}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {equipementsError && (
          <Text style={styles.errorText}>
            Un véhicule doit être sélectionné.
          </Text>
        )}

        <Text style={styles.label}>Type :</Text>

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
        />
        {typeError && (
          <Text style={styles.errorText}>
            Veuillez choisir un type (sortie ou entrée)
          </Text>
        )}
      </View>
      <ScrollView>
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
          Ajouter{" "}
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
    fontFamily: "Poppins-Bold",
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
    height: 47,
    borderRadius: 7,
    padding: 8,
    backgroundColor: "#fff",
    marginTop: 6,
    elevation: 3,
    shadowOpacity: 0.3,
    shadowRadius: 7,
    shadowColor: "rgba(35, 36, 126, 0.3) ",

    margin: 2,
    zIndex: 2,
    alignSelf: "center",
    justifyContent: "center",
  },

  label: {
    fontFamily: "poppins-Regular",
    color: "#23247E",
    marginBottom: 5,
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
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
  searchInput: {
    height: 37,
    borderRadius: 5,
    borderColor:"white",
    borderWidth:2,
    paddingHorizontal: 10,
    fontFamily: "poppins-Light",
    fontSize:13,
    backgroundColor: "rgba(35, 36, 126, 0.03)",
  },
  dropdownelements: {
    elevation: 5,
    height: 150,
    alignSelf: "center",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 7,

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
    color:"rgba(35, 36, 126, 0.8)",
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
    flex: 1,
  },
});
