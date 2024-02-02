import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from "@mui/material";
import _ from 'lodash';
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import routes from "../utils/TestAdminRoutes";

const Breadcrumbs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { pathname, state } = location;
  const pathnames = pathname.split("/").filter(x => x);

  const crumbsPathWithName = _.reduce(routes, function (map, value) {
    map[value.path] = value.name;
    return map;
  }, {});

  return (
    <MUIBreadcrumbs aria-label="breadcrumb" separator=">" style={{ paddingBottom: '10px' }}>
      {pathnames.length > 0 && pathname !== '/testadmin' ? (
        <Link onClick={() => navigate("/testadmin")} style={{ cursor: 'pointer' }}>Test</Link>
      ) : ''}
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        return isLast && name !== 'testadmin' ? (
          <Typography key={name}>{crumbsPathWithName[routeTo]}</Typography>
        ) : (name !== 'testadmin' ? (
          <Link key={name} onClick={() => navigate(routeTo, state)} style={{ cursor: 'pointer' }}>
            {crumbsPathWithName[routeTo]}
          </Link>
        ) : '');
      })}
    </MUIBreadcrumbs>
  );
};

export default Breadcrumbs;
