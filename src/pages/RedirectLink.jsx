import {storeClicks} from "@/db/apiUrls";
import {getLongUrl} from "@/db/apiUrls";
import useFetch from "@/hooks//useFetch";
import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {BarLoader} from "react-spinners";

const RedirectLink = () => {
  const {id} = useParams();

  const {loading, data, fn} = useFetch(getLongUrl, id);

  useEffect(() => {
    console.log("RedirectLink: Fetching URL for ID:", id);
    fn();
  }, []);

  useEffect(() => {
    if (!loading && data && data.original_url) {
      console.log("RedirectLink: Found URL data:", data);
      console.log("RedirectLink: Redirecting to:", data.original_url);
      // Call storeClicks directly since it handles the redirect
      storeClicks({
        id: data.id,
        originalUrl: data.original_url,
      });
    } else if (!loading && data) {
      console.log("RedirectLink: Data found but no original_url:", data);
    } else if (!loading && !data) {
      console.log("RedirectLink: No data found for ID:", id);
    }
  }, [loading, data]);

  // Show loading while fetching data
  if (loading) {
    return (
      <>
        <BarLoader width={"100%"} color="#36d7b7" />
        <br />
        Redirecting...
      </>
    );
  }

  // If we have data but no original URL, show error
  if (data && !data.original_url) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Link Not Found</h1>
        <p className="text-gray-600">The shortened URL you're looking for doesn't exist.</p>
      </div>
    );
  }

  // If no data and not loading, show error
  if (!loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Link Not Found</h1>
        <p className="text-gray-600">The shortened URL you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <>
      <BarLoader width={"100%"} color="#36d7b7" />
      <br />
      Redirecting to {data?.original_url}...
    </>
  );
};

export default RedirectLink;