import React, { useEffect, useState } from "react";
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { isRoleValidation } from "../utils/Validation";
import breadcrumb from "./BreadcrumbJson";

const Breadcrumbs = () => {
  const [homeLink, setHomeLink] = useState(null);
  const [name, setName] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location || {};
  const pathnames = pathname ? pathname.split("/").filter((x) => x) : [];

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const roleFromValidation = await isRoleValidation();
      if (isMounted) {
        setRole(roleFromValidation);
      }
    };
    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);
  useEffect(() => {
    if (breadcrumb.hasOwnProperty(role)) {
      const values = breadcrumb[role];
      if (values.length > 0) {
        setHomeLink(values[0].homeLink);
        setName(values[0].name);
      }
    }
  }, [role]);
  const handleHomeLinkClick = (event) => {
    event.preventDefault();
    navigate(homeLink);
  };

  const targetString = name;
  return (
    <MUIBreadcrumbs
      aria-label="breadcrumb"
      separator=">"
      style={{ paddingBottom: "10px" }}
    >
      {pathnames.length > 0 && pathname !== homeLink ? (
        <Link
          onClick={handleHomeLinkClick}
          underline="hover"
          style={{
            cursor: "pointer",
            color: "#3f51b5",

          }}
        >
          Home
        </Link>
      ) : (
        ""
      )}
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        return isLast && name !== targetString ? (
          <Typography key={name}>
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </Typography>
        ) : name !== targetString ? (
          <Link
            key={name}
            onClick={() => navigate(routeTo)}
            underline="hover"
            style={{
              cursor: "pointer",
              color: "#3f51b5",
            }}
          >
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </Link>
        ) : (
          ""
        );
      })}
    </MUIBreadcrumbs>
  );
};

export default Breadcrumbs;
