const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const imageUrls = [
  'https://images.unsplash.com/photo-1550206574-42cfa61e2a9d?q=80&w=2526&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1723646743440-0996da5ced6e?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1601758176175-45914394491c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1601758124096-1fd661873b95?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1601758176559-76c75ead317a?q=80&w=2576&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1601758063541-d2f50b4aafb2?q=80&w=2605&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1601758002737-1919f3ba2774?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1601758261049-55d060e1159a?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1601758177266-bc599de87707?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1601758124277-f0086d5ab050?q=80&w=2710&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1601758063890-1167f394febb?q=80&w=2602&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?q=80&w=2428&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

const categories = [
  'Entrenadores',
  'Hoteles',
  'Paseadores',
  'Peluqueria',
  'Petfriendly',
  'Productos',
  'Servicios',
  'Veterinarios',
];

function getRandomImages(count) {
  const shuffled = [...imageUrls].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function createBlog(category, index) {
  const title = `${index + 1}. Consejos para ${category}`;
  const slug = generateSlug(title);
  const images = getRandomImages(4);

  const blog = await prisma.blog.create({
    data: {
      title,
      slug,
      metaTitle: `Mejores ${category} para mascotas | Directorio.pet`,
      metaDescription: `Descubre los mejores consejos para elegir ${category} para tu mascota. Guía completa en Directorio.pet`,
      introduction: `En este artículo, exploraremos los aspectos más importantes a considerar al elegir ${category} para tu mascota. Ya sea que tengas un perro, gato u otra mascota, estos consejos te ayudarán a tomar la mejor decisión.`,
      categoryName: category,
      publishedAt: new Date(),
      tocItems: {
        create: [
          { title: 'Importancia de elegir bien', order: 1 },
          { title: 'Factores a considerar', order: 2 },
          { title: 'Beneficios para tu mascota', order: 3 },
          { title: 'Cómo elegir al mejor profesional', order: 4 },
          { title: 'Preguntas frecuentes', order: 5 },
        ],
      },
      contentSections: {
        create: [
          {
            title: 'Importancia de elegir bien',
            content: `Elegir los ${category} adecuados es fundamental para el bienestar de tu mascota. Una buena elección puede mejorar significativamente la calidad de vida de tu compañero peludo, mientras que una mala decisión puede tener consecuencias negativas.`,
            order: 1,
          },
          {
            title: 'Factores a considerar',
            content: `Al elegir ${category}, debes tener en cuenta varios factores como la experiencia, las referencias, los métodos utilizados y la compatibilidad con tu mascota. Cada animal es único, por lo que es importante encontrar una opción que se adapte a sus necesidades específicas.`,
            order: 2,
          },
          {
            title: 'Beneficios para tu mascota',
            content: `Los ${category} adecuados pueden proporcionar numerosos beneficios a tu mascota, incluyendo mejor salud, mayor felicidad y una relación más fuerte contigo. Invertir en servicios de calidad es una forma de demostrar amor y cuidado hacia tu compañero animal.`,
            order: 3,
          },
          {
            title: 'Cómo elegir al mejor profesional',
            content: `Para elegir el mejor ${category}, investiga sus credenciales, lee reseñas de otros clientes, programa una consulta inicial y observa cómo interactúan con tu mascota. La comunicación clara y la confianza son clave en esta relación.`,
            order: 4,
          },
        ],
      },
      faqs: {
        create: [
          {
            question: `¿Con qué frecuencia debo utilizar los servicios de ${category}?`,
            answer: `La frecuencia depende de las necesidades específicas de tu mascota y el tipo de servicio. Consulta con el profesional para establecer un plan adecuado.`,
            order: 1,
          },
          {
            question: `¿Cómo sé si mi mascota está cómoda con el ${category} elegido?`,
            answer: `Observa el comportamiento de tu mascota. Si se muestra relajada y feliz durante y después de las sesiones, es una buena señal. En caso contrario, considera buscar otras opciones.`,
            order: 2,
          },
          {
            question: `¿Qué debo hacer si no estoy satisfecho con el servicio?`,
            answer: `Comunica tus preocupaciones al profesional. Si no se resuelven, no dudes en buscar otras alternativas. La prioridad es el bienestar de tu mascota.`,
            order: 3,
          },
        ],
      },
      conclusion: `Elegir los ${category} adecuados es una decisión importante que afecta directamente la calidad de vida de tu mascota. Tómate el tiempo necesario para investigar y encontrar la mejor opción. Recuerda que una mascota feliz y saludable es el resultado de un cuidado dedicado y profesional.`,
      images: {
        create: images.map((url, index) => ({
          url,
          alt: `Imagen ilustrativa para ${category} - ${index + 1}`,
          order: index + 1,
        })),
      },
    },
  });

  console.log(`Created blog: ${blog.title}`);
}

async function main() {
  for (const category of categories) {
    for (let i = 0; i < 5; i++) {
      await createBlog(category, i);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
