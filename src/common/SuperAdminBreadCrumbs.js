import React, { useEffect, useState } from "react";
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const SuperAdminBreadcrumbs = ({ breadCrumbJSON }) => {
    const [homeLink, setHomeLink] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { pathname } = location || {};
    const pathnames = pathname ? pathname.split("/").filter((x) => x) : [];

    useEffect(() => {
        if (breadCrumbJSON) {
            setHomeLink(breadCrumbJSON.homeLink);
        }
    }, [breadCrumbJSON]);

    const handleHomeLinkClick = (event) => {
        event.preventDefault();
        navigate(homeLink);
    };

    const skipPath = ['settings', 'panelists', 'Test']

    return (
        <MUIBreadcrumbs aria-label="breadcrumb" separator=">" style={{marginLeft:'-0.9rem'}}>
            {pathnames.length > 0 && pathname !== homeLink ? (
                <Link
                    onClick={handleHomeLinkClick}
                    underline="hover"
                    style={{
                        cursor: "pointer",
                        color: "#3f51b5",
                        marginLeft: "2rem",
                    }}
                >
                    {breadCrumbJSON.name === "testadmin" ? "Test" : "Home"}
                </Link>
            ) : (
                ""
            )}

            {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                const isLast = index === pathnames.length - 1;
                if (!skipPath.includes(name)) {
                    return isLast ? (<Typography key={name}>
                        {breadCrumbJSON[pathname]
                            ? breadCrumbJSON[pathname]
                            : name?.charAt(0).toUpperCase() + name?.slice(1)}
                    </Typography>) : (name !== '' ? <Link
                        key={name}
                        onClick={() => navigate(routeTo)}
                        underline="hover"
                        style={{
                            cursor: "pointer",
                            color: "#3f51b5",
                        }}
                    >
                        {breadCrumbJSON[routeTo] ? breadCrumbJSON[routeTo] : name.charAt(0).toUpperCase() + name.slice(1)}

                    </Link> : "")
                } else if (isLast) {
                    return <Typography key={name}>
                        {breadCrumbJSON[pathname]
                            ? breadCrumbJSON[pathname]
                            : name?.charAt(0).toUpperCase() + name?.slice(1)}
                    </Typography>
                }
            })}
        </MUIBreadcrumbs>
    );
};

export default SuperAdminBreadcrumbs;
