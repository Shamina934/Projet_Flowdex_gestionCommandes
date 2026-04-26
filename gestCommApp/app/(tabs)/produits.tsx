import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const API =
  Platform.OS === "web"
    ? "http://localhost:3000/api/products"
    : "http://192.168.1.21:3000/api/products";

type Product = { id: number; name: string; price: string; description: string };

export default function ProduitsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDesc] = useState("");

  useEffect(() => {
    charger();
  }, []);

  const charger = () => {
    fetch(API)
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => Alert.alert("Erreur", "Serveur inaccessible"));
  };

  const ajouter = () => {
    if (!name || !price) {
      Alert.alert("Erreur", "Nom et prix obligatoires");
      return;
    }
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: parseFloat(price), description }),
    })
      .then(() => {
        setName("");
        setPrice("");
        setDesc("");
        setModal(false);
        charger();
        Alert.alert("Succès", "Produit ajouté !");
      })
      .catch(() => Alert.alert("Erreur", "Ajout impossible"));
  };

  const supprimer = (id: number) => {
    Alert.alert("Confirmer", "Supprimer ce produit ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => {
          fetch(`${API}/${id}`, { method: "DELETE" })
            .then(charger)
            .catch(() => Alert.alert("Erreur", "Suppression impossible"));
        },
      },
    ]);
  };

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.titre}>Produits</Text>
        <TouchableOpacity style={s.btnAjouter} onPress={() => setModal(true)}>
          <Text style={s.btnAjouterTxt}>+ Ajouter</Text>
        </TouchableOpacity>
      </View>

      {/* Liste */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={{ flex: 1 }}>
              <Text style={s.nom}>{item.name}</Text>
              <Text style={s.prix}>{item.price} €</Text>
              {item.description ? (
                <Text style={s.det}>{item.description}</Text>
              ) : null}
            </View>
            <TouchableOpacity onPress={() => supprimer(item.id)}>
              <Text style={s.del}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={<Text style={s.det}>Aucun produit</Text>}
      />

      {/* Modal ajout */}
      <Modal
        visible={modal}
        animationType="slide"
        transparent
        onRequestClose={() => setModal(false)}
      >
        <TouchableOpacity
          style={s.overlay}
          activeOpacity={1}
          onPress={() => setModal(false)}
        >
          <TouchableOpacity activeOpacity={1} style={s.sheet}>
            <View style={s.handle} />
            <Text style={s.sheetTitre}>Nouveau produit</Text>
            <TextInput
              style={s.input}
              placeholder="Nom *"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={s.input}
              placeholder="Prix * (ex: 2500)"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
            <TextInput
              style={s.input}
              placeholder="Description"
              value={description}
              onChangeText={setDesc}
            />
            <TouchableOpacity style={s.btn} onPress={ajouter}>
              <Text style={s.btnTxt}>Ajouter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.btnCancel}
              onPress={() => setModal(false)}
            >
              <Text style={s.btnCancelTxt}>Annuler</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0FAF5" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 8,
  },
  titre: { fontSize: 22, fontWeight: "bold", color: "#1A3020" },
  btnAjouter: {
    backgroundColor: "#D33243",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  btnAjouterTxt: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#C8EDD8",
    flexDirection: "row",
    alignItems: "center",
  },
  nom: { fontSize: 15, fontWeight: "bold", color: "#1A3020" },
  prix: { fontSize: 14, color: "#D33243", marginTop: 2 },
  det: { fontSize: 13, color: "#3B9890", marginTop: 2 },
  del: { color: "#D33243", fontSize: 13 },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: "#A9BF53",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetTitre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A3020",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#A9BF53",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
    backgroundColor: "#F0FAF5",
    color: "#1A3020",
  },
  btn: {
    backgroundColor: "#D33243",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnTxt: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  btnCancel: { padding: 14, alignItems: "center" },
  btnCancelTxt: { color: "#3B9890", fontSize: 14 },
});
