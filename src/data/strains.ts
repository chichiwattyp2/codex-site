export type Strain = {
  id: string;
  name: string;
  lineage: string;
  moodTags: Array<'uplifted' | 'focused' | 'creative' | 'relaxed' | 'balanced' | 'sleepy' | 'social'>;
  terpeneProfile: string[];
  tastingNotes: string[];
  description: string;
  pairedActivities: string[];
  productId?: string;
};

const strains: Strain[] = [
  {
    id: 'aurora-mist',
    name: 'Aurora Mist',
    lineage: 'Golden Pineapple × Lemon G13',
    moodTags: ['uplifted', 'social', 'creative'],
    terpeneProfile: ['Limonene', 'Ocimene', 'Humulene'],
    tastingNotes: ['Candied citrus', 'Lush pineapple', 'Fresh basil'],
    description:
      'A sparkling sativa-leaning blend that lifts the spirit and brightens social energy without jitters.',
    pairedActivities: ['Sunrise beach walks', 'Creative brainstorms', 'Playful gatherings'],
    productId: 'aurora-mist-rolls'
  },
  {
    id: 'moonlit-cacao',
    name: 'Moonlit Cacao',
    lineage: 'Wedding Cake × Granddaddy Purple',
    moodTags: ['relaxed', 'sleepy'],
    terpeneProfile: ['Myrcene', 'Linalool', 'Caryophyllene'],
    tastingNotes: ['Dark chocolate', 'Lavender honey', 'Warm spice'],
    description:
      'A decadent indica crafted for evening rituals, easing tension while inviting restorative rest.',
    pairedActivities: ['Breathwork sessions', 'Late-night journaling', 'Ambient playlists'],
    productId: 'moonlit-cacao-rolls'
  },
  {
    id: 'zenith-bloom',
    name: 'Zenith Bloom',
    lineage: 'Gelato 33 × Strawberry Cough',
    moodTags: ['balanced', 'uplifted'],
    terpeneProfile: ['Limonene', 'Bisabolol', 'Caryophyllene'],
    tastingNotes: ['Strawberry mousse', 'Meyer lemon', 'Creamy vanilla'],
    description:
      'A balanced hybrid that sustains focus while keeping the body light and open to inspiration.',
    pairedActivities: ['Co-working sessions', 'Afternoon museum trips', 'Yoga flows'],
    productId: 'zenith-bloom-rolls'
  },
  {
    id: 'ember-kissed',
    name: 'Ember Kissed',
    lineage: 'Cherry Pie × Tangie',
    moodTags: ['creative', 'social'],
    terpeneProfile: ['Terpinolene', 'Limonene', 'Pinene'],
    tastingNotes: ['Blood orange', 'Wild cherry', 'Zesty herbs'],
    description:
      'This vibrant hybrid sparks playful curiosity and keeps conversations glowing through the night.',
    pairedActivities: ['Gallery openings', 'Dinner parties', 'Live DJ sets'],
    productId: 'ember-kissed-rolls'
  },
  {
    id: 'stillwater',
    name: 'Stillwater',
    lineage: 'Harle-Tsu × CBG White',
    moodTags: ['balanced', 'focused'],
    terpeneProfile: ['Guaiol', 'Pinene', 'Limonene'],
    tastingNotes: ['Fresh rain', 'Green tea', 'Meyer lemon zest'],
    description:
      'A high-CBD pre-roll that softens the nervous system while keeping you dialed-in and present.',
    pairedActivities: ['Morning meditation', 'Deep work blocks', 'Nature journaling'],
    productId: 'stillwater-rolls'
  }
];

export default strains;
