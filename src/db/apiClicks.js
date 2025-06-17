import { UAParser } from "ua-parser-js";
import supabase from "./supabase";

export async function getClicksForUrls(urlIds) {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to load clicks");
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


export async function getClickForUrl(url_id) {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id", url_id)

  if (error) {
    console.error(error.message);
    throw new Error("Unable to load stats");
  }

  return data;
}