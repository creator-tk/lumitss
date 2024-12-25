import SearchResults from '@/components/SearchResults';
import ViewProduct from '@/components/ViewProduct';
import React from 'react'

const page = async ({params, searchParams}:{params:string; searchParams: string}) => {

  const type = ((await params)?.type as string) || ""

  const searchText = ((await searchParams)?.query as string) || ""

  const searchProduct = ((await searchParams)?.product as string) || "" 

  console.log(searchProduct)

  let content;
  if(type === "search"){
    content = <SearchResults query={searchText}/>
  }else if(type === "viewProduct"){
    content = <ViewProduct productId={searchProduct}/>
  }

  return (
    <div>{content}</div>
  )
}

export default page