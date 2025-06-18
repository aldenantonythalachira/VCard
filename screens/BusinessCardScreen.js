import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import QRCode from "react-qr-code";
import { db, auth } from "../firebaseConfig";
import * as Linking from "expo-linking";
const { width, height } = Dimensions.get("window");
import * as Contacts from "expo-contacts";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

const BusinessCardScreen = ({ navigation, route }) => {
  const donor = auth.currentUser;
  const donorEmail = donor.email;
  const marker = "thalachira";
  const cardInfo = `${marker},${donorEmail},${route.params.id},${route.params.name},${route.params.status},${route.params.role},${route.params.profileURL},${route.params.twitterURL},${route.params.instagramURL},${route.params.facebookURL},${route.params.linkedinURL},${route.params.mobile},${route.params.whatsapp},${route.params.email},${route.params.company},${route.params.officeAddress},${route.params.companyWebsite},${route.params.status}`;
  return (
    <View style={styles.container}>
      <View style={styles.rotatedContainer}>
        <View style={styles.card}>
          {/* Top Left */}
          <View style={styles.topLeft}>
            <Text style={styles.name}>{route.params.name}</Text>
            <Text style={styles.role}>{route.params.role}</Text>
            {route.params.profileURL && (
            <TouchableOpacity
              onPress={() => Linking.openURL(route.params.profileURL)}
            >
              <Text numberOfLines={1} style={styles.link}>
                View Profile
              </Text>
            </TouchableOpacity>)}
          </View>

          {/* Top Right */}
          <View style={styles.topRight}>
            <Text style={styles.mobile}>{route.params.mobile}</Text>
            <Text numberOfLines={1} style={styles.email}>
              {route.params.email}
            </Text>
          </View>

          {/* Bottom Left */}
          <View style={styles.bottomLeft}>
            <Text style={styles.company}>{route.params.company}</Text>
            <Text numberOfLines={2} style={styles.address}>
              {route.params.officeAddress}
            </Text>

            <TouchableOpacity
              onPress={() => Linking.openURL(route.params.companyWebsite)}
            >
              <Text numberOfLines={1} style={styles.link}>
                {route.params.companyWebsite}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Right */}
          <View style={styles.qrCodeContainer}>
            <QRCode bgColor="#0096ff" value={cardInfo} size={width * 0.5} />
          </View>
          <View style={styles.middle}>
            <View style={styles.iconRow}>
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${route.params.mobile}`)}
              >
                <FontAwesome
                  name="phone"
                  size={23}
                  color="black"
                  style={styles.icon}
                />
              </TouchableOpacity>

              {route.params.whatsapp || route.params.mobile ? (
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      `whatsapp://send?phone=${
                        route.params.whatsapp || route.params.mobile
                      }`
                    )
                  }
                >
                  <FontAwesome
                    name="whatsapp"
                    size={23}
                    color="black"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                onPress={() => Linking.openURL(`mailto:${route.params.email}`)}
              >
                <FontAwesome
                  name="envelope"
                  size={23}
                  color="black"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
            {/* Second Row: LinkedIn, Twitter */}
            <View style={styles.iconRow}>
              {route.params.linkedinURL && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(route.params.linkedinURL)}
                >
                  <FontAwesome
                    name="linkedin"
                    size={23}
                    color="black"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              )}

              {route.params.twitterURL && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(route.params.twitterURL)}
                >
                  <FontAwesome
                    name="twitter"
                    size={23}
                    color="black"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Third Row: Instagram, Facebook */}
            <View style={styles.iconRow}>
              {route.params.instagramURL && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(route.params.instagramURL)}
                >
                  <FontAwesome
                    name="instagram"
                    size={23}
                    color="black"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              )}

              {route.params.facebookURL && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(route.params.facebookURL)}
                >
                  <FontAwesome
                    name="facebook"
                    size={23}
                    color="black"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BusinessCardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  rotatedContainer: {
    width: height,
    height: width,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "90deg" }],
  },
  card: {
    backgroundColor: "#0096ff",
    padding: width * 0.08,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    width: height - width * 0.3,
    height: width - width * 0.12,
    alignItems: "center",
    justifyContent: "center",
  },
  topLeft: {
    position: "absolute",
    top: 20,
    left: 20,
    alignItems: "flex-start",
  },
  topRight: {
    position: "absolute",
    top: 20,
    right: 20,
    alignItems: "flex-end",
  },
  bottomLeft: {
    position: "absolute",
    bottom: 20,
    left: 20,
    alignItems: "flex-start",
  },
  bottomRight: {
    position: "absolute",
    bottom: 20,
    right: 20,
    alignItems: "flex-end",
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
  },
  role: {
    fontSize: 15,
  },
  company: {
    fontWeight: "bold",
    fontSize: 18,
  },
  contact: {
    fontSize: 18,
  },
  address: {
    fontSize: 15,
  },
  link: {
    color: "black",
    textDecorationLine: "underline",
  },
  qrCodeContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    alignItems: "flex-end",
  },
  middle: {
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
    bottom: 50,
    left: "50%",
    transform: [{ translateX: -100 }],
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  icon: {
    marginHorizontal: 15,
  },
});      