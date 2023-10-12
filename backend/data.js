import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Basir',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'John',
      email: 'user@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
  products: [
    {
      //_id: '1',
      name: 'Nike Slim shirt',
      slug: 'nike-slim-shirt',
      category: 'Shirts',
      image: '/images/p1.jpg',
      price: 120,
      countInStock: 0,
      brand: 'Nike',
      rating: 1.0,
      numReviews: 10,
      description: 'high quality shirt',
    },
    {
      //_id: '2',
      name: 'Adidas Fit shirt',
      slug: 'adidas-fit-shirt',
      category: 'Shirts',
      image: '/images/p2.jpg',
      price: 250,
      countInStock: 20,
      brand: 'Adidas',
      rating: 2.0,
      numReviews: 10,
      description: 'high quality shirt',
    },
    {
      // _id: '3',
      name: 'Nike Slim Pant',
      slug: 'nike-slim-pant',
      category: 'Pants',
      image: '/images/p3.jpg',
      price: 25,
      countInStock: 15,
      brand: 'Nike',
      rating: 3.0,
      numReviews: 14,
      description: 'high quality product',
    },
    {
      //_id: '4',
      name: 'Adidas Fit Pant',
      slug: 'adidas-fit-pant',
      category: 'Pants',
      image: '/images/p4.jpg',
      price: 65,
      countInStock: 5,
      brand: 'Puma',
      rating: 4.0,
      numReviews: 10,
      description: 'high quality pan',
    },
  ],
};

export default data;
