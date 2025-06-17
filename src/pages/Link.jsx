import DeviceStats from "@/components/DeviceStats";
import LocationStats from "@/components/LocationStats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlState } from "@/Context";
import { getClicksForUrls } from "@/db/apiClicks";
import { deleteUrl, getUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/useFetch";
import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader, BeatLoader } from "react-spinners";

// Wrapper function to match useFetch pattern
const getUrlWrapper = (options, id, user_id) => {
  return getUrl(id, user_id);
};

const Link = () => {
  const [showError, setShowError] = useState(false);
  
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;

    // Create an anchor element
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;

    // Append the anchor to the body
    document.body.appendChild(anchor);

    // Trigger the download by simulating a click event
    anchor.click();

    // Remove the anchor from the document
    document.body.removeChild(anchor);
  };
  const navigate = useNavigate();
  const {user, loading: userLoading} = UrlState();
  const {id} = useParams();
  const {
    loading,
    data: url,
    fn,
    error,
  } = useFetch(getUrlWrapper);

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrls);

  const {loading: loadingDelete, fn: fnDelete} = useFetch(deleteUrl);

  useEffect(() => {
    console.log("Link component - user:", user, "userLoading:", userLoading, "id:", id, "id type:", typeof id);
    if (user?.id && id && !userLoading) {
      console.log("Making API call with:", id, user.id);
      // Ensure id is a valid number
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        console.error("Invalid ID:", id);
        setShowError(true);
        return;
      }
      fn(numericId, user.id);
    }
  }, [user?.id, id, userLoading]);

  useEffect(() => {
    console.log("Stats effect - error:", error, "loading:", loading, "url:", url);
    if (!error && loading === false && url) {
      console.log("Fetching stats for URL:", url.id);
      fnStats(url.id);
    }
  }, [error, loading, url]);

  // Handle error more gracefully
  useEffect(() => {
    console.log("Error effect - error:", error, "loading:", loading, "userLoading:", userLoading);
    if (error && !loading && !userLoading) {
      console.log("Error occurred:", error);
      setShowError(true);
      // Don't redirect immediately, let user see the error
    }
  }, [error, loading, userLoading]);

  // Don't render anything while user is loading
  if (userLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <BarLoader width={"100%"} color="#36d7b7" />
      </div>
    );
  }

  // Show error message instead of redirecting
  if (showError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <h2 className="text-2xl font-bold text-red-600">Link Not Found</h2>
        <p className="text-gray-600">The link you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button onClick={() => navigate("/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  let link = "";
  if (url) {
    link = url?.custom_url ? url?.custom_url : url.short_url;
  }

  return (
    <>
      {(loading || loadingStats) && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}
      <div className="flex flex-col gap-8 sm:flex-row justify-between">
        <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5">
          <span className="text-6xl font-extrabold hover:underline cursor-pointer">
            {url?.title}
          </span>
          <a
            href={`https://trimrr.in/${link}`}
            target="_blank"
            className="text-3xl sm:text-4xl text-blue-400 font-bold hover:underline cursor-pointer"
          >
            https://trimrr.in/{link}
          </a>
          <a
            href={url?.original_url}
            target="_blank"
            className="flex items-center gap-1 hover:underline cursor-pointer"
          >
            <LinkIcon className="p-1" />
            {url?.original_url}
          </a>
          <span className="flex items-end font-extralight text-sm">
            {new Date(url?.created_at).toLocaleString()}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() =>
                navigator.clipboard.writeText(`https://trimrr.in/${link}`)
              }
            >
              <Copy />
            </Button>
            <Button variant="ghost" onClick={downloadImage}>
              <Download />
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                fnDelete(url.id).then(() => {
                  navigate("/dashboard");
                })
              }
              disable={loadingDelete}
            >
              {loadingDelete ? (
                <BeatLoader size={5} color="white" />
              ) : (
                <Trash />
              )}
            </Button>
          </div>
          <img
            src={url?.qr}
            className="w-full self-center sm:self-start ring ring-blue-500 p-1 object-contain"
            alt="qr code"
          />
        </div>

        <Card className="sm:w-3/5">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold">Stats</CardTitle>
          </CardHeader>
          {stats && stats.length ? (
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{stats?.length}</p>
                </CardContent>
              </Card>

              <CardTitle>Location Data</CardTitle>

              <CardTitle>Device Info</CardTitle>

            </CardContent>
          ) : (
            <CardContent>
              {loadingStats === false
                ? "No Statistics yet"
                : "Loading Statistics.."}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
};

export default Link;