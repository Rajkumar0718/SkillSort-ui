import React from "react";
import {
  Breadcrumbs as MUIBreadcrumbs,
  Link,
  Typography,
} from "@material-ui/core";
import { useNavigate, useLocation } from "react-router-dom";

const Breadcrumbs = (props) => {
  const { homeLink, separator, linkStyle, activeTypographyStyle } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname, state } = location || {};
  const pathnames = pathname ? pathname.split("/").filter((x) => x) : [];
  if (pathname === homeLink) {
    return null;
  }
  return (
    <MUIBreadcrumbs
      aria-label="breadcrumb"
      separator={separator}
      style={{ paddingBottom: "10px" }}
    >
      {pathnames.length > 0 && pathname !== homeLink ? (
        <Link onClick={() => navigate(homeLink)} style={linkStyle}>
          Home
        </Link>
      ) : (
        ""
      )}

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        if (
          name !== homeLink &&
          name.toLowerCase() !== "college" &&
          pathnames.length > 1
        ) {
          return (
            <Typography key={name} style={activeTypographyStyle}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
          );
        }

        return isLast && name !== homeLink ? (
          <Typography key={name} style={activeTypographyStyle}>
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </Typography>
        ) : null;
      })}
    </MUIBreadcrumbs>
  );
};

export default Breadcrumbs;
