import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import ContactListItem from "../components/ContactListItem";
import { db, auth } from "../firebaseConfig";
import { collection, onSnapshot, query, getDoc, doc } from "firebase/firestore";

const ContactsScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    const email = user.email;

    const q = query(collection(db, `${email}/contacts/details`));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const fetchedCards = [];

      for (const docSnapshot of querySnapshot.docs) {
        const { donorEmail, donorCardID } = docSnapshot.data();
        const cardRef = doc(db, `${donorEmail}/cards/businesscards/${donorCardID}`);
        
        try {
          const cardDoc = await getDoc(cardRef);
          if (cardDoc.exists()) {
            fetchedCards.push({ id: cardDoc.id, data: cardDoc.data() });
          }
        } catch (error) {
          console.error("Error fetching card:", error);
        }
      }

      setCards(fetchedCards);
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    // Filter cards based on search input
    const filtered = cards.filter(
      ({ data }) =>
        (data.name.toLowerCase().includes(search.toLowerCase()) ||
          data.role.toLowerCase().includes(search.toLowerCase()) ||
          data.company.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredCards(filtered);
  }, [search, cards]);


  useLayoutEffect(() => {
    navigation.setOptions({
      title: "My Contacts",
      headerStyle: { backgroundColor: "black" },
      headerTintColor: "#fff", // Changed to headerTintColor
      headerTitleStyle: {
        fontWeight: "bold",
        marginLeft: Platform.OS === "ios" ? 0 : 50,
      },
    });
  }, [navigation]);

  const seeBusinessCard = (
    id,
    name,
    role,
    company,
    email,
    companyWebsite,
    mobile,
    officeAddress,
    whatsapp,
   profileURL,
   linkedinURL,
   twitterURL,
   facebookURL,
   instagramURL,
   status,
  ) => {
    navigation.navigate("BusinessCard", {
      id,
      name,
      role,
      company,
      email,
      companyWebsite,
      mobile,
      officeAddress,
      whatsapp,
      profileURL,
      linkedinURL,
      twitterURL,
      facebookURL,
      instagramURL,
      status,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerText}>My Contacts</Text>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#0B0B45"
            value={search}
            onChangeText={(text) => setSearch(text)}
          />
        </View>
        {filteredCards.map(
          ({
            id,
            data: {
              name,
              role,
              company,
              email,
              companyWebsite,
              mobile,
              officeAddress,
              whatsapp,
              profileURL,
              linkedinURL,
              twitterURL,
              facebookURL,
              instagramURL,
              status,
            },
          }) => (
            <ContactListItem
              key={id}
              id={id}
              name={name}
              role={role}
              company={company}
              email={email}
              companyWebsite={companyWebsite}
              mobile={mobile}
              officeAddress={officeAddress}
              whatsapp={whatsapp}
              profileURL={profileURL}
              facebookURL={facebookURL}
              twitterURL={twitterURL}
              instagramURL={instagramURL}
              linkedinURL={linkedinURL}
              seeBusinessCard={seeBusinessCard}
              status={status}
            />
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 10,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
  headerText: { fontWeight: "bold", fontSize: 34, color: "#fff" },
  searchContainer: {
    height: 34,
    marginHorizontal: 16,
    marginVertical: 10,
    backgroundColor: "white",
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  searchInput: { flex: 1, paddingVertical: 8, color: "black", marginLeft: 8 },
});

export default ContactsScreen;