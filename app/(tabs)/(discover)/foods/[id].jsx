// app/(tabs)/(discover)/(foods)/[id].jsx
import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function FoodDetails() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const docRef = doc(db, "foods", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFood({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching food details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!food) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text style={{ color: theme.text }}>Food not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ flexDirection: "row", alignItems: "center", margin: 16 }}
      >
        <Ionicons name="arrow-back" size={22} color={theme.text} />
        <Text style={{ color: theme.text, fontSize: 16, marginLeft: 8 }}>Back</Text>
      </TouchableOpacity>

      {/* Image */}
      <Image
        source={{ uri: food.image_url || "https://via.placeholder.com/300x200.png?text=No+Image" }}
        style={{ width: "100%", height: 200 }}
      />

      {/* Content */}
      <View style={{ padding: 16 }}>
        <Text style={{ color: theme.text, fontSize: 22, fontWeight: "700" }}>{food.name}</Text>
        <Text style={{ color: theme.subtext, fontSize: 14, marginTop: 4 }}>
          {food.category} • {food.serving_size || "Per serving"}
        </Text>

        {/* Description */}
        <Text style={{ color: theme.text, fontSize: 14, marginTop: 10 }}>{food.description}</Text>

        {/* Nutrition facts */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: theme.primary, fontWeight: "700", fontSize: 16 }}>
            Nutrition (per serving)
          </Text>
          {[
            ["Calories", food.calories, "kcal"],
            ["Protein", food.protein_g, "g"],
            ["Fat", food.fat_g, "g"],
            ["Carbohydrates", food.carbs_g, "g"],
            ["Fiber", food.fiber_g, "g"],
            ["Sugar", food.sugar_g, "g"],
            ["Sodium", food.sodium_mg, "mg"],
            ["Potassium", food.potassium_mg, "mg"],
            ["Calcium", food.calcium_mg, "mg"],
            ["Iron", food.iron_mg, "mg"],
          ].map(([label, value, unit]) => (
            <Text key={label} style={{ color: theme.text, fontSize: 14, marginTop: 4 }}>
              {label}: {value ? `${value} ${unit}` : "-"}
            </Text>
          ))}
        </View>

        {/* Additional info */}
        <View style={{ marginTop: 20 }}>
          {food.diet_type?.length > 0 && (
            <Text style={{ color: theme.primary, fontWeight: "700", fontSize: 16, marginBottom: 5 }}>
              Diet Type: <Text style={{ color: theme.text }}>{food.diet_type.join(", ")}</Text>
            </Text>
          )}

          {food.allergens?.length > 0 && (
            <Text style={{ color: theme.primary, fontWeight: "700", fontSize: 16, marginBottom: 5 }}>
              Allergens: <Text style={{ color: theme.text }}>{food.allergens.join(", ")}</Text>
            </Text>
          )}

          {food.common_uses?.length > 0 && (
            <Text style={{ color: theme.primary, fontWeight: "700", fontSize: 16, marginBottom: 5 }}>
              Common Uses: <Text style={{ color: theme.text }}>{food.common_uses.join(", ")}</Text>
            </Text>
          )}

          {food.substitutes?.length > 0 && (
            <Text style={{ color: theme.primary, fontWeight: "700", fontSize: 16, marginBottom: 5 }}>
              Substitutes: <Text style={{ color: theme.text }}>{food.substitutes.join(", ")}</Text>
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
