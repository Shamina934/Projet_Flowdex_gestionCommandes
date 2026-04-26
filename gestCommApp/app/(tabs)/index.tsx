import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Accueil() {
  const router = useRouter();

  const modules = [
    {
      titre: "Produits",
      desc: "Gérer le catalogue",
      route: "/produits",
      emoji: "📦",
    },
    {
      titre: "Clients",
      desc: "Gérer les clients",
      route: "/clients",
      emoji: "👥",
    },
    {
      titre: "Commandes",
      desc: "Créer et suivre",
      route: "/commandes",
      emoji: "🧾",
    },
    {
      titre: "Achats",
      desc: "Historique des achats",
      route: "/achats",
      emoji: "🛒",
    },
  ];

  return (
    <View style={s.container}>
      <Text style={s.titre}>Gestion de commandes</Text>
      <Text style={s.sous}>Choisissez un module</Text>

      <View style={s.grid}>
        {modules.map((m) => (
          <TouchableOpacity
            key={m.route}
            style={s.card}
            onPress={() => router.push(m.route as any)}
          >
            <Text style={s.emoji}>{m.emoji}</Text>
            <Text style={s.cardTitre}>{m.titre}</Text>
            <Text style={s.cardDesc}>{m.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0FAF5",
    padding: 20,
    paddingTop: 60,
  },
  titre: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1A3020",
    marginBottom: 4,
  },
  sous: {
    fontSize: 14,
    color: "#3B9890",
    marginBottom: 32,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  card: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: "#C8EDD8",
    alignItems: "center",
    gap: 8,
  },
  emoji: {
    fontSize: 36,
  },
  cardTitre: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A3020",
  },
  cardDesc: {
    fontSize: 12,
    color: "#3B9890",
    textAlign: "center",
  },
});
