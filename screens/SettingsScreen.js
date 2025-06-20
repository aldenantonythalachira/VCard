import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import FeatherIcon from "react-native-vector-icons/Feather";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { collection, addDoc } from "firebase/firestore";
import { getLocales, getCalendars } from "expo-localization";

const SettingsScreen = ({ navigation }) => {
  const locales = getLocales();
  const regionCode = locales[0].regionCode;

  const [modalVisible, setModalVisible] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Settings",
      headerStyle: { backgroundColor: "black" },
      headerTintColor: "#fff", // Changed to headerTintColor
      headerTitleStyle: {
        fontWeight: "bold",
        marginLeft: Platform.OS === "ios" ? 0 : 50,
      },
    });
  }, [navigation]);

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      // If userInput is empty or contains only whitespace
      Alert.alert("Empty Message", "Please type a message before submitting.");
      return;
    }


    const user = auth.currentUser;
    const email = user.email;

    await addDoc(collection(db, `${email}`), {
      feedback: userInput,
    })
      .then(() => {
        setSubmitted(true);
        setUserInput("");
        setTimeout(() => {
          setModalVisible(false);
          setSubmitted(false);
        }, 4000); // Reset the submission message after 2 seconds
      })
      .catch((error) => alert(error));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>

          <Text style={styles.subtitle}>Welcome To vCard !</Text>
        </View>

        <View style={styles.profile}>
          <FeatherIcon
            name="user"
            size={63}
            color="#0096ff"
            style={styles.profileAvatar}
          />

          <Text style={styles.profileName}>
            Hello {auth.currentUser.displayName}
          </Text>

          <Text style={styles.profileEmail}>{auth.currentUser.email}</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>Preferences</Text>
          </View>
          <View style={styles.sectionBody}>
            <View style={styles.rowWrapper}>
              <TouchableOpacity
                onPress={() => {
                  // Action for country selection
                }}
              >
                <View style={styles.row}>
                  <FeatherIcon
                    color="#616161"
                    name="globe"
                    style={styles.rowIcon}
                    size={22}
                  />
                  <Text style={styles.rowLabel}>Country</Text>
                  <View style={styles.rowSpacer} />
                  <Text style={styles.rowValue}>{regionCode}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Help Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>Help</Text>
          </View>
          <View style={styles.sectionBody}>
            <View style={styles.rowWrapper}>
              <TouchableOpacity
                onPress={() => {
                  // Set the modal visibility to true when Contact Us is pressed
                  setModalVisible(true);
                }}
              >
                <View style={styles.row}>
                  <FeatherIcon
                    color="#616161"
                    name="mail"
                    style={styles.rowIcon}
                    size={22}
                  />
                  <Text style={styles.rowLabel}>Contact Us</Text>
                  <View style={styles.rowSpacer} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            // Handle closing the modal, if needed
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Contact Us</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setUserInput(text)}
                value={userInput}
                placeholder="Type your message here"
                placeholderTextColor="#4c4c4c"
                multiline={true}
                numberOfLines={4}
              />
              {submitted ? (
                <Text style={styles.submittedText}>
                  Submitted. We'll look into it. Thank you!
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={styles.submitButton}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => {
                  setUserInput("");
                  setSubmitted(false);
                  setModalVisible(false);
                }}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Actions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>Actions</Text>
          </View>
          <View style={styles.sectionBody}>
            <View style={styles.rowWrapper}>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Sign Out",
                    "Are you sure you want to sign out?",
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "OK",
                        onPress: () => {
                          signOut(auth)
                            .then(() => {
                              navigation.replace("Login");
                            })
                            .catch((error) => {
                              Alert.alert(
                                "Sign-out Error",
                                "There was an error signing out: " +
                                  error.message
                              );
                            });
                        },
                      },
                    ],
                    { cancelable: false }
                  );
                }}
              >
                <View style={styles.row}>
                  <FeatherIcon
                    color="#616161"
                    name="server"
                    style={styles.rowIcon}
                    size={22}
                  />
                  <Text style={styles.rowLabel}>Sign Out</Text>
                  <View style={styles.rowSpacer} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  section: {
    paddingTop: 12,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  sectionBody: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#4c4c4c",
  },
  header: {
    paddingLeft: 24,
    paddingRight: 24,
    marginBottom: 12,
    marginTop: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#929292",
  },
  profile: {
    padding: 16,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "black",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#4c4c4c",
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 9999,
  },
  profileName: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  profileEmail: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "400",
    color: "#848484",
  },
  profileAction: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0096ff",
    borderRadius: 12,
  },
  profileActionText: {
    marginRight: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingRight: 24,
    height: 50,
    backgroundColor: "black",
  },
  rowWrapper: {
    paddingLeft: 24,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#4c4c4c",
    backgroundColor: "black",
  },
  rowIcon: {
    marginRight: 12,
    color: "#0096ff", // Change the icon color to blue
    textShadowColor: "#000", // Shadow color for better visibility
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: "500",
    color: "white",
  },
  rowValue: {
    fontSize: 17,
    color: "#616161",
    marginRight: 4,
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
  },
  modalContent: {
    backgroundColor: "black",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    borderWidth: 2,
    borderColor: "#0096ff", // Blue border color
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "#0096ff", // Blue border color
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    height: 100,
    color: "white", // Text color
  },
  submitButton: {
    backgroundColor: "#0096ff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  submittedText: {
    fontSize: 16,
    color: "#0096ff",
    textAlign: "center",
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#0096ff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
