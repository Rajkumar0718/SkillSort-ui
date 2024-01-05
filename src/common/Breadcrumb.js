import React from 'react';
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from '@material-ui/core';
import { useNavigate, useLocation } from 'react-router-dom';

const Breadcrumbs = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname, state } = location;
  const { homeLink, separator, capitalize } = props;

  const pathnames = pathname.split('/').filter((x) => x);

  const capitalizeFirstLetter = (str) => {
    return capitalize ? str.charAt(0).toUpperCase() + str.slice(1) : str;
  };

  return (
    <MUIBreadcrumbs aria-label="breadcrumb" separator={separator} style={{ paddingBottom: '10px' }}>
      {pathnames.length > 0 && pathname !== homeLink ? (
        <Link onClick={() => navigate(homeLink)} style={{ cursor: 'pointer' }}>
          {capitalizeFirstLetter(homeLink)}
        </Link>
      ) : (
        ''
      )}
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        return isLast && name !== homeLink ? (
          <Typography key={name}>{capitalizeFirstLetter(name)}</Typography>
        ) : name !== homeLink ? (
          <Link key={name} onClick={() => navigate(routeTo, state)} style={{ cursor: 'pointer' }}>
            {capitalizeFirstLetter(name)}
          </Link>
        ) : (
          ''
        );
      })}
    </MUIBreadcrumbs>
  );
};

export default Breadcrumbs;
