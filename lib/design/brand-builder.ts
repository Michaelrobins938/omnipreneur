export interface BrandKit {
  colors: string[];
  fonts: string[];
  logoIdea: string;
}

export function buildBrandKit(name: string): BrandKit {
  const colors = ['#0EA5E9', '#22C55E', '#F59E0B', '#EF4444'];
  const fonts = ['Inter', 'Poppins', 'DM Sans'];
  const logoIdea = `${name} monogram with geometric shape`;
  return { colors, fonts, logoIdea };
}

