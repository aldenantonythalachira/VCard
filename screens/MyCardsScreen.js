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
import BusinessCardListItem from "../components/BusinessCardListItem";
import { Input, Icon,Button } from "@rneui/themed";
import { db, auth } from "../firebaseConfig";
import {
  getFirestore,
  collection,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";

const HomeScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    const email = user.email;
    const unsubscribe = onSnapshot(
      collection(db, `${email}/cards/businesscards`),
      (snapshot) => {
        setCards(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Filter cards based on search input
    const filtered = cards.filter(
      ({ data }) =>
        data.status === "valid" &&
        (data.name.toLowerCase().includes(search.toLowerCase()) ||
          data.role.toLowerCase().includes(search.toLowerCase()) ||
          data.company.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredCards(filtered);
  }, [search, cards]);




  useLayoutEffect(() => {
    navigation.setOptions({
      title: "My Cards",
      headerStyle: { backgroundColor: "black",},
      headerTintColor: "#fff", // Changed to headerTintColor
      headerTitleStyle: {
        fontWeight: "bold",
        marginLeft: Platform.OS === "ios" ? 0 : 50,
      },
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerIcons}
          onPress={() => {
            navigation.navigate("AddBusinessCard");
          }}
        >
          <Ionicons name="ios-add-circle" size={35} color="#0096FF" />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerIcons}
          onPress={() => {
            navigation.navigate("QRScanner"); // Navigate to the QR scanner screen
          }}
        >
          <FontAwesome name="qrcode" size={35} color="#0096FF" />
        </TouchableOpacity>
      ),
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
    status
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
      status
    });
  };

  const onDelete = async (id) => {
    const user = auth.currentUser;
    const email = user.email;
    const docRef = doc(db, `${email}/cards/businesscards/${id}`);
    await updateDoc(docRef, {
      status: "invalid",
    });
  };

  const onEdit = (
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
    status
  ) => {
    navigation.navigate("EditBusinessCard", {
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
      status
    });
  };

  const onUndo = async (id) => {
    const user = auth.currentUser;
    const email = user.email;
    const docRef = doc(db, `${email}/cards/businesscards/${id}`);
    await updateDoc(docRef, {
      status: "valid",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerText}>My Cards</Text>
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
        <TouchableOpacity
          style={styles.archivedContainer}
          onPress={() => navigation.navigate("ArchivedCards")}
        >
        <View style={styles.archivedIconContainer}>
    <Icon name="delete-outline" size={24} color="#0096FF" />
  </View>
          <Text style={styles.archivedText}>Archived Cards</Text>
        </TouchableOpacity>
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
              status
            },
          }) => (
              <BusinessCardListItem
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
                linkedinURL={linkedinURL}
                twitterURL={twitterURL}
                facebookURL={facebookURL}
                instagramURL={instagramURL}
                status={status}
                onDelete={onDelete}
                onEdit={onEdit}
                onUndo={onUndo}
                seeBusinessCard={seeBusinessCard}
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
  archivedContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black",
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderTopWidth: 0.2, // Adding top border
    borderBottomWidth: 0.2, // Adding bottom border
    borderTopColor: "#4c4c4c", // Color of the top border
    borderBottomColor: "#4c4c4c", // Color of the bottom border
    marginBottom:10,
    marginTop:10,
  },
  archivedIconContainer: {
    borderRadius: 15,
    padding: 1,
  },
  archivedText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
});

export default HomeScreen;
