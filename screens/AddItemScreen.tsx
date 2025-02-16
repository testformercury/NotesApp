import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {insertNote} from "../database/Db";

export default function AddItemScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const addNote = async () => {
    if (!title.trim() || !notes.trim()) {
      setErrorMessage("Please enter both Title and Notes."); 
      return;
    }
    
    await insertNote(title,notes);

    setErrorMessage("");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Enter Notes"
        value={notes}
        onChangeText={setNotes}
        multiline
      />
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <Button title="Add Item" onPress={addNote} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
  }
});
