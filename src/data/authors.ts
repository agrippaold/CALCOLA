/**
 * Author data for E-E-A-T trust signals.
 * Each author has credentials relevant to their content category.
 */

export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  categories: string[];
  credentials: string[];
}

export const AUTHORS: Record<string, Author> = {
  'marco-finelli': {
    id: 'marco-finelli',
    name: 'Marco Finelli',
    role: 'Financial Analyst',
    bio: 'Marco has 8 years of experience in credit advisory and financial analysis. He specializes in mortgage calculations, investment modeling, and personal finance tools.',
    categories: ['finance'],
    credentials: [
      'Certified Financial Analyst',
      '8 years credit advisory experience',
      'Published in Journal of Financial Planning',
    ],
  },
  'sara-vitali': {
    id: 'sara-vitali',
    name: 'Dr. Sara Vitali',
    role: 'Nutritional Biologist',
    bio: 'Dr. Vitali holds a PhD in nutritional biology with a specialization in dietology. She develops and validates health calculators based on peer-reviewed clinical research.',
    categories: ['health'],
    credentials: [
      'PhD in Nutritional Biology',
      'Specialization in Dietology',
      'Published researcher in clinical nutrition',
    ],
  },
  'luca-bernardi': {
    id: 'luca-bernardi',
    name: 'Prof. Luca Bernardi',
    role: 'Applied Mathematics Professor',
    bio: 'Prof. Bernardi teaches applied mathematics at university level and develops computational tools for education. His focus is making complex formulas accessible to everyone.',
    categories: ['math', 'education'],
    credentials: [
      'Professor of Applied Mathematics',
      '15 years teaching experience',
      'Author of 3 mathematics textbooks',
    ],
  },
  'elena-rossi': {
    id: 'elena-rossi',
    name: 'Elena Rossi',
    role: 'Software Engineer',
    bio: 'Elena is a software engineer with 10 years of experience in web development. She leads the technical development of CalcHub calculators and ensures accuracy across all tools.',
    categories: ['text', 'conversion', 'date', 'construction', 'physics'],
    credentials: [
      'MSc in Computer Science',
      '10 years web development experience',
      'Full-stack engineer',
    ],
  },
};

/**
 * Get the author for a given content category.
 */
export function getAuthorForCategory(category: string): Author {
  const author = Object.values(AUTHORS).find((a) =>
    a.categories.includes(category)
  );
  return author || AUTHORS['elena-rossi'];
}
