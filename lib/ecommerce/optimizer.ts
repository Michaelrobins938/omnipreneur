export function optimizeProductListing(listing: { title: string; description: string; price: number }) {
  const improvedTitle = listing.title.length < 40 ? listing.title + ' | Official' : listing.title;
  const improvedDescription = listing.description.includes('features') ? listing.description : listing.description + '\n\nFeatures:\n- Benefit 1\n- Benefit 2';
  const recommendations = [
    'Add 3-5 bullet points highlighting key benefits',
    'Include at least 3 high-quality images',
    'Use social proof (reviews, testimonials)'
  ];
  return { improvedTitle, improvedDescription, recommendations };
}

