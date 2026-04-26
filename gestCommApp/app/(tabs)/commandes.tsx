import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
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
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          Alert.alert("Erreur serveur", JSON.stringify(data));
          return;
        }
        setClient(null);
        setProds([]);
        chargerOrders();
        Alert.alert("Succès", "Commande créée !");
      })
      .catch((err) => Alert.alert("Erreur réseau", err.message));
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
    <ScrollView style={s.scroll} contentContainerStyle={s.content}>
      <Text style={s.titre}>Commandes</Text>

      <FlatList
        data={orders}
        scrollEnabled={false}
        keyExtractor={(item) => item.id.toString()}
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

      <Text style={s.sousTitre}>Nouvelle commande</Text>

      <Text style={s.label}>Sélectionner un client :</Text>
      {clients.map((c) => (
        <TouchableOpacity
          key={c.id}
          style={[s.selectItem, selectedClient === c.id && s.selectItemActif]}
          onPress={() => setClient(c.id)}
        >
          <Text
            style={[s.selectTxt, selectedClient === c.id && s.selectTxtActif]}
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
        <Text style={s.total}>Total : {calculerTotal().toFixed(2)} €</Text>
      )}

      <TouchableOpacity style={s.btn} onPress={creerCommande}>
        <Text style={s.btnTxt}>Créer la commande</Text>
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
  label: { fontSize: 14, color: "#1A3020", marginBottom: 6, fontWeight: "500" },
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
  prix: { fontSize: 14, color: "#bd1f56", marginTop: 2 },
  det: { fontSize: 13, color: "#3B9890", marginTop: 2 },
  del: { color: "#bd1f56", fontSize: 13 },
  selectItem: {
    borderWidth: 1,
    borderColor: "#A9BF53",
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    backgroundColor: "#fff",
  },
  selectItemActif: { backgroundColor: "#dfa4b9", borderColor: "#dfa4b9" },
  selectTxt: { color: "#1A3020", fontSize: 14 },
  selectTxtActif: { color: "#fff", fontWeight: "bold" },
  total: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#718804",
    marginTop: 10,
    marginBottom: 6,
  },
  btn: {
    backgroundColor: "#bd1f56",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  btnTxt: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
