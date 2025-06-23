import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,Platform
} from "react-native";
import { Input, Button, Text } from "@rneui/themed";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import * as LocalAuthentication from "expo-local-authentication";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setIsLoggedIn(true);
        setIsEmailVerified(authUser.emailVerified);
      } else {
        setIsLoggedIn(false);
        setIsEmailVerified(false);
      }
    });
    return () => unsubscribe();
  }, []);


  const validateInputs = () => {
    let isValid = true;
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required!";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required!";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };


  const handleLocalAuth = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (compatible) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to access your account",
      });
      if (result.success) {
        navigation.replace("Main");
      }
    }
  };

  const signIn = () => {
    if (!validateInputs()) return;

    setErrors({}); // Clear previous errors

    signInWithEmailAndPassword(auth, email, password)
      .then((authUserCredential) => {
        const user = authUserCredential.user;
        if (user && user.emailVerified) {
          navigation.replace("Main");
        } else {
          alert("Please verify your email before signing in.");
        }
      })
      .catch((error) => alert(error.message.substring(9)));
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
        <Text h3 style={styles.title}>
          Welcome To vCard
        </Text>
        <Input
          placeholder="Email"
          type="email"
          keyboardType="email-address"
          inputStyle={styles.input}
          containerStyle={styles.inputContainer}
          onChangeText={(text) => setEmail(text)}
          value={email}
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

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={{ textAlign: "right", color: "#0096ff" }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
        <Button
          title="Login"
          buttonStyle={styles.button}
          containerStyle={styles.buttonContainer}
          onPress={signIn}
        />

{isLoggedIn && isEmailVerified && (
  <Button
    title="Biometric Authentication"
    buttonStyle={[styles.button, styles.localAuthButton]}
    titleStyle={styles.localAuthButtonText}
    containerStyle={styles.buttonContainer}
    onPress={handleLocalAuth}
    icon={
      <MaterialCommunityIcons
        color="black"
        name="face-recognition"
        size={22}
        style={{ marginRight: 12 }}
      />
    }
  />
)}
        <View style={styles.dontHaveAccountContainer}>
          <Text style={styles.dontHaveAccountText}>Don't have an account?</Text>
        </View>
        <Button
          title="Register"
          buttonStyle={[styles.button, styles.registerButton]}
          titleStyle={styles.registerButtonText}
          containerStyle={styles.buttonContainer}
          onPress={() => navigation.navigate("Register")}
        />
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
    backgroundColor: "black",
    paddingHorizontal: 20,
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
  dontHaveAccountContainer: {
    marginTop: 25,
  },
  dontHaveAccountText: {
    color: "#fff",
  },
  registerButton: {
    backgroundColor: "#fff",
    borderColor: "#0096FF",
  },
  registerButtonText: {
    color: "#0096FF",
  },
  localAuthButton: {
    backgroundColor: "white",
    marginTop: 10,
  },
  localAuthButtonText: {
    color: "black",
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default LoginScreen;
