import SearchResults from '@/components/SearchResults';
import ViewProduct from '@/components/ViewProduct';
import React from 'react';

// Define the props interface
interface PageProps {
  params: Promise<{ type: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
}


const Page = async ({ params, searchParams }: PageProps) => {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const type = resolvedParams?.type || '';
  const searchText = (resolvedSearchParams.query as string) || '';
  const searchProduct = (resolvedSearchParams.product as string) || '';

  let content;

  if (type === 'search') {
    content = <SearchResults query={searchText}/>;
  } else if (type === 'viewProduct') {
    content = <ViewProduct productId={searchProduct} />;
  } else {
    content = <div>No content available</div>;
  }

  return <div>{content}</div>;
};

export default Page;
