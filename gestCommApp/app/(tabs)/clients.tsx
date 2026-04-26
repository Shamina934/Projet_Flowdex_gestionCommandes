import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const API =
  Platform.OS === "web"
    ? "http://localhost:3000/api/clients"
    : "http://192.168.1.21:3000/api/clients";

type Client = { id: number; name: string; email: string; phone: string };

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    charger();
  }, []);

  const charger = () => {
    fetch(API)
      .then((r) => r.json())
      .then(setClients)
      .catch(() => Alert.alert("Erreur", "Serveur inaccessible"));
  };

  const ajouter = () => {
    if (!name || !email) {
      Alert.alert("Erreur", "Nom et email obligatoires");
      return;
    }

    // Vérifie le format email
    if (!email.includes("@") || !email.includes(".")) {
      Alert.alert("Erreur", "Format email invalide");
      return;
    }

    // Vérifie que le nom a au moins 2 caractères
    if (name.trim().length < 2) {
      Alert.alert("Erreur", "Le nom doit contenir au moins 2 caractères");
      return;
    }

    // Vérifie le téléphone si renseigné (optionnel mais doit être numérique)
    if (phone && phone.length < 8) {
      Alert.alert("Erreur", "Numéro de téléphone invalide");
      return;
    }

    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone }),
    })
      .then(() => {
        setName("");
        setEmail("");
        setPhone("");
        charger();
        Alert.alert("Succès", "Client ajouté !");
      })
      .catch(() => Alert.alert("Erreur", "Ajout impossible"));
  };

  const supprimer = (id: number) => {
    Alert.alert("Confirmer", "Supprimer ce client ?", [
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
    <ScrollView style={s.scroll} contentContainerStyle={s.content}>
      <Text style={s.titre}>Liste des clients</Text>

      <FlatList
        data={clients}
        scrollEnabled={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={{ flex: 1 }}>
              <Text style={s.nom}>{item.name}</Text>
              <Text style={s.det}>{item.email}</Text>
              {item.phone ? <Text style={s.det}>{item.phone}</Text> : null}
            </View>
            <TouchableOpacity onPress={() => supprimer(item.id)}>
              <Text style={s.del}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />

      <Text style={s.sousTitre}>Ajouter un client</Text>
      <TextInput
        style={s.input}
        placeholder="Nom *"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={s.input}
        placeholder="Email *"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={s.input}
        placeholder="Téléphone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={s.btn} onPress={ajouter}>
        <Text style={s.btnTxt}>Ajouter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#F0FAF5" },
  content: { padding: 16, paddingBottom: 40 },
  titre: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A3020",
    marginBottom: 12,
  },
  sousTitre: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1A3020",
    marginTop: 24,
    marginBottom: 10,
  },
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
  det: { fontSize: 13, color: "#3B9890", marginTop: 2 },
  del: { color: "#bd1f56", fontSize: 13 },
  input: {
    borderWidth: 1,
    borderColor: "#A9BF53",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
    backgroundColor: "#fff",
    color: "#1A3020",
  },
  btn: {
    backgroundColor: "#bd1f56",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnTxt: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
