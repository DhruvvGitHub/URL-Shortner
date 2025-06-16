import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import Error from "@/components/error/Error";
import useFetch from "@/hooks/useFetch";
import { UrlState } from "@/Context";
import { getClicksForUrls } from "@/db/apiClicks";
import { getUrls } from "@/db/apiUrls";
import LinkCard from "@/components/LinkCard";

const Dashborad = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const {user} = UrlState()
  const {loading, error, data:urls, fn:fnUrls} = useFetch(getUrls, user?.id)
  const {loading:loadingClicks, data:clicks, fn:fnClicks} = useFetch(getClicksForUrls,urls?.map((url) => url.id))

  useEffect(() => {
    fnUrls()
  },[])

  useEffect(() => {
    if(urls?.length) fnClicks()
    fnUrls()
  },[urls?.length])

  const filteredUrls = urls?.filter((url) => 
  url.title.toLowerCase().includes(searchQuery.toLowerCase())
)
console.log(urls);

  return (
    <div className="flex flex-col gap-8">
      <div>{loading || loadingClicks && <BarLoader width={"100%"} color="bg-[#A3E635]" />}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{urls?.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{clicks?.length}</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex items-center justify-between">
        <h1>My Links</h1>
        <Button>Create Link</Button>
      </div>
      <div className="relative">
        <Input onChange={(e) => setSearchQuery(e.target.value)} type="text" value={searchQuery} placeholder="Filter Links" />
        <Filter size={20} className="absolute top-2 right-2" />
      </div>
      {error && <Error message={error?.message} />}
      {(filteredUrls || []).map((url, i) => {
        return <LinkCard key={i} url={url} fetchUrls={fnUrls} />
      })}
    </div>
  );
};

export default Dashborad;
