import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
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
  const [modal, setModal] = useState(false);
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
        setModal(false);
        charger();
        Alert.alert("Succès", "Achat enregistré !");
      })
      .catch(() => Alert.alert("Erreur", "Ajout impossible"));
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.titre}>Achats</Text>
        <TouchableOpacity style={s.btnAjouter} onPress={() => setModal(true)}>
          <Text style={s.btnAjouterTxt}>+ Ajouter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={purchases}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={s.card}>
            <Text style={s.nom}>{item.product?.name}</Text>
            <Text style={s.det}>Quantité : {item.quantity}</Text>
            <Text style={s.prix}>Prix d'achat : {item.purchase_price} €</Text>
            <Text style={s.det}>Date : {item.date}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={<Text style={s.det}>Aucun achat enregistré</Text>}
      />

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
            <Text style={s.sheetTitre}>Nouvel achat</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={s.label}>Sélectionner un produit :</Text>
              {products.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    s.selectItem,
                    productId === p.id && s.selectItemActif,
                  ]}
                  onPress={() => setProductId(p.id)}
                >
                  <Text
                    style={[
                      s.selectTxt,
                      productId === p.id && s.selectTxtActif,
                    ]}
                  >
                    {p.name}
                  </Text>
                </TouchableOpacity>
              ))}

              <Text style={[s.label, { marginTop: 14 }]}>
                Détails de l'achat :
              </Text>
              <TextInput
                style={s.input}
                placeholder="Quantité *"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
              <TextInput
                style={s.input}
                placeholder="Prix d'achat unitaire * (ex: 2000)"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />

              <TouchableOpacity style={s.btn} onPress={ajouter}>
                <Text style={s.btnTxt}>Enregistrer</Text>
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
  },
  nom: { fontSize: 15, fontWeight: "bold", color: "#1A3020" },
  prix: { fontSize: 14, color: "#D33243", marginTop: 2 },
  det: { fontSize: 13, color: "#3B9890", marginTop: 2 },
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
    marginTop: 6,
  },
  btnTxt: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  btnCancel: { padding: 14, alignItems: "center" },
  btnCancelTxt: { color: "#3B9890", fontSize: 14 },
});
