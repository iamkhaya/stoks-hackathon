import React from "react";

import MemberDashboardPage from "./views/pages/member/MemberDashboard";
import MemberRegistration from "./views/pages/member/MemberRegistration";
import MemberLogin from "./views/pages/member/MemberLogin";
import StokvelViewPage from "./views/pages/member/StokvelViewPage";

const routes = [
  { path: "/", exact: true, name: "Home" },

  { path: "/member-login", name: "Member Login Page", element: MemberLogin },
  {
    path: "/member-register",
    name: "Member Registration Page",
    element: MemberRegistration,
  },
  {
    path: "/member-dashboard/*",
    name: "Member Dashboard",
    element: MemberDashboardPage,
  },
  { path: "/stokvel/:id", name: "Stokvel", element: StokvelViewPage },
];

export default routes;
