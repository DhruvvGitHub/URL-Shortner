import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {

  const [longURL, setlongURL] = useState("")
  const navigate = useNavigate()

  const handleShorten = (e) => {
    e.preventDefault()
    if(longURL) navigate(`/auth?createNew=${longURL}`)
  }

  return (
    <div className="flex flex-col items-center mt-20">
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
          The Smart Way to Share URLs.
        </h2>
      </div>
      <div className="w-full">
        <form
        onSubmit={handleShorten}
          action=""
          className="flex flex-col justify-center sm:flex-row gap-2"
        >
          <Input
          onChange={(e) => setlongURL(e.target.value)}
            type="url"
            value={longURL}
            placeholder="Enter the URL you want to shorten"
            className="w-full sm:w-2/4"
          ></Input>
          <Button className="bg-[#A3E635]">Shorten</Button>
        </form>
      </div>
      <div className="mt-8">
<img
  className="w-full h-auto"
  src="/assets/main_img.png"
  alt="URL Shortener illustration"
/>

      </div>
      <div className="w-full">
        <Accordion type="multiple" collapsible className="w-full">
          {/* 1. How does it work? */}
          <AccordionItem value="item-1">
            <AccordionTrigger>
              How does the URL shortener work?
            </AccordionTrigger>
            <AccordionContent>
              Simply paste your long URL into the input box, and we'll generate
              a short, unique link you can copy and share. When someone clicks
              it, they'll be redirected to the original page.
            </AccordionContent>
          </AccordionItem>

          {/* 2. Is it free? */}
          <AccordionItem value="item-2">
            <AccordionTrigger>Is this service free to use?</AccordionTrigger>
            <AccordionContent>
              Yes, it's 100% free for regular use. You can shorten unlimited
              links without creating an account. Premium features may be
              available later for advanced tracking and analytics.
            </AccordionContent>
          </AccordionItem>

          {/* 3. Can I track my links? */}
          <AccordionItem value="item-3">
            <AccordionTrigger>
              Can I track clicks on my shortened URLs?
            </AccordionTrigger>
            <AccordionContent>
              Yes! If you create an account, you can view analytics like total
              clicks, geographic location, and referral sources for each of your
              shortened links.
            </AccordionContent>
          </AccordionItem>

          {/* 4. Do the links expire? */}
          <AccordionItem value="item-4">
            <AccordionTrigger>
              Do the shortened links ever expire?
            </AccordionTrigger>
            <AccordionContent>
              By default, links never expire. However, you can optionally set an
              expiration date or click limit if you want the link to become
              inactive after a certain time or number of uses.
            </AccordionContent>
          </AccordionItem>

          {/* 5. Is it secure? */}
          <AccordionItem value="item-5">
            <AccordionTrigger>
              Is it secure to use this service?
            </AccordionTrigger>
            <AccordionContent>
              Yes. We use HTTPS encryption to ensure all data is transmitted
              securely. Malicious or phishing links are automatically flagged
              and blocked.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default LandingPage;
