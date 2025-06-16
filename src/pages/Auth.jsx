import React from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/auth/Login";
import SignUp from "@/components/auth/SignUp";

const Auth = () => {
  const [searchParams] = useSearchParams();
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
