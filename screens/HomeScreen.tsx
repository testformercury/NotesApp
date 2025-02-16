import React, { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
  Modal
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {initializeDatabase, getAllNotes, deleteNote} from "../database/Db";
import {syncDataWithServer} from "../database/Sync";
import { useCallback } from "react";

type RootStackParamList = {
  Home: undefined;
  AddItem: undefined;
  Details: { id: number };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    initializeDatabase();
  }, []);
  
  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [])
  );

  const fetchNotes = async () => {
    const result = await getAllNotes();
    syncDataWithServer();
    setItems(result);
  };

  const navigateDetails = (id: number) => {
    navigation.navigate("Details", { id });
    setModalVisible(false);
  };

  const deleteSelectedItem = async (id: number) => {
    await deleteNote(id);
    fetchNotes();
    setModalVisible(false); 
  };

  const openModal = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No Notes found. Press + to add.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            <View style={styles.item}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.notes}>{item.notes}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddItem")}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose an action</Text>

            <View style={styles.buttonContainer}>
              <Button title="Details" onPress={() => navigateDetails(selectedItem?.id)}/>
            </View>

            <View style={styles.buttonContainer}>
              <Button title="Delete" color="red" onPress={() => deleteSelectedItem(selectedItem?.id)} />
            </View>

            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  item: { padding: 10, borderBottomWidth: 1 },
  title: { fontSize: 18, fontWeight: "bold" },
  notes: { fontSize: 14, color: "gray" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "blue",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  fabText: { fontSize: 30, color: "white" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  buttonContainer: {width: "100%", marginBottom: 10},
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  }
});
