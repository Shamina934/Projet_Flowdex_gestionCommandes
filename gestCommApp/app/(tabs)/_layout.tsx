import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#F0FAF5" },
        headerTintColor: "#1A3020",
        tabBarStyle: { backgroundColor: "#F0FAF5", borderTopColor: "#A9BF53" },
        tabBarActiveTintColor: "#bd1f56",
        tabBarInactiveTintColor: "#3B9890",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="produits"
        options={{
          title: "Produits",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cube-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: "Clients",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="commandes"
        options={{
          title: "Commandes",
          tabBarIcon: ({ color }) => (
            <Ionicons name="receipt-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="achats"
        options={{
          title: "Achats",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cart-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
