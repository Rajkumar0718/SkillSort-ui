import React, { useEffect, useState } from "react";
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { isRoleValidation } from "../utils/Validation";
import breadcrumb from "./BreadcrumbJson";

const Breadcrumbs = () => {
  const [homeLink, setHomeLink] = useState(null);
  const [name, setName] = useState(null);
  const role = isRoleValidation()
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location || {};
  const pathnames = pathname ? pathname.split("/").filter((x) => x) : [];

  useEffect(() => {
    if (breadcrumb.hasOwnProperty(role)) {
      const values = breadcrumb[role];
      if (values) {
        setHomeLink(values.homeLink);
        setName(values.name);
      }
    }
  }, [role]);

  const handleHomeLinkClick = (event) => {
    event.preventDefault();
    navigate(homeLink);
  };

  const targetString = name;
  const breadCrumbJSON = breadcrumb[role];
  return (
    <MUIBreadcrumbs aria-label="breadcrumb" separator=">">
      {pathnames.length > 0 && pathname !== homeLink ? (
        <Link
          onClick={handleHomeLinkClick}
          underline="hover"
          style={{
            cursor: "pointer",
            color: "#3f51b5",
            marginLeft: "1rem",
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
            {breadcrumb[role][pathname]
              ? breadcrumb[role][pathname]
              : name?.charAt(0).toUpperCase() + name?.slice(1)}
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
            {breadCrumbJSON[routeTo] ? breadCrumbJSON[routeTo] : name.charAt(0).toUpperCase() + name.slice(1)}

          </Link>
        ) : (
          ""
        );
      })}
    </MUIBreadcrumbs>
  );
};

export default Breadcrumbs;
