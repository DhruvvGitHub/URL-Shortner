import { UAParser } from "ua-parser-js";
import supabase from "./supabase";

export async function getUrls(user_id) {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to load URLs");
  }

  return data;
}

export async function deleteUrl(id) {
  const { data, error } = await supabase.from("urls").delete("").eq("id", id);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to delete URL");
  }

  return data;
}

export async function createUrl(
  { title, longUrl, customUrl, user_id },
  qrcode
) {
  const short_url = Math.random().toString(36).substring(2, 6);
  const fileName = `qr-${short_url}`;
  
  const { error: storageError } = await supabase.storage
    .from("qrs")
    .upload(fileName, qrcode);

  if (storageError) {
    console.error("Storage upload error:", storageError);
    throw new Error(storageError.message);
  }

  // Use the environment variable directly for the Supabase URL
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;

  const { data, error } = await supabase
    .from("urls")
    .insert([
      {
        title,
        original_url: longUrl,
        custom_url: customUrl,
        user_id,
        short_url,
        qr,
      },
    ])
    .select()

  if (error) {
    console.error(error.message);
    throw new Error("Error creating short URL");
  }
  
  return data;
}


export async function getLongUrl(id) {
  const { data, error } = await supabase
    .from("urls")
    .select("id, original_url")
    .or(`short_url.eq.${id}, custom_url.eq.${id}`)
    .single();

  if (error) {
    console.error(error.message);
    throw new Error("Error fetching short URL");
  }

  return data;
}


export async function getUrl(id, user_id) {
  console.log("getUrl called with:", { 
    id, 
    user_id, 
    idType: typeof id, 
    user_idType: typeof user_id,
    idValue: JSON.stringify(id),
    user_idValue: JSON.stringify(user_id)
  });
  
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();

  if (error) {
    console.error("Supabase error:", error);
    throw new Error("Short URL not found");
  }

  console.log("getUrl result:", data);
  return data;
}