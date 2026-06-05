export const CATEGORIES = [
  {
    id: 'fruits-veg',
    name: 'Fruits & Vegetables',
    image: 'https://images.unsplash.com/photo-1610348725531-843dff163e2c?auto=format&fit=crop&q=80&w=200',
    count: 24
  },
  {
    id: 'dairy-bread',
    name: 'Dairy, Bread & Eggs',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=200',
    count: 18
  },
  {
    id: 'snacks-munchies',
    name: 'Snacks & Munchies',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=200',
    count: 32
  },
  {
    id: 'beverages',
    name: 'Beverages',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200',
    count: 15
  },
  {
    id: 'bakery-biscuits',
    name: 'Bakery & Biscuits',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200',
    count: 12
  },
  {
    id: 'cooking-essentials',
    name: 'Cooking Essentials',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200',
    count: 20
  }
];

export const PRODUCTS = [
  {
    id: '1',
    name: 'Fresh Guava',
    category: 'fruits-veg',
    price: 34,
    oldPrice: 39,
    discount: 12,
    weight: '500 g',
    rating: 4.5,
    reviewsCount: 342,
    image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=600'
    ],
    inStock: true,
    badge: '12% OFF',
    description: 'Enjoy farm-fresh produce, handpicked for quality, packed with nutrition, and delivered with care! Sweet, pinkish/white pulp guavas, perfect for a refreshing snack or salad.',
    nutrition: {
      energy: '68 kcal',
      protein: '2.6 g',
      carbs: '14.3 g',
      fat: '1.0 g',
      fiber: '5.4 g'
    },
    eta: '9-12 mins'
  },
  {
    id: '2',
    name: 'Fresh Green Grapes',
    category: 'fruits-veg',
    price: 58,
    oldPrice: 72,
    discount: 19,
    weight: '500 g',
    rating: 4.6,
    reviewsCount: 512,
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&q=80&w=600'
    ],
    inStock: true,
    badge: '19% OFF',
    description: 'Sweet and juicy seedless green grapes. Loaded with vitamins and perfect for quick snacking or mocktails.',
    nutrition: {
      energy: '69 kcal',
      protein: '0.7 g',
      carbs: '18.1 g',
      fat: '0.2 g',
      fiber: '0.9 g'
    },
    eta: '10 mins'
  },
  {
    id: '3',
    name: 'Organic Red Onion',
    category: 'fruits-veg',
    price: 44,
    oldPrice: 49,
    discount: 10,
    weight: '1 kg',
    rating: 4.2,
    reviewsCount: 1240,
    image: 'https://images.unsplash.com/photo-1508747702-f520acf9b3be?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1508747702-f520acf9b3be?auto=format&fit=crop&q=80&w=600'
    ],
    inStock: true,
    badge: '10% OFF',
    description: 'Crisp and pungent red onions sourced from organic certified farms. Kitchen staple for everyday cooking.',
    nutrition: {
      energy: '40 kcal',
      protein: '1.1 g',
      carbs: '9.3 g',
      fat: '0.1 g',
      fiber: '1.7 g'
    },
    eta: '11 mins'
  },
  {
    id: '4',
    name: 'Organic Banana (Robusta)',
    category: 'fruits-veg',
    price: 35,
    oldPrice: 39,
    discount: 10,
    weight: '6 pcs (approx. 800g)',
    rating: 4.8,
    reviewsCount: 2315,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=600'
    ],
    inStock: true,
    badge: '10% OFF',
    description: 'Robusta bananas, freshly harvested, chemical-free. Super rich source of potassium and instant energy.',
    nutrition: {
      energy: '89 kcal',
      protein: '1.1 g',
      carbs: '22.8 g',
      fat: '0.3 g',
      fiber: '2.6 g'
    },
    eta: '8 mins'
  },
  {
    id: '5',
    name: 'Amul Table Butter',
    category: 'dairy-bread',
    price: 56,
    oldPrice: 59,
    discount: 5,
    weight: '100 g',
    rating: 4.9,
    reviewsCount: 4890,
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=600'
    ],
    inStock: true,
    badge: '5% OFF',
    description: 'Classic salted table butter from Amul. Utterly butterly delicious! Ideal for toast, cooking, and baking.',
    nutrition: {
      energy: '722 kcal',
      protein: '0.6 g',
      carbs: '0.0 g',
      fat: '80.0 g',
      fiber: '0.0 g'
    },
    eta: '8 mins'
  },
  {
    id: '6',
    name: 'Premium Toned Milk',
    category: 'dairy-bread',
    price: 66,
    oldPrice: 68,
    discount: 3,
    weight: '1 L',
    rating: 4.7,
    reviewsCount: 3822,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=600'
    ],
    inStock: true,
    badge: 'Best Price',
    description: 'Pasteurized toned milk, rich in calcium and essential vitamins. Sourced daily from local dairies.',
    nutrition: {
      energy: '58 kcal',
      protein: '3.2 g',
      carbs: '4.7 g',
      fat: '3.0 g',
      fiber: '0.0 g'
    },
    eta: '9 mins'
  },
  {
    id: '7',
    name: 'Fresh Egg Tray (White)',
    category: 'dairy-bread',
    price: 48,
    oldPrice: 55,
    discount: 12,
    weight: '6 pcs',
    rating: 4.6,
    reviewsCount: 1540,
    image: 'https://images.unsplash.com/photo-1516448424440-9dbca97779c1?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1516448424440-9dbca97779c1?auto=format&fit=crop&q=80&w=600'
    ],
    inStock: true,
    badge: '12% OFF',
    description: 'High-quality table eggs, farm-fresh and source of high protein. Checked and safely packaged in pulp trays.',
    nutrition: {
      energy: '143 kcal',
      protein: '12.6 g',
      carbs: '0.7 g',
      fat: '9.5 g',
      fiber: '0.0 g'
    },
    eta: '9 mins'
  },
  {
    id: '8',
    name: 'Whole Wheat Brown Bread',
    category: 'dairy-bread',
    price: 45,
    oldPrice: 50,
    discount: 10,
    weight: '400 g',
    rating: 4.4,
    reviewsCount: 920,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600'
    ],
    inStock: true,
    badge: '10% OFF',
    description: 'Soft and healthy whole wheat bread slices. Baked fresh daily, rich in dietary fibers.',
    nutrition: {
      energy: '250 kcal',
      protein: '8.5 g',
      carbs: '49.0 g',
      fat: '2.0 g',
      fiber: '6.5 g'
    },
    eta: '10 mins'
  },
  {
    id: '9',
    name: 'India Magic Masala Potato Chips',
    category: 'snacks-munchies',
    price: 20,
    oldPrice: 20,
    discount: 0,
    weight: '50 g',
    rating: 4.8,
    reviewsCount: 8900,
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=600'
    ],
    inStock: true,
    badge: 'Popular',
    description: 'Spiced potato chips with classic Indian flavors. Perfectly crispy and satisfyingly spicy crunch.',
    nutrition: {
      energy: '544 kcal',
      protein: '7.0 g',
      carbs: '53.0 g',
      fat: '33.0 g',
      fiber: '2.0 g'
    },
    eta: '8 mins'
  },
  {
    id: '10',
    name: 'Coca Cola Can',
    category: 'beverages',
    price: 38,
    oldPrice: 40,
    discount: 5,
    weight: '330 ml',
    rating: 4.7,
    reviewsCount: 4210,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600'
    ],
    inStock: true,
    badge: '5% OFF',
    description: 'Carbonated cold soft drink. Serve chilled for refreshing sparkling sweetness and kick.',
    nutrition: {
      energy: '42 kcal',
      protein: '0.0 g',
      carbs: '10.6 g',
      fat: '0.0 g',
      fiber: '0.0 g'
    },
    eta: '9 mins'
  },
  {
    id: '11',
    name: 'Sprite Can',
    category: 'beverages',
    price: 38,
    oldPrice: 40,
    discount: 5,
    weight: '330 ml',
    rating: 4.5,
    reviewsCount: 1980,
    image: 'https://images.unsplash.com/photo-1625772290748-160b6ae90b52?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1625772290748-160b6ae90b52?auto=format&fit=crop&q=80&w=600'
    ],
    inStock: true,
    badge: '5% OFF',
    description: 'Crisp, clear, lemon-lime sparkling mocktail soda. Serve ice cold for the ultimate thirst quencher.',
    nutrition: {
      energy: '39 kcal',
      protein: '0.0 g',
      carbs: '9.8 g',
      fat: '0.0 g',
      fiber: '0.0 g'
    },
    eta: '9 mins'
  },
  {
    id: '12',
    name: 'Instant Atta Noodles',
    category: 'snacks-munchies',
    price: 26,
    oldPrice: 30,
    discount: 13,
    weight: '280 g',
    rating: 4.3,
    reviewsCount: 1320,
    image: 'https://images.unsplash.com/photo-1612966608967-302915b06f2e?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1612966608967-302915b06f2e?auto=format&fit=crop&q=80&w=600'
    ],
    inStock: true,
    badge: '13% OFF',
    description: 'Delicious whole-wheat (atta) noodles packed with yummy veggies and spices. Ready in 2-3 minutes.',
    nutrition: {
      energy: '350 kcal',
      protein: '9.2 g',
      carbs: '65.0 g',
      fat: '12.0 g',
      fiber: '4.8 g'
    },
    eta: '10 mins'
  },
  {
    id: '13',
    name: 'Organic Red Tomatoes',
    category: 'fruits-veg',
    price: 36,
    oldPrice: 40,
    discount: 10,
    weight: '500 g',
    rating: 4.1,
    reviewsCount: 890,
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=600'
    ],
    inStock: true,
    badge: '10% OFF',
    description: 'Juicy, plump tomatoes grown organically. Ideal for salads, gravies, and soups.',
    nutrition: {
      energy: '18 kcal',
      protein: '0.9 g',
      carbs: '3.9 g',
      fat: '0.2 g',
      fiber: '1.2 g'
    },
    eta: '11 mins'
  },
  {
    id: '14',
    name: 'Fresh Bell Peppers (Trio)',
    category: 'fruits-veg',
    price: 79,
    oldPrice: 99,
    discount: 20,
    weight: '3 pcs (approx. 500g)',
    rating: 4.7,
    reviewsCount: 650,
    image: 'https://images.unsplash.com/photo-1563565088-91341d11aab1?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1563565088-91341d11aab1?auto=format&fit=crop&q=80&w=600'
    ],
    inStock: false,
    badge: 'Out of Stock',
    description: 'A pack of three bell peppers (Red, Yellow, and Green). Crisp, sweet, and ideal for stir fries or salads.',
    nutrition: {
      energy: '20 kcal',
      protein: '0.9 g',
      carbs: '4.6 g',
      fat: '0.2 g',
      fiber: '1.7 g'
    },
    eta: 'Out of Stock'
  }
];

export const TESTIMONIALS = [
  {
    id: '1',
    name: 'Sarah K.',
    role: 'Working Mom',
    comment: 'Instantly delivering grocery in 10 minutes saves me every evening! The vegetables are always super fresh, even fresher than the local shop.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: '2',
    name: 'Rohan Sharma',
    role: 'Tech Engineer',
    comment: 'The user interface is slick, especially dark mode. Redux checkout is so fast. Applying coupons literally updates the billing in real-time!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: '3',
    name: 'Elena D.',
    role: 'Nutritionist',
    comment: 'I love that every product displays detailed nutrition facts. The quality of organic bananas and guavas is top-tier!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100'
  }
];

export const MOCK_COUPONS = [
  { code: 'FRESH50', discountType: 'fixed', value: 50, minCart: 200, description: 'Flat ₹50 Off on orders above ₹200' },
  { code: 'ZETOP100', discountType: 'percentage', value: 15, maxDiscount: 100, minCart: 300, description: '15% Off (Up to ₹100) on orders above ₹300' },
  { code: 'FREECOMMUNITY', discountType: 'delivery', value: 0, description: 'Free Delivery for first 5 orders' }
];
