import React from 'react'

const page = async ({params}:SearchParamsProps) => {
  const type = ((await params)?.type as string) || ""

  return (
    <div>{type}</div>
  )
}

export default page