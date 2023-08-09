import React, { useState, useRef, useContext } from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert
} from "react-native";
import SegmentedButtons from "../shared/segmentedButtons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ChecklistContext } from "../Context/ChecklistContext";
import { Ionicons } from "@expo/vector-icons";

export default function FilterForm({
  onSubmit,
  setAppliedFilters,
  setModalVisible,
}) {
  const [dateDebut, setDateDebut] = useState(null);
  const [dateFin, setDateFin] = useState(null);
  const [value, setValue] = useState("");
  const [showDateDebutPicker, setShowDateDebutPicker] = useState(false);
  const [showDateFinPicker, setShowDateFinPicker] = useState(false);
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
  const toggleDateDebutPicker = () => {
    setShowDateDebutPicker(!showDateDebutPicker);
  };

  const toggleDateFinPicker = () => {
    setShowDateFinPicker(!showDateFinPicker);
  };

  const onChangeDateDebut = (event, selectedDate) => {
    if (selectedDate) {
      console.log(selectedDate.toISOString());
      const currentDate = selectedDate;
      setDateDebut(currentDate);
    }
    toggleDateDebutPicker();
  };

  const onChangeDateFin = (event, selectedDate) => {
    if (selectedDate) {
      console.log(selectedDate.toISOString());
      const currentDate = selectedDate;
      setDateFin(currentDate);
    }
    toggleDateFinPicker();
  };

  const handleFilterSubmit = () => {
    
    const filterValues = {
      equipement_id: selectedEquipementId,
      chauffeur_id: selectedChauffeurId,
      dateDebut: dateDebut ? dateDebut.toISOString().slice(0, 10) : "",
      dateFin: dateFin ? dateFin.toISOString().slice(0, 10) : "",
      type: value,
    };
    if (
     
      new Date(filterValues.dateDebut) >= new Date(filterValues.dateFin)  
    ) {
      Alert.alert(
        "Plage de dates invalide",
        "Veuillez sélectionner une plage de dates valide. Assurez-vous de ne pas choisir une date de début supérieure à la date de fin et veillez à ce qu'elles ne soient pas identiques."
      );
      
      return;
    }
    const filters = [];

    if (filterValues.equipement_id) {
      const equipementFilter = `Equipement: ${filterValues.equipement_id}`;
      filters.push(equipementFilter);
    }

    if (filterValues.chauffeur_id) {
      const chauffeurFilter = `Chauffeur: ${filterValues.chauffeur_id}`;
      filters.push(chauffeurFilter);
    }

    if (filterValues.dateDebut) {
      filters.push(filterValues.dateDebut);
    }

    if (filterValues.dateFin) {
      filters.push(filterValues.dateFin);
    }

    if (filterValues.type) {
      filters.push(filterValues.type);
    }

    setAppliedFilters(filters);

    onSubmit(filterValues);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyItems: "center" }}>
        <Ionicons
          name="chevron-back-outline"
          size={24}
          color="#23247E"
          style={{ marginTop: 4 }}
          onPress={() => setModalVisible(false)}
        />
        <Text style={styles.title}>Filtrer par</Text>
      </View>
      <View style={styles.formWrapper}>
       

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
               initialNumToRender={50} 
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
       

        <Text style={styles.label}>Véhicule :</Text>

          <TouchableOpacity
            style={styles.holder}
            onPress={() => {
              setEquipementClicked(!equipementClicked);
            }}
          >
            <Text   style={{
                padding: 10,
                fontSize: 12,
                color: "rgba(35, 36, 126, 0.8)",
                fontFamily: "poppins-Light",
              }}>
              {selectedEquipement == ""
                ? "Selectionner une matricule "
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
               initialNumToRender={50} 
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
      
        <Text style={styles.label}>Date début:</Text>
        <View style={styles.holder}>
          {showDateDebutPicker && (
            <DateTimePicker
              mode="date"
              display="spinner"
              value={dateDebut || new Date()}
              onChange={onChangeDateDebut}
            />
          )}
          {!showDateDebutPicker && (
            <Pressable onPress={toggleDateDebutPicker}>
              <TextInput
                style={styles.dateinput}
                editable={false}
                placeholderTextColor={"rgba(35, 36, 126, 0.8)"}
                placeholder={
                  !dateDebut
                    ? "veuillez rentrer la date début"
                    : dateDebut.toISOString().slice(0, 10)
                }
              />
            </Pressable>
          )}
        </View>
        <Text style={styles.label}>Date fin:</Text>
        <View style={styles.holder}>
          {showDateFinPicker && (
            <DateTimePicker
              mode="date"
              display="spinner"
              value={dateFin || new Date()}
              onChange={onChangeDateFin}
            />
          )}
          {!showDateFinPicker && (
            <Pressable onPress={toggleDateFinPicker}>
              <TextInput
                style={styles.dateinput}
                placeholderTextColor={"rgba(35, 36, 126, 0.8)"}
                editable={false}
                placeholder={
                  !dateFin
                    ? "veuillez rentrer la date finale"
                    : dateFin.toISOString().slice(0, 10)
                }
              />
            </Pressable>
          )}
        </View>
        <Text style={styles.label}>Type</Text>
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
      </View>

      <TouchableOpacity onPress={handleFilterSubmit} style={styles.button}>
        <Text
          style={{
            color: "#ffffff",
            fontFamily: "poppins-Regular",
            fontSize: 16,
          }}
        >
          {" "}
          Filtrer{" "}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "poppins-Medium",
    color: "#23247E",
    fontSize: 18,
    marginBottom: 8,
    marginLeft: "30%",
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
  container: {
    padding: 28,
    position: "absolute",
    top: "10%",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ffffff",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  formWrapper: {
    backgroundColor: "#ffffff",
    alignItems: "center",
    flex: 1,
    marginVertical: 30,
  },

  label: {
    alignSelf: "flex-start",
    fontFamily: "poppins-Medium",
    color: "#23247E",
    marginBottom: 5,
  },

  input: {
    padding: 10,
    fontSize: 13,
    color: "rgba(35, 36, 126, 0.8)",
    fontFamily: "poppins-Light",
  },
  holder: {
    borderWidth: 1,
    width: "100%",
    backgroundColor: "rgba(35, 36, 126, 0.02)",
    borderColor: "rgba(35, 36, 126, 0.3) ",
    height: 37,
    borderRadius: 7,
zIndex:1,
    justifyContent: "center",
    marginBottom: 4,
   
  },
  dateinput: {
    paddingHorizontal: 10,
    color: "rgba(35, 36, 126, 0.8)",
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

  error: {
    color: "red",
  },
  
  dropdownelements: {
    elevation: 5,
    height: 130,
    alignSelf: "center",
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 10,

    zIndex: 3,
  },
  dropdownContainer: {
    flex: 1,
    position: "relative",
    zIndex: 3,
    width: "100%",
  },
  listItem: {
    padding: 10,
    backgroundColor: "#ffffff",
    borderBottomColor: "rgba(35, 36, 126, 0.07)",
    borderBottomWidth: 2,
  },
  listItemText: {
    fontSize: 13,
    fontFamily: "poppins-Light",
    color: "#23247E",
  },
  dropdownbutton: {
    width: "100%",
    backgroundColor: "rgba(35, 36, 126, 0.7)",
    borderColor: "rgba(35, 36, 126, 0.51) ",
    height: 39,
    borderRadius: 7,
    justifyContent: "center",
    borderWidth: 0.5,
    paddingHorizontal: 10,
  },
});
