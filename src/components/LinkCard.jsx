import React from "react";
import { Card } from "./ui/card";
import { Link } from "react-router-dom";
import { Copy, Delete, Download, Trash } from "lucide-react";
import { Button } from "./ui/button";
import useFetch from "@/hooks/useFetch";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";

const LinkCard = ({ url, fetchUrls }) => {

    const downloadImage = () => {
        const imageUrl = url?.qr
        const fileName = url?.title

        const anchor = document.createElement("a")
        anchor.href = imageUrl
        anchor.download = fileName

        document.body.appendChild(anchor)
        anchor.click()
        document.body.removeChild(anchor)
    } 

    const {loading:loadingDelete, fn:fnDelete} = useFetch(deleteUrl, url?.id)


  return (
    <Card className="flex flex-col md:flex-row justify-between px-4">
      <div className="flex gap-4">
        <div>
          {url?.qr ? (
            <img 
              className="h-28 object-contain" 
              src={url?.qr} 
              alt="qr code" 
              onError={(e) => {
                console.error("QR code failed to load:", url.qr);
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="h-28 w-28 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
              QR Code Not Available
            </div>
          )}
        </div>
        <Link to={`/link/${url.id}`} className="flex flex-col">
          <span className="text-xl md:text-3xl font-semibold">{url.title}</span>
          <span className="text-blue-400">
            Trimmed URL: https://trimrr.in/
            {url?.custom_url ? url?.custom_url : url.short_url}
          </span>
          <span>{url.original_url}</span>
          <span className="flex items-end flex-1">
            {new Date(url?.created_at).toLocaleDateString()}
          </span>
        </Link>
      </div>
      <div className="flex md:flex-col items-center gap-6">
        <div>
          <Button
            onClick={() =>
              navigator.clipboard.writeText(
                `https://trimrr.in/${url?.custom_url ? url?.custom_url : url.short_url}`
              )
            }
            variant="ghost"
          >
            <Copy />
          </Button>
        </div>
        <div>
          <Button onClick={downloadImage} variant="ghost">
            <Download />
          </Button>
        </div>
        <div>
          <Button onClick={() => fnDelete().then(() => fetchUrls())}  variant="ghost">
            {loadingDelete ? <BeatLoader /> : <Trash />}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default LinkCard;
