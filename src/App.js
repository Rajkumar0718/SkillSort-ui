import "./App.css";
import React from "react";
import SideBar from "./common/SideBar";
import { useRoutes } from "react-router-dom";
import Home from "@mui/icons-material/Home";
import { Apartment } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Button from "./common/Button";

export default function App() {
  const listItems = [
    { text: "Home", icon: <Home />, menu: "MENU", link: "/example" },
    {
      text: "Company",
      icon: <Apartment />,
      menu: "MENU",
      link: "/example2",
      child: [{ link: "/admin/onGoingTest", title: "OnGoing Test" }],
    },
    {
      text: "CompanyAdmin",
      icon: <AccountCircleIcon />,
      menu: "MENU",
      child: [
        { link: "/admin/onGoingTest", title: "OnGoing Test" },
        { link: "/admin/onGoingTest", title: "OnGoing" },
      ],
    },
  ];
  const btnList = [
    {
      className: "my-button",
      // onClick: handleClick,
      style: { color: "red" },
      type: "button",
      dataToggle: "modal",
      dataPlacement: "top",
      hoverTitle: "okk",
      disabled: false,
      dataDismiss: "alert",
      id: "myButtonId",
      title:"Click me"
    },
  ];

  const routes = useRoutes([
    { path: "/sidebars", element: <SideBar listItems={listItems} /> },
    { path: "/button", element: <Button {...btnList[0] }></Button> },
  ]);
  return routes;
}
