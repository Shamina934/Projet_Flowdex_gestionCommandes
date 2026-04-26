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

const BASE =
  Platform.OS === "web"
    ? "http://localhost:3000/api"
    : "http://192.168.1.21:3000/api";

type Product = { id: number; name: string };
type Purchase = {
  id: number;
  product: Product;
  quantity: number;
  purchase_price: string;
  date: string;
};

export default function AchatsPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    charger();
    fetch(`${BASE}/products`)
      .then((r) => r.json())
      .then(setProducts);
  }, []);

  const charger = () => {
    fetch(`${BASE}/purchases`)
      .then((r) => r.json())
      .then(setPurchases)
      .catch(() => Alert.alert("Erreur", "Serveur inaccessible"));
  };

  const ajouter = () => {
    if (!productId || !quantity || !price) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires");
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    fetch(`${BASE}/purchases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: productId,
        quantity: parseInt(quantity),
        purchase_price: parseFloat(price),
        date: today,
      }),
    })
      .then(() => {
        setProductId(null);
        setQuantity("");
        setPrice("");
        charger();
        Alert.alert("Succès", "Achat enregistré !");
      })
      .catch(() => Alert.alert("Erreur", "Ajout impossible"));
  };

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.content}>
      <Text style={s.titre}>Historique des achats</Text>

      <FlatList
        data={purchases}
        scrollEnabled={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={s.card}>
            <Text style={s.nom}>{item.product?.name}</Text>
            <Text style={s.det}>Quantité : {item.quantity}</Text>
            <Text style={s.prix}>Prix : {item.purchase_price} €</Text>
            <Text style={s.det}>Date : {item.date}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={<Text style={s.det}>Aucun achat enregistré</Text>}
      />

      <Text style={s.sousTitre}>Nouvel achat</Text>

      <Text style={s.label}>Sélectionner un produit :</Text>
      {products.map((p) => (
        <TouchableOpacity
          key={p.id}
          style={[s.selectItem, productId === p.id && s.selectItemActif]}
          onPress={() => setProductId(p.id)}
        >
          <Text style={[s.selectTxt, productId === p.id && s.selectTxtActif]}>
            {p.name}
          </Text>
        </TouchableOpacity>
      ))}
      <Text style={s.sousTitre}>Détails de l'achat :</Text>
      {/*<Text style={s.label}></Text>*/}
      <TextInput
        style={[s.input, { marginTop: 12 }]}
        placeholder="Quantité *"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <TextInput
        style={s.input}
        placeholder="Prix d'achat * (ex: 2000)"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TouchableOpacity style={s.btn} onPress={ajouter}>
        <Text style={s.btnTxt}>Enregistrer l'achat</Text>
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
  },
  nom: { fontSize: 15, fontWeight: "bold", color: "#1A3020" },
  prix: { fontSize: 14, color: "#bd1f56", marginTop: 2 },
  det: { fontSize: 13, color: "#3B9890", marginTop: 2 },
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
    marginTop: 4,
  },
  btnTxt: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
