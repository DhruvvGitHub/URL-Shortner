import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LinkIcon, LogOut } from "lucide-react";
import { UrlState } from "@/Context";
import useFetch from "@/hooks/useFetch";
import { logOut } from "@/db/apiAuth";
import { ClipLoader } from "react-spinners";

const Header = () => {
  const navigate = useNavigate();

  const { loading, fn: fnLogOut } = useFetch(logOut);

  const { user, fetchUser } = UrlState();
  console.log(user);

  return (
    <div>
      <div className="w-full flex items-center justify-between px-6 py-4 bg-red-400">
        <div>
          <Link to="/">Trim-It</Link>
        </div>
        <div>
          {!user ? (
            <Button onClick={() => navigate("/auth")}>Login</Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={user?.user_metadata?.profile_pic} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {user?.user_metadata?.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LinkIcon />
                  <Link to="/dashboard">
                  My URLs
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    try {
                      await fnLogOut();
                      await fetchUser();
                      navigate("/");
                    } catch (error) {
                      console.error("Logout failed:", error);
                    }
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      {loading && <ClipLoader size={22} />}
    </div>
  );
};

export default Header;
