import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from "@mui/material";
import _ from 'lodash';
import React from "react";
import { withRouter, useNavigate } from "react-router-dom";

const Breadcrumbs = props => {

  const {
    crumbsPathWithName,
    history,
    location: { pathname, state },
  } = props;

  const navigate = useNavigate();
  const pathnames = pathname.split("/").filter(x => x);
  const skipPath = ['settings', 'panelists', 'skillsortadmin', 'collegeadmin', 'Test']
  return (
    <MUIBreadcrumbs aria-label="breadcrumb" separator=">" style={{ paddingBottom: '10px' }}>
      {pathnames.length > 0 && pathname !== '/home' ? (
        <Link onClick={() => navigate("/home")} style={{ cursor: 'pointer' }}>Home</Link>
      ) : ''}
      {_.map(pathnames || [], (name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        if (!skipPath.includes(name)) {
          return isLast ? (
            <Typography key={name}>{crumbsPathWithName[routeTo]}</Typography>
          ) : (name !== '' ?
            <Link key={name} onClick={() => history.push(routeTo, state)} style={{ cursor: 'pointer' }}>
              {crumbsPathWithName[routeTo]}
            </Link> : ''
          )
        } else if (isLast) {
          return <Typography key={name}>{crumbsPathWithName[routeTo]}</Typography>
        }
      })}
    </MUIBreadcrumbs>
  );
};

export default Breadcrumbs;
