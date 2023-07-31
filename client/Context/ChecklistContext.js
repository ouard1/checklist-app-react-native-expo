import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./authContext";

export const ChecklistContext = createContext();

export const ChecklistProvider = ({ children }) => {
  

  const [equipements, setEquipements] = useState(null);
  const [chauffeurs, setChauffeurs] = useState(null);
  const [etats, setEtats] = useState(null);
  const { usertoken } = useContext(AuthContext);

  useEffect(() => {
    const fetchChauffeurs = async () => {
      try {
       
          const response = await axios.get("http://192.168.43.56:3000/chauffeurs", {
            headers: {
              Authorization: `Bearer ${usertoken}`,
            },
          });

          const data = response.data;
          setChauffeurs(data);


          
        
      } catch (error) {
        console.error("Error fetching chauffeurs: ", error);
      }
    };
    const fetchEtats = async () => {
      try {
       
        const response = await axios.get("http://192.168.43.56:3000/etats", {
          headers: {
            Authorization: `Bearer ${usertoken}`,
          },
        });

        const data = response.data;

        setEtats(data);
        
      } catch (error) {
        console.error("Error fetching etats: ", error);
      }
    };

    const fetchEquipements = async () => {
      try {
      
        const response = await axios.get("http://192.168.43.56:3000/equipements", {
          headers: {
            Authorization: `Bearer ${usertoken}`,
          },
        });

        const data = response.data;
        setEquipements(data);
      } catch (error) {
        console.error("Error fetching equipments: ", error);
      }
    };

    if (usertoken) {
      fetchChauffeurs();
      fetchEquipements();
      fetchEtats();
    }
  }, [usertoken]);

  return (
    <ChecklistContext.Provider value={{ etats,equipements, chauffeurs}}>
      {children}
    </ChecklistContext.Provider>
  );
};
