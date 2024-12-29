import SearchResults from '@/components/SearchResults';
import ViewProduct from '@/components/ViewProduct';
import React from 'react';


const page = async ({ params, searchParams }: SearchParamProps) => {
  const type = ((await params)?.type as string) || '';

  const searchText = ((await searchParams)?.query as string) || '';

  const productId = ((await searchParams)?.product as string) || '';

  let content;

  if (type === 'search') {
    content = <SearchResults query={searchText} />;
  } else if (type === 'viewProduct' && productId) {
    content = <ViewProduct productId={productId} />;
  } else {
    content = <p>Invalid type or missing parameters</p>;
  }

  return <div>{content}</div>;
};

export default page;
