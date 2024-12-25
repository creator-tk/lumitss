import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { appWriteConfig } from "./appwrite/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseStringify = (value: unknown) =>
  JSON.parse(JSON.stringify(value));

export const constructImageUrl = (bucketFileId:string)=>{
  return `${appWriteConfig.endpointUrl}/storage/buckets/${appWriteConfig.bucketId}/files/${bucketFileId}/view?project=${appWriteConfig.projectId}&mode=admin`
}

export const formateDateTime = (dateString, daysToAdd = 0) => {

  if (!dateString) return "-";

  const date = new Date(dateString);
  date.setDate(date.getDate() + daysToAdd);

  // let hours = date.getHours();
  // const minutes = date.getMinutes();
  // const period = hours >= 12 ? "pm" : "am";

  // hours = hours % 12 || 12;

  // const time = `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;

  const day = date.getDate();
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const month = monthNames[date.getMonth()];

  return `${day} ${month}`;
};



