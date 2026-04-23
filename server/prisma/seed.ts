import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const stickers = [
    { name: 'The Hardcore Gopher', price: 5, imageUrl: '/assets/images/gopher.png', category: 'Go Lang', stock: 100 },
    { name: 'Safe & Fast Ferris', price: 5, imageUrl: '/assets/images/ferris.png', category: 'Rust', stock: 100 },
    { name: 'Root Kitty', price: 6, imageUrl: '/assets/images/cat.png', category: 'Hacking', stock: 100 },
    { name: 'Cyber Serpent', price: 5, imageUrl: '/assets/images/python.png', category: 'Python', stock: 100 },
    { name: 'Async Master', price: 5, imageUrl: '/assets/images/js.png', category: 'JavaScript', stock: 100 },
  ];

  for (const sticker of stickers) {
    await prisma.sticker.create({
      data: sticker,
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
