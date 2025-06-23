import React, { useState, useEffect } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Text,ScrollView,Platform,Alert } from "react-native";
import { Input, Button } from "@rneui/themed";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile,sendEmailVerification,onAuthStateChanged, } from "firebase/auth";

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Back to Login",
    });
  }, [navigation]);

  const validateInputs = () => {
    let isValid = true;
    const newErrors = {};

    if (!fullName) {
      newErrors.fullName = "Full name is required!";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = "Invalid email address!";
      isValid = false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password || !passwordRegex.test(password)) {
      newErrors.password =
        "Password should contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const signUp = () => {
    if (!validateInputs()) return;
  
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
  
      // Update user profile
      updateProfile(user, {
        displayName: fullName,
      })
        .then(() => {
          // Send email verification
          sendEmailVerification(user)
            .then(() => {
              Alert.alert(
                'Email Verification Sent',
                'An email verification has been sent. Please check your email and verify your email and login again.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Navigate back to login screen after alert confirmation
                      navigation.goBack();
                    },
                  },
                ]
              );
            })
            .catch((error) =>
              setErrors((prevErrors) => ({
                ...prevErrors,
                signUp: error.message,
              }))
            );
        })
        .catch((error) =>
          setErrors((prevErrors) => ({
            ...prevErrors,
            signUp: error.message,
          }))
        );
    })
    .catch((error) =>
      setErrors((prevErrors) => ({
        ...prevErrors,
        signUp: error.message,
      }))
    );  
  };

  return (
    
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
      <Text h3 style={[styles.title, { fontSize: 24 }]}>
        Create an Account
      </Text>
      <Input
        placeholder="Full Name"
       autoFocus
        inputStyle={styles.input}
        containerStyle={styles.inputContainer}
        value={fullName}
        onChangeText={(text) => setFullName(text)}
        errorMessage={errors.fullName}
      />
      <Input
        placeholder="Email"
        keyboardType="email-address"
        inputStyle={styles.input}
        containerStyle={styles.inputContainer}
        value={email}
        onChangeText={(text) => setEmail(text)}
        errorMessage={errors.email}
      />
      <Input
          placeholder="Password"
          secureTextEntry={!showPassword}
          inputStyle={styles.input}
          containerStyle={styles.inputContainer}
          value={password}
          onChangeText={(text) => setPassword(text)}
          errorMessage={errors.password}
          rightIcon={{
            type: "ionicon",
            name: showPassword ? "eye-outline" : "eye-off-outline",
            color: "#0096FF",
            onPress: () => setShowPassword(!showPassword),
          }}
        />
      
      {errors.signUp && <Text style={styles.errorText}>{errors.signUp}</Text>}

      <Button
        title="Sign Up"
        buttonStyle={styles.button}
        containerStyle={styles.buttonContainer}
        onPress={signUp}
      />

      <View style={styles.haveAccountContainer}>
        <Text style={styles.haveAccountText}>Already have an account?</Text>
        <Button
          title="Login"
          buttonStyle={[styles.button, styles.loginButton]}
          titleStyle={styles.loginButtonText}
          containerStyle={styles.buttonContainer}
          onPress={() => navigation.navigate("Login")}
        />
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
    
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "black",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor:'black',
  },
  title: {
    color: "#fff",
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  input: {
    color: "#fff",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#0096FF",
    borderRadius: 25,
  },
  haveAccountContainer: {
    marginTop: 25,
    alignItems: 'center',
  },
  haveAccountText: {
    color: "#fff",
  },
  loginButton: {
    backgroundColor: "#fff",
    borderColor: "#0096FF",
  },
  loginButtonText: {
    width: "100%",
    color: "#0096FF",
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default RegisterScreen;
