import { Link, Breadcrumbs as MUIBreadcrumbs, Typography } from "@mui/material";
import _ from 'lodash';
import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router';
import { useNavigate } from "react-router-dom";
import crumbsPathWithName from "../common/BreadcrumbJson";
import { isRoleValidation } from "../utils/Validation";
import { withLocation } from "../utils/CommonUtils";


const Breadcrumbs = (props) => {

  const { state, data } = props;

  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location ||{}

  const pathnames = pathname.split("/").filter(x => x);

  const role = isRoleValidation();
  const skipPath = ['settings', 'panelists', 'skillsortadmin', 'collegeadmin', 'Test']

  useEffect(() => {
  }, [location])
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
            <Typography key={name}>{crumbsPathWithName[role][routeTo]}</Typography>
          ) : (name !== '' ?
            <Link key={name} onClick={() => navigate(routeTo, state)} style={{ cursor: 'pointer' }}>
              {crumbsPathWithName[role][routeTo]}
            </Link> : ''
          )
        } else if (isLast) {
          return <Typography key={name}>{crumbsPathWithName[role][routeTo]}</Typography>
        }
      })}
    </MUIBreadcrumbs>
  );
};

export default Breadcrumbs
