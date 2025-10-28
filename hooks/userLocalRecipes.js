import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';

export default function useLocalRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const csvUri = FileSystem.documentDirectory + 'main_data_clean.csv';
        // if you want to read from assets directly (Expo bundler):
        const response = await fetch(require('@/assets/data/main_data_clean.csv'));
        const text = await response.text();

        const parsed = Papa.parse(text, { header: true });
        setRecipes(parsed.data.filter(r => r.title));
      } catch (e) {
        console.error('Error loading local recipes:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return { recipes, loading };
}
