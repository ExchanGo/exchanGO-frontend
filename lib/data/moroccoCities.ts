export interface MoroccoCityData {
  value: string;
  label: string;
  latitude: number;
  longitude: number;
  region?: string;
  population?: number;
}

export const moroccoCities: MoroccoCityData[] = [
  // Major Cities
  { value: "casablanca", label: "Casablanca", latitude: 33.5731, longitude: -7.5898, region: "Casablanca-Settat", population: 3359818 },
  { value: "rabat", label: "Rabat", latitude: 34.0209, longitude: -6.8416, region: "Rabat-Salé-Kénitra", population: 577827 },
  { value: "fes", label: "Fès", latitude: 34.0181, longitude: -5.0078, region: "Fès-Meknès", population: 1112072 },
  { value: "marrakech", label: "Marrakech", latitude: 31.6295, longitude: -7.9811, region: "Marrakech-Safi", population: 928850 },
  { value: "agadir", label: "Agadir", latitude: 30.4278, longitude: -9.5981, region: "Souss-Massa", population: 421844 },
  { value: "tangier", label: "Tanger", latitude: 35.7595, longitude: -5.8340, region: "Tanger-Tétouan-Al Hoceïma", population: 947952 },
  { value: "meknes", label: "Meknès", latitude: 33.8935, longitude: -5.5473, region: "Fès-Meknès", population: 632079 },
  { value: "oujda", label: "Oujda", latitude: 34.6814, longitude: -1.9086, region: "Oriental", population: 494252 },
  { value: "kenitra", label: "Kénitra", latitude: 34.2610, longitude: -6.5802, region: "Rabat-Salé-Kénitra", population: 431282 },
  { value: "tetouan", label: "Tétouan", latitude: 35.5889, longitude: -5.3626, region: "Tanger-Tétouan-Al Hoceïma", population: 380787 },
  
  // Medium Cities
  { value: "safi", label: "Safi", latitude: 32.2994, longitude: -9.2372, region: "Marrakech-Safi", population: 308508 },
  { value: "mohammedia", label: "Mohammedia", latitude: 33.6866, longitude: -7.3830, region: "Casablanca-Settat", population: 187708 },
  { value: "el-jadida", label: "El Jadida", latitude: 33.2316, longitude: -8.5007, region: "Casablanca-Settat", population: 194934 },
  { value: "beni-mellal", label: "Béni Mellal", latitude: 32.3372, longitude: -6.3498, region: "Béni Mellal-Khénifra", population: 192676 },
  { value: "nador", label: "Nador", latitude: 35.1681, longitude: -2.9287, region: "Oriental", population: 161726 },
  { value: "taza", label: "Taza", latitude: 34.2133, longitude: -4.0103, region: "Fès-Meknès", population: 148456 },
  { value: "settat", label: "Settat", latitude: 33.0018, longitude: -7.6160, region: "Casablanca-Settat", population: 142250 },
  { value: "larache", label: "Larache", latitude: 35.1932, longitude: -6.1563, region: "Tanger-Tétouan-Al Hoceïma", population: 125008 },
  { value: "khouribga", label: "Khouribga", latitude: 32.8811, longitude: -6.9063, region: "Béni Mellal-Khénifra", population: 196196 },
  { value: "al-hoceima", label: "Al Hoceïma", latitude: 35.2517, longitude: -3.9372, region: "Tanger-Tétouan-Al Hoceïma", population: 56716 },
  
  // Smaller Cities and Towns
  { value: "ouarzazate", label: "Ouarzazate", latitude: 30.9335, longitude: -6.9370, region: "Drâa-Tafilalet", population: 71067 },
  { value: "errachidia", label: "Errachidia", latitude: 31.9314, longitude: -4.4244, region: "Drâa-Tafilalet", population: 92374 },
  { value: "essaouira", label: "Essaouira", latitude: 31.5085, longitude: -9.7595, region: "Marrakech-Safi", population: 77966 },
  { value: "ifrane", label: "Ifrane", latitude: 33.5228, longitude: -5.1106, region: "Fès-Meknès", population: 14659 },
  { value: "chefchaouen", label: "Chefchaouen", latitude: 35.1688, longitude: -5.2636, region: "Tanger-Tétouan-Al Hoceïma", population: 42786 },
  { value: "azrou", label: "Azrou", latitude: 33.4342, longitude: -5.2213, region: "Fès-Meknès", population: 54749 },
  { value: "tiznit", label: "Tiznit", latitude: 29.6974, longitude: -9.7316, region: "Souss-Massa", population: 74699 },
  { value: "taroudant", label: "Taroudant", latitude: 30.4702, longitude: -8.8770, region: "Souss-Massa", population: 80149 },
  { value: "berkane", label: "Berkane", latitude: 34.9218, longitude: -2.3200, region: "Oriental", population: 109237 },
  { value: "dakhla", label: "Dakhla", latitude: 23.7185, longitude: -15.9570, region: "Dakhla-Oued Ed-Dahab", population: 106277 },
  
  // Additional Cities
  { value: "sale", label: "Salé", latitude: 34.0531, longitude: -6.7985, region: "Rabat-Salé-Kénitra", population: 890403 },
  { value: "temara", label: "Témara", latitude: 33.9287, longitude: -6.9067, region: "Rabat-Salé-Kénitra", population: 313510 },
  { value: "inezgane", label: "Inezgane", latitude: 30.3552, longitude: -9.5316, region: "Souss-Massa", population: 131431 },
  { value: "khemisset", label: "Khémisset", latitude: 33.8244, longitude: -6.0661, region: "Rabat-Salé-Kénitra", population: 131542 },
  { value: "berrechid", label: "Berrechid", latitude: 33.2651, longitude: -7.5830, region: "Casablanca-Settat", population: 136634 },
  { value: "fquih-ben-salah", label: "Fquih Ben Salah", latitude: 32.5021, longitude: -6.6989, region: "Béni Mellal-Khénifra", population: 110750 },
  { value: "ouazzane", label: "Ouazzane", latitude: 34.7936, longitude: -5.5707, region: "Tanger-Tétouan-Al Hoceïma", population: 59606 },
  { value: "sidi-kacem", label: "Sidi Kacem", latitude: 34.2214, longitude: -5.7081, region: "Rabat-Salé-Kénitra", population: 74755 },
  { value: "sidi-slimane", label: "Sidi Slimane", latitude: 34.2654, longitude: -5.9263, region: "Rabat-Salé-Kénitra", population: 79437 },
  { value: "youssoufia", label: "Youssoufia", latitude: 32.2465, longitude: -8.5297, region: "Marrakech-Safi", population: 67628 },
  
  // Coastal Cities
  { value: "asilah", label: "Asilah", latitude: 35.4650, longitude: -6.0347, region: "Tanger-Tétouan-Al Hoceïma", population: 31767 },
  { value: "martil", label: "Martil", latitude: 35.6175, longitude: -5.2754, region: "Tanger-Tétouan-Al Hoceïma", population: 39011 },
  { value: "fnideq", label: "Fnideq", latitude: 35.8497, longitude: -5.3570, region: "Tanger-Tétouan-Al Hoceïma", population: 53526 },
  { value: "mdiq", label: "M'diq", latitude: 35.6853, longitude: -5.3264, region: "Tanger-Tétouan-Al Hoceïma", population: 56227 },
  { value: "cabo-negro", label: "Cabo Negro", latitude: 35.6667, longitude: -5.2833, region: "Tanger-Tétouan-Al Hoceïma" },
  
  // Mountain Cities
  { value: "midelt", label: "Midelt", latitude: 32.6852, longitude: -4.7348, region: "Drâa-Tafilalet", population: 55304 },
  { value: "rich", label: "Rich", latitude: 32.6811, longitude: -4.9869, region: "Drâa-Tafilalet", population: 23909 },
  { value: "imouzzer-kandar", label: "Imouzzer Kandar", latitude: 33.7075, longitude: -5.0106, region: "Fès-Meknès", population: 13745 },
  
  // Desert Cities
  { value: "zagora", label: "Zagora", latitude: 30.3314, longitude: -5.8372, region: "Drâa-Tafilalet", population: 40069 },
  { value: "merzouga", label: "Merzouga", latitude: 31.0801, longitude: -4.0135, region: "Drâa-Tafilalet" },
  { value: "mhamid", label: "M'hamid", latitude: 29.8281, longitude: -5.7281, region: "Drâa-Tafilalet" },
  
  // Industrial Cities
  { value: "jorf-lasfar", label: "Jorf Lasfar", latitude: 33.1167, longitude: -8.6333, region: "Casablanca-Settat" },
  { value: "skhirate", label: "Skhirate", latitude: 33.8500, longitude: -7.0333, region: "Rabat-Salé-Kénitra", population: 25373 },
];

// Helper function to search cities by name
export const searchMoroccoCities = (query: string): MoroccoCityData[] => {
  if (!query.trim()) return moroccoCities;
  
  const searchTerm = query.toLowerCase().trim();
  return moroccoCities.filter(city => 
    city.label.toLowerCase().includes(searchTerm) ||
    city.value.toLowerCase().includes(searchTerm) ||
    (city.region && city.region.toLowerCase().includes(searchTerm))
  );
};

// Helper function to get city by value
export const getCityByValue = (value: string): MoroccoCityData | undefined => {
  return moroccoCities.find(city => city.value === value);
};

// Helper function to get cities by region
export const getCitiesByRegion = (region: string): MoroccoCityData[] => {
  return moroccoCities.filter(city => city.region === region);
};

// Get all unique regions
export const getMoroccoRegions = (): string[] => {
  const regions = moroccoCities
    .map(city => city.region)
    .filter((region): region is string => region !== undefined);
  return [...new Set(regions)].sort();
}; 