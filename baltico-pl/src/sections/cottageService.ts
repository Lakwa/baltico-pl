import { supabase } from '../supabaseClient';

// Definiujemy, jak wygląda Domek w naszej aplikacji (Frontend)
export interface Cottage {
  id: string;
  title: string;
  description: string;
  city: string;
  price: string;
  capacity: number;
  size: number;
  images: string[];
  features: string[];
}

/**
 * Funkcja 1: Pobiera WSZYSTKIE domki (do OffersPage)
 */
export const getCottages = async (): Promise<Cottage[]> => {
  // A. Zapytanie do Supabase
  // Mówimy: "Daj mi wszystko z tabeli cottages..."
  // Oraz: "...dołącz powiązane zdjęcia (cottage_images) i cechy (cottage_features -> features)"
  const { data, error } = await supabase
    .from('cottages')
    .select(`
      *,
      cottage_images (image),
      cottage_features (
        features (feature)
      )
    `);

  if (error) {
    console.error('❌ Błąd pobierania ofert:', error.message);
    return [];
  }

  // B. Transformacja danych (Mapowanie)
  // Baza zwraca: { tittle: "...", cottage_images: [{image: "url1"}, {image: "url2"}] }
  // My chcemy: { title: "...", images: ["url1", "url2"] }
  return data.map((item: any) => ({
    id: item.id,
    title: item.tittle, // Mapujemy "tittle" z bazy na "title" w aplikacji
    description: item.description,
    city: item.city,
    price: `${item.price_per_night} PLN / noc`, // Doklejamy walutę
    capacity: item.capacity,
    size: item.size,
    // Spłaszczamy tablicę obiektów do tablicy stringów
    images: item.cottage_images ? item.cottage_images.map((img: any) => img.image) : [],
    features: item.cottage_features ? item.cottage_features.map((cf: any) => cf.features.feature) : []
  }));
};

/**
 * Funkcja 2: Pobiera JEDEN domek po ID (do OfferDetailsPage)
 */
export const getCottageById = async (id: string): Promise<Cottage | null> => {
  const { data, error } = await supabase
    .from('cottages')
    .select(`
      *,
      cottage_images (image),
      cottage_features (
        features (feature)
      )
    `)
    .eq('id', id) // Kluczowe: Filtrujemy, żeby dostać tylko jeden wiersz
    .single();   // Mówimy bazie: "Spodziewam się tylko jednego wyniku"

  if (error || !data) {
    console.error('❌ Błąd pobierania szczegółów:', error?.message);
    return null;
  }

  // Ta sama transformacja co wyżej, ale dla jednego obiektu
  return {
    id: data.id,
    title: data.tittle,
    description: data.description,
    city: data.city,
    price: `${data.price_per_night} PLN / noc`,
    capacity: data.capacity,
    size: data.size,
    images: data.cottage_images ? data.cottage_images.map((img: any) => img.image) : [],
    features: data.cottage_features ? data.cottage_features.map((cf: any) => cf.features.feature) : []
  };
};