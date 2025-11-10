export type Product = {
  id: string;
  name: string;
  price: number;
  category: 'Indica' | 'Sativa' | 'Hybrid' | 'CBD';
  description: string;
};

const products: Product[] = [
  {
    id: 'aurora-mist-rolls',
    name: 'Aurora Mist — 5 Pack',
    price: 48,
    category: 'Sativa',
    description: 'Sparkling citrus terpenes and uplifting botanicals for daytime adventures.'
  },
  {
    id: 'moonlit-cacao-rolls',
    name: 'Moonlit Cacao — 5 Pack',
    price: 52,
    category: 'Indica',
    description: 'Decadent indica pre-rolls infused with raw cacao husk for deep evening calm.'
  },
  {
    id: 'zenith-bloom-rolls',
    name: 'Zenith Bloom — 5 Pack',
    price: 50,
    category: 'Hybrid',
    description: 'Balanced hybrid featuring strawberry-forward terpenes for smooth creativity.'
  },
  {
    id: 'ember-kissed-rolls',
    name: 'Ember Kissed — 5 Pack',
    price: 49,
    category: 'Hybrid',
    description: 'Cherry and citrus aromatics keep the vibe playful for elevated social hangs.'
  },
  {
    id: 'stillwater-rolls',
    name: 'Stillwater — CBD 5 Pack',
    price: 45,
    category: 'CBD',
    description: 'CBG-rich blend designed to center the mind without the heavy lift.'
  }
];

export default products;
