import NavbarNew from "@/components/navbar-new";
import { createClient } from "@/utils/supabase/server";
import React from "react";
// import NavbarNew from './navbar_new';

const Layout: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  // Assuming you have a way to get the user id and email
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;
  const userEmail = user?.email;

  return (
    <div className="w-full h-full">
      {/* <NavbarNew email={userEmail ?? ""} id={userId ?? ""} /> */}
      {children}
    </div>
  );
};

export default Layout;
