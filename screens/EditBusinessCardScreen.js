import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import {db,auth} from "../firebaseConfig";
import {collection,updateDoc,doc} from "firebase/firestore";


const EditBusinessCardScreen = ({ navigation,route }) => {
  const [formData, setFormData] = useState({
    name: route.params.name || '',
    company: route.params.company || '',
    role: route.params.role || '',
    email: route.params.email || '',
    mobile: route.params.mobile || '',
    officeAddress: route.params.officeAddress || '',
    companyWebsite: route.params.companyWebsite || '',
    whatsapp: route.params.whatsapp || '',
    profileURL: route.params.profileURL || '',
    linkedinURL: route.params.linkedinURL || '',
    twitterURL: route.params.twitterURL || '',
    facebookURL: route.params.facebookURL || '',
    instagramURL: route.params.instagramURL || '',
  });


  useEffect(() => {
    setFormData({
      name: route.params.name || '',
      company: route.params.company || '',
      role: route.params.role || '',
      email: route.params.email || '',
      mobile: route.params.mobile || '',
      officeAddress: route.params.officeAddress || '',
      companyWebsite: route.params.companyWebsite || '',
      whatsapp: route.params.whatsapp || '',
      profileURL: route.params.profileURL || '',
      linkedinURL: route.params.linkedinURL || '',
      twitterURL: route.params.twitterURL || '',
      facebookURL: route.params.facebookURL || '',
      instagramURL: route.params.instagramURL || '',
    });
  }, [route.params]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Edit Business Card',
      headerBackTitle: 'Back',
    });
  }, [navigation]);

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "email":
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(value);
      case "mobile":
      case "whatsapp":
        const phoneRegex = /^\+\d+\d+$/;
        return phoneRegex.test(value);
      case "linkedinURL":
        if (value.trim() === "") {
          return true; // Optional field, no validation required if empty
        } else {
          // LinkedIn URL pattern
          const linkedinRegex =
            /^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9-]{5,30}\/?$/;
          return linkedinRegex.test(value);
        }

      case "twitterURL":
        if (value.trim() === "") {
          return true; // Optional field, no validation required if empty
        } else {
          // Twitter URL pattern
          const twitterRegex =
            /^https?:\/\/twitter\.com\/(#!\/)?[a-zA-Z0-9_]{1,15}\/?$/;
          return twitterRegex.test(value);
        }

      case "facebookURL":
        if (value.trim() === "") {
          return true; // Optional field, no validation required if empty
        } else {
          // Facebook URL pattern
          const facebookRegex =
            /^(https?:\/\/)?(www\.)?facebook.com\/(profile.php\?id=\d+|.*?\/)?([a-zA-Z0-9.]{5,})\/?$/;
          return facebookRegex.test(value);
        }

      case "instagramURL":
        if (value.trim() === "") {
          return true; // Optional field, no validation required if empty
        } else {
          // Instagram URL pattern
          const instagramRegex =
            /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_]{1,30}\/?$/;
          return instagramRegex.test(value);
        }

      case "profileURL":
      case "companyWebsite":
        if (value.trim() === "") {
          return true; // Optional field, no validation required if empty
        } else {
          const urlRegex = /^https?:\/\/(www\.)?([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-z]{2,}(:[0-9]+)?(\/.*)?$/;
          return urlRegex.test(value);
        }
      default:
        return value.trim() !== ""; // Check for spaces-only
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const editCard = async () => {
    const requiredFields = [
      "name",
      "company",
      "role",
      "email",
      "mobile",
      "companyWebsite",
      "officeAddress",
    ];
    const allFields = [
      "name",
      "company",
      "role",
      "email",
      "mobile",
      "officeAddress",
      "companyWebsite",
      "whatsapp",
      "profileURL",
      "linkedinURL",
      "twitterURL",
      "facebookURL",
      "instagramURL",
    ];
  
    const errorMessages = {
      email: "Please enter a valid email address.",
      mobile: "Please enter a valid mobile number in the format +CountryCode Number.",
      whatsapp: "Please enter a valid WhatsApp number in the format +CountryCode Number.",
      companyWebsite: "Please enter a valid website starting with 'https://'.",
      profileURL: "Please enter a valid profile URL starting with 'https://'.",
      linkedinURL: "Please enter a valid LinkedIn profile URL starting with 'https://www.linkedin.com/in/'.",
      twitterURL: "Please enter a valid Twitter profile URL starting with 'https://twitter.com/'.",
      facebookURL: "Please enter a valid Facebook profile URL starting with 'https://www.facebook.com/'.",
      instagramURL: "Please enter a valid Instagram profile URL starting with 'https://www.instagram.com/'.",
    };
  
    // Checking for required fields
    for (const field of requiredFields) {
      if (formData[field] === "") {
        alert(`Please fill in the ${field} field.`);
        return;
      }
    }
  
    // Validating each field
    for (const field of allFields) {
      const fieldValue = formData[field];
      if (fieldValue !== "") {
        const isValid = validateField(field, fieldValue);
  
        if (!isValid) {
          if (field === "mobile" || field === "whatsapp" || field === "email") {
            alert(errorMessages[field]);
          } else if (
            field === "companyWebsite" ||
            field === "profileURL" ||
            field === "linkedinURL" ||
            field === "twitterURL" ||
            field === "facebookURL" ||
            field === "instagramURL"
          ) {
            alert(errorMessages[field]);
          } else {
            alert(
              `Please fill in the ${field} field and ensure it does not contain only spaces.`
            );
          }
          return;
        }
      }
    }
  
    const user = auth.currentUser;
    const userEmail = user.email;
  
    try {
      await updateDoc(
        doc(db, userEmail,"cards","businesscards",route.params.id),
        formData
      );
      navigation.goBack();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.heading}>Edit Business Card</Text>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#999"
              onChangeText={(text) => handleInputChange("name", text)}
              value={formData.name}
            />
            <TextInput
              style={styles.input}
              placeholder="Company Name"
              placeholderTextColor="#999"
              onChangeText={(text) => handleInputChange("company", text)}
              value={formData.company}
            />
            <TextInput
              style={styles.input}
              placeholder="Role/Designation"
              placeholderTextColor="#999"
              onChangeText={(text) => handleInputChange("role", text)}
              value={formData.role}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#999"
              onChangeText={(text) => handleInputChange("email", text)}
              keyboardType="email-address"
              value={formData.email}
            />
            <TextInput
              style={styles.input}
              placeholder="+CountryCode    MobileNumber"
              placeholderTextColor="#999"
              onChangeText={(text) => handleInputChange("mobile", text)}
              keyboardType="phone-pad"
              value={formData.mobile}
            />
            <TextInput
              style={styles.input}
              placeholder="Company Website"
              placeholderTextColor="#999"
              onChangeText={(text) => handleInputChange("companyWebsite", text)}
              keyboardType="url"
              value={formData.companyWebsite}
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Office Address"
              placeholderTextColor="#999"
              onChangeText={(text) => handleInputChange("officeAddress", text)}
              multiline
              value={formData.officeAddress}
            />
            <TextInput
              style={styles.input}
              placeholder="+CountryCode    WhatsAppNumber (optional)"
              placeholderTextColor="#999"
              onChangeText={(text) => handleInputChange("whatsapp", text)}
              keyboardType="phone-pad"
              value={formData.whatsapp}
            />
            <TextInput
              style={styles.input}
              placeholder="Profile URL (optional)"
              placeholderTextColor="#999"
              onChangeText={(text) => handleInputChange("profileURL", text)}
              keyboardType="url"
              value={formData.profileURL}
            />
            <TextInput
              style={styles.input}
              placeholder="LinkedIn Profile URL (optional)"
              placeholderTextColor="#999"
              onChangeText={(text) => handleInputChange("linkedinURL", text)}
              keyboardType="url"
              value={formData.linkedinURL}
            />
            <TextInput
              style={styles.input}
              placeholder="Twitter Profile URL (optional)"
              placeholderTextColor="#999"
              onChangeText={(text) => handleInputChange("twitterURL", text)}
              keyboardType="url"
              value={formData.twitterURL}
            />
             <TextInput
              style={styles.input}
              placeholder="Facebook Profile URL (optional)"
              placeholderTextColor="#999"
              onChangeText={(text) => handleInputChange("facebookURL", text)}
              keyboardType="url"
              value={formData.facebookURL}
            />
            <TextInput
              style={styles.input}
              placeholder="Instagram Profile URL (optional)"
              placeholderTextColor="#999"
              onChangeText={(text) => handleInputChange("instagramURL", text)}
              keyboardType="url"
              value={formData.instagramURL}
            />
            

            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.5}
              onPress={editCard}
            >
              <Text style={styles.buttonText}>Save Card</Text>
            </TouchableOpacity>
            <View style={styles.bottomSpace} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  heading: {
    fontSize: 24,
    marginBottom: 25,
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: '#fff',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#0096FF',
    paddingVertical: 8,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomSpace: {
    marginBottom: 100,
  },
});

export default EditBusinessCardScreen;