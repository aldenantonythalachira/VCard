import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from "react-native";
import { ListItem, Button } from "@rneui/themed"; // Assuming you're using the 'react-native-elements' library
import { getFirestore } from "firebase/firestore";

const { width } = Dimensions.get("window");

const ContactListItem = ({
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
  seeBusinessCard,
}) => {
  const avatarSize = width * 0.15;

  const titleColor = status === "invalid" ? "red" : "white";
  const subtitleColor = status === "invalid" ? "red" : "#666";
  const subtitleText =
    status === "invalid"
      ? `Invalid - ${role}@${company}`
      : `${role}@${company}`;

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={styles.touchableContainer}
      onPress={() =>
        seeBusinessCard(
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
        )
      }
      key={id}
    >
      <View
        style={[
          styles.avatarContainer,
          { width: avatarSize, height: avatarSize },
        ]}
      >
        <Image
          source={{
            uri: "https://cdn4.vectorstock.com/i/1000x1000/94/23/businessman-avatar-cartoon-vector-17729423.jpg",
          }}
          style={styles.avatar}
        />
      </View>
      <ListItem.Content style={styles.content}>
        <ListItem.Title style={[styles.title, { color: titleColor }]}>
          {name}
        </ListItem.Title>
        <ListItem.Subtitle
          style={[
            styles.subtitle,
            {
              color: subtitleColor,
              fontWeight: status === "invalid" ? "bold" : "normal",
            },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {subtitleText}
        </ListItem.Subtitle>
      </ListItem.Content>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  swipeableContainer: {
    borderBottomColor: "#22222",
    borderBottomWidth: 0.3,
    padding: 1,
    backgroundColor: "black",
  },
  touchableContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#4c4c4c",
    borderBottomWidth: 0.2,
  },
  deleteButtonContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#D22B2B",
  },
  undoButtonContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#0096ff",
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    color: "white",
    fontWeight: "500",
    fontFamily: "System",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    marginTop: 4,
    fontFamily: "System",
  },
});

export default ContactListItem;
