import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {db,auth} from "../firebaseConfig";
import {collection,addDoc,getDocs} from "firebase/firestore";
import { CommonActions } from '@react-navigation/native';

export default function QRScannerScreen({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
     const marker = 'thalachira';
  if (data.startsWith(marker)) {
    const extractedData = data.substring(marker.length+1); // Extract the actual data
    setScanned(true);
    setScannedData(extractedData);
    // Proceed with further action as this is a valid QR code
    showAddToContactsAlert(extractedData);
  } else {
    // Alert that the scanned QR code doesn't match your criteria
    Alert.alert('Invalid QR code', 'This QR code is not supported.');
    navigation.goBack();
  }
  };


 const createContact = async (donorEmail, donorCardID) => {
  const receiver = auth.currentUser;
  const receiverEmail = receiver.email;

  // Check if the card already exists in user's contacts
  const contactsRef = collection(db, `${receiverEmail}/contacts/details`);
  const querySnapshot = await getDocs(contactsRef);

  let cardExists = false;
  querySnapshot.forEach((doc) => {
    const contact = doc.data();
    if (contact.donorCardID === donorCardID) {
      cardExists = true;
      return;
    }
  });

  if (cardExists) {
    // Alert that the card already exists in contacts
    Alert.alert('Card already exists', 'This card is already in your contacts.');
     navigation.goBack()
  } else {
    // Add the card to contacts
    await addDoc(contactsRef, {
      donorCardID: donorCardID,
      donorEmail: donorEmail,
    })
      .then(() =>  navigation.dispatch(CommonActions.navigate('Main', {
        screen: 'Contacts',
      })))
      .catch((error) => alert(error));
  }
};

  const showAddToContactsAlert = (data) => {   const dataArray = data.split(',');
    Alert.alert(
      ` Do you want to add ${dataArray[2]} to your contacts?`,
      '',
      [
        {
          text: 'Cancel',
          onPress: () => navigation.goBack(),
          style: 'cancel',
        },
        {
          text: 'Add',
          onPress: () => createContact(dataArray[0],dataArray[1]),
        },
      ],
      { cancelable: false }
    );
  };
  

  return (
    <View style={styles.container}>
      {hasPermission === null ? (
        <Text>Requesting for camera permission</Text>
      ) : hasPermission === false ? (
        <Text>Camera permission is not granted</Text>
      ) : (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
});
