import { UrlState } from "@/Context";
import React, { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import Error from "./error/Error";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import * as Yup from "yup";
import useFetch from "@/hooks/useFetch";
import { QRCode } from "react-qrcode-logo";
import { createUrl } from "@/db/apiUrls";

const CreateLink = () => {
  const { user } = UrlState();
  const navigate = useNavigate();
  const ref = useRef()
  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState([]);
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink ? longLink : "",
    customurl: "",
  });

  const schema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    longUrl: Yup.string()
      .url("Please enter a valid URL")
      .required("URL is required"),
    customUrl: Yup.string(),
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const {loading, error, data, fn:fnCreateUrl} = useFetch(createUrl, {...formValues, user_id:user.id})

  const createNewLink = () => {
    setErrors([])
    try {
        
    } catch (error) {
        console.log(error);
    }
  }

  return (
      <Dialog defaultOpen={longLink} onOpenChange={(res) => {if(
        !res) setSearchParams({})}} >
        <DialogTrigger>Create New Link</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New</DialogTitle>
          </DialogHeader>
          {formValues.longUrl && <QRCode value={formValues.longUrl} size={200} ref={ref} /> }
          <div>
            <Input
              onChange={handleChange}
              id="title"
              value={formValues.title}
              type="text"
              placeholder="Short link title"
            />
            <Error message={"some error"} />
          </div>
          <div>
            <Input
              onChange={handleChange}
              id="longUrl"
              value={formValues.longUrl}
              type="text"
              placeholder="Enter your looong link"
            />
            <Error message={"some error"} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Card className="p-2">trimit</Card>
              <span>/</span>
              <Input onChange={handleChange} id="customurl" value={formValues.customurl} type="text" placeholder="Custom Link (Optional)" />
            </div>
            <Error message={"some error"} />
          </div>
          <DialogFooter cla>
            <Button className="sm:w-fit">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
};

export default CreateLink;