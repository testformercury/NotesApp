import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import {getNoteById, updateNote} from "../database/Db";

type RootStackParamList = {
  Details: { id: number };
};

type DetailsScreenRouteProp = RouteProp<RootStackParamList, "Details">;

export default function DetailsScreen() {
  const route = useRoute<DetailsScreenRouteProp>();
  const { id } = route.params;

  const [item, setItem] = useState<{ title: string; notes: string } | null>(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchSelectedNote = async () => {
      const result = await getNoteById(id) as { title: string; notes: string } | null;

      if (result) {
        setItem(result);
        setTitle(result.title);
        setNotes(result.notes);
      }

    };

    fetchSelectedNote();
  }, [id]);

  const handleUpdate = async () => {

    if (!title.trim() || !notes.trim()) {
      setErrorMessage("Please enter both Title and Notes."); 
      return;
    }

    await updateNote(id, title, notes);

    setErrorMessage("");
    setItem({ title, notes });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (item) {
      setTitle(item.title);
      setNotes(item.notes);
    }
    setErrorMessage("");
    setIsEditing(false);
  };

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isEditing ? (
        <>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} />
          <TextInput style={styles.input} value={notes} onChangeText={setNotes} multiline />
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          <View style={styles.buttonContainer}>
            <Button title="Save" onPress={handleUpdate} />
            <Button title="Cancel" onPress={handleCancel} color="red" />
          </View>
        </>
      ) : (
        <>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.notes}>{item.notes}</Text>
          <Button title="Update" onPress={() => setIsEditing(true)} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  notes: { fontSize: 16, color: "gray", marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
  }
});
