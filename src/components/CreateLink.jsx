import { UrlState } from "@/Context";
import React, { useEffect, useRef, useState } from "react";
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
import { BeatLoader } from "react-spinners";

const CreateLink = () => {
  const { user } = UrlState();
  const navigate = useNavigate();
  const ref = useRef();
  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState([]);
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
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
  
  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, { ...formValues, user_id: user.id, customUrl: formValues.customUrl || "" });

  useEffect(() => {
    if(error === null && data) {
        navigate(`/link/${data[0].id}`)
    }
  },[error, data])

  const createNewLink = async () => {
    setErrors([]);
    try {
        await schema.validate(formValues, {abortEarly: false})
        const canvas = ref.current.canvasRef.current
        const blob = await new Promise((resolve) => canvas.toBlob(resolve))

        // Pass only the blob as the additional argument
        await fnCreateUrl(blob)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog
      defaultOpen={longLink}
      onOpenChange={(res) => {
        if (!res) setSearchParams({});
      }}
    >
      <DialogTrigger asChild>
  <Button>Create New Link</Button>
</DialogTrigger>

      <DialogContent >
        <DialogHeader>
  <DialogTitle>Create New</DialogTitle>
  <DialogDescription>Enter details below to create a shortened link</DialogDescription>
</DialogHeader>

        {formValues.longUrl && (
          <QRCode value={formValues.longUrl} size={200} ref={ref} />
        )}
        <div>
          <Input
            onChange={handleChange}
            name="title"
            id="title"
            value={formValues.title}
            type="text"
            placeholder="Short link title"
          />
          {errors.title && <Error message={errors.title} /> }
        </div>
        <div>
          <Input
            onChange={handleChange}
            name="longUrl"
            id="longUrl"
            value={formValues.longUrl}
            type="text"
            placeholder="Enter your looong link"
          />
          {errors.longUrl && <Error message={errors.longUrl} /> }
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Card className="p-2">trimit</Card>
            <span>/</span>
            <Input
              onChange={handleChange}
              name="customUrl"
              id="customUrl"
              value={formValues.customUrl}
              type="text"
              placeholder="Custom Link (Optional)"
            />
          </div>
        </div>
          {error && <Error message={error.message} /> }
        <DialogFooter>
          <Button onClick={createNewLink} disabled={loading} className="sm:w-fit">
            {loading ? <BeatLoader color="white" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLink;
