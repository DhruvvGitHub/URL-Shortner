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


const parser = new UAParser()

export const storeClicks = async ({id, originalUrl}) => {
  try {
    const res = parser.getResult();
    const device = res.type || "desktop"; // Default to desktop if type is not detected

    // Try to get location data, but don't fail if it doesn't work
    let city = "Unknown";
    let country = "Unknown";
    try {
      const response = await fetch("https://ipapi.co/json");
      const locationData = await response.json();
      city = locationData.city || "Unknown";
      country = locationData.country_name || "Unknown";
    } catch (locationError) {
      console.warn("Could not fetch location data:", locationError);
    }

    // Record the click
    try {
      await supabase.from("clicks").insert({
        url_id: id,
        city: city,
        country: country,
        device: device,
      });
    } catch (clickError) {
      console.warn("Could not record click:", clickError);
    }

    // Always redirect to the original URL
    if (originalUrl) {
      window.location.href = originalUrl;
    } else {
      console.error("No original URL provided for redirect");
    }
  } catch (error) {
    console.error("Error in storeClicks:", error);
    // Still try to redirect even if everything else fails
    if (originalUrl) {
      window.location.href = originalUrl;
    }
  }
};