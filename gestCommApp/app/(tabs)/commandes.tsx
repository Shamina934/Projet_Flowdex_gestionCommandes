import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const BASE =
  Platform.OS === "web"
    ? "http://localhost:3000/api"
    : "http://192.168.1.21:3000/api";

type Client = { id: number; name: string };
type Product = { id: number; name: string; price: string };
type Order = {
  id: number;
  client: Client;
  date: string;
  total: string;
  products: Product[];
};

export default function CommandesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [modal, setModal] = useState(false);
  const [selectedClient, setClient] = useState<number | null>(null);
  const [selectedProducts, setProds] = useState<number[]>([]);

  useEffect(() => {
    chargerOrders();
    fetch(`${BASE}/clients`)
      .then((r) => r.json())
      .then(setClients);
    fetch(`${BASE}/products`)
      .then((r) => r.json())
      .then(setProducts);
  }, []);

  const chargerOrders = () => {
    fetch(`${BASE}/orders`)
      .then((r) => r.json())
      .then(setOrders)
      .catch(() => Alert.alert("Erreur", "Serveur inaccessible"));
  };

  const toggleProduct = (id: number) => {
    setProds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const calculerTotal = () => {
    return selectedProducts.reduce((acc, id) => {
      const p = products.find((p) => p.id === id);
      return acc + (p ? parseFloat(p.price) : 0);
    }, 0);
  };

  const creerCommande = () => {
    if (!selectedClient) {
      Alert.alert("Erreur", "Sélectionnez un client");
      return;
    }
    if (selectedProducts.length === 0) {
      Alert.alert("Erreur", "Sélectionnez au moins un produit");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    fetch(`${BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: selectedClient,
        date: today,
        total: calculerTotal(),
        product_ids: selectedProducts,
      }),
    })
      .then(() => {
        setClient(null);
        setProds([]);
        setModal(false);
        chargerOrders();
        Alert.alert("Succès", "Commande créée !");
      })
      .catch(() => Alert.alert("Erreur", "Création impossible"));
  };

  const supprimer = (id: number) => {
    Alert.alert("Confirmer", "Supprimer cette commande ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => {
          fetch(`${BASE}/orders/${id}`, { method: "DELETE" })
            .then(chargerOrders)
            .catch(() => Alert.alert("Erreur", "Suppression impossible"));
        },
      },
    ]);
  };

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.titre}>Commandes</Text>
        <TouchableOpacity style={s.btnAjouter} onPress={() => setModal(true)}>
          <Text style={s.btnAjouterTxt}>+ Nouvelle</Text>
        </TouchableOpacity>
      </View>

      {/* Liste commandes */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={{ flex: 1 }}>
              <Text style={s.nom}>Commande #{item.id}</Text>
              <Text style={s.det}>Client : {item.client?.name}</Text>
              <Text style={s.det}>Date : {item.date}</Text>
              <Text style={s.prix}>Total : {item.total} €</Text>
              {item.products && item.products.length > 0 && (
                <Text style={s.det}>
                  Produits : {item.products.map((p) => p.name).join(", ")}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={() => supprimer(item.id)}>
              <Text style={s.del}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={<Text style={s.det}>Aucune commande</Text>}
      />

      {/* Modal nouvelle commande */}
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
            <Text style={s.sheetTitre}>Nouvelle commande</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={s.label}>Sélectionner un client :</Text>
              {clients.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[
                    s.selectItem,
                    selectedClient === c.id && s.selectItemActif,
                  ]}
                  onPress={() => setClient(c.id)}
                >
                  <Text
                    style={[
                      s.selectTxt,
                      selectedClient === c.id && s.selectTxtActif,
                    ]}
                  >
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}

              <Text style={[s.label, { marginTop: 14 }]}>
                Sélectionner des produits :
              </Text>
              {products.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    s.selectItem,
                    selectedProducts.includes(p.id) && s.selectItemActif,
                  ]}
                  onPress={() => toggleProduct(p.id)}
                >
                  <Text
                    style={[
                      s.selectTxt,
                      selectedProducts.includes(p.id) && s.selectTxtActif,
                    ]}
                  >
                    {p.name} — {p.price} €
                  </Text>
                </TouchableOpacity>
              ))}

              {selectedProducts.length > 0 && (
                <Text style={s.total}>
                  Total : {calculerTotal().toFixed(2)} €
                </Text>
              )}

              <TouchableOpacity style={s.btn} onPress={creerCommande}>
                <Text style={s.btnTxt}>Créer la commande</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={s.btnCancel}
                onPress={() => setModal(false)}
              >
                <Text style={s.btnCancelTxt}>Annuler</Text>
              </TouchableOpacity>
            </ScrollView>
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
    alignItems: "flex-start",
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
    maxHeight: "85%",
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
  label: { fontSize: 14, color: "#1A3020", marginBottom: 6, fontWeight: "500" },
  selectItem: {
    borderWidth: 1,
    borderColor: "#A9BF53",
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    backgroundColor: "#F0FAF5",
  },
  selectItemActif: { backgroundColor: "#D33243", borderColor: "#D33243" },
  selectTxt: { color: "#1A3020", fontSize: 14 },
  selectTxtActif: { color: "#fff", fontWeight: "bold" },
  total: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#718804",
    marginVertical: 10,
  },
  btn: {
    backgroundColor: "#D33243",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
  },
  btnTxt: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  btnCancel: { padding: 14, alignItems: "center" },
  btnCancelTxt: { color: "#3B9890", fontSize: 14 },
});
