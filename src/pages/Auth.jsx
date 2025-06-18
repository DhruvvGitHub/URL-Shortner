import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/auth/Login";
import SignUp from "@/components/auth/SignUp";
import { UrlState } from "@/Context";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const navigate = useNavigate();
  const { isAuthenticated, loading } = UrlState();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [isAuthenticated, loading, navigate, longLink]);

  if (loading) return null;
  if (isAuthenticated) return null;

  return (
    <div className="w-full mt-36 flex flex-col items-center gap-10">
      <h1 className="text-2xl md:text-3xl lf:text-4xl">
        {searchParams.get("createNew") ? "Please login first" : "Login /Signup"}
      </h1>

      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="password">SignUp</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="password">
          <SignUp />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
