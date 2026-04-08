import CategoryPageClient from './CategoryPageClient';
import { getAllCategories } from '@/lib/skills-data-server';

export function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map(category => ({ category }));
}

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  return <CategoryPageClient params={params} />;
}
