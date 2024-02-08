import React, { useState, useEffect } from "react";
import { isRoleValidation } from "../../utils/Validation";
import { authHeader, errorHandler } from "../../api/Api";
import axios from "axios";
import url from "../../utils/UrlConstant";
import TableHeader from "../../utils/TableHeader";
import { Link } from "react-router-dom";
import Search from "../../common/AdvanceSearch";
import Box, { display } from "@mui/system/Box";
import Grid from "@mui/system/Unstable_Grid";
import _ from "lodash";
import CustomCard from "../../utils/CustomCard";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";


const Position = () => {
  const [positions, setPositions] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [shortListedCount, setShortListedCount] = useState({});
  const [loader, setLoader] = useState(true);
  const [name, setName] = useState("");
  const [plans, setPlans] = useState([]);
  const [planCount, setPlanCount] = useState(0);
  const getPosition = () => {
    axios
      .get(`${url.ADMIN_API}/position/getAll`, { headers: authHeader() })
      .then((res) => {
        setPositions(res.data.response);
        getShrotListedCandidateCount();
      })
      .catch((error) => {
        errorHandler(error);
      });
  };
  const getShrotListedCandidateCount = () => {
    let positionId = positions.map((item) => item.id);
    axios
      .post(`${url.ADMIN_API}/position/getShortListedCount`, positionId, {
        headers: authHeader(),
      })
      .then((res) => {
        setShortListedCount(res.data.response.shortListedCandidateCount);
      })
      .catch((error) => {
        errorHandler(error);

        setLoader(false);
      });
  };

  const claimCredits = () => {
    setDisabled(true);
    axios
      .post(
        `${url.ADMIN_API}/position/create/demo`,
        {},
        { headers: authHeader() }
      )
      .then((res) => {
        setDisabled(false);
        getPosition();
      })
      .catch((error) => {
        setDisabled(false);
        errorHandler(error);
      });
  };
  useEffect(() => {
    if (localStorage.getItem("exam")) {
      localStorage.removeItem("exam");
    }
    handleVaccancyPageViewEventTrack();
    getPosition();
    getCompanyPlans();
  }, []);

  useEffect(() => {
    handleFilterByDate();
  }, [name]);

  const handleVaccancyPageViewEventTrack = () => {
    window.dataLayer?.push({
      event: "HR_Vaccancy_PageView",
    });
  };
  const getCompanyPlans = () => {
    axios
      .get(`${url.ADMIN_API}/plan?service=TEST`, { headers: authHeader() })
      .then((res) => {
        if (_.isEmpty(res.data.response)) return;
        const plans = res.data.response || [];
        setPlans(plans);
        setPlanCount(_.sumBy(plans, (p) => p.residue || 0));
      })
      .catch((error) => errorHandler(error));
  };

  const handleFilterByDate = () => {
    axios
      .post(
        ` ${url.ADMIN_API}/position/search?name=${name}`,
        {},
        { headers: authHeader() }
      )
      .then((res) => {
        setPositions(res.data.response);
      })
      .catch((error) => {
        errorHandler(error);
        setLoader(false);
      });
  };
  const onSearch = (value) => {
    setName(value);
  };
  return (
    <main className="main-content bcg-clr">
      {positions.length === 0 && isRoleValidation() === "TRIAL_ADMIN" ? (
        <div
          style={{
            fontFamily: '"Baskervville", serif',
            width: "96.5%",
            left: "20px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <span
            style={{ fontFamily: '"Baskervville", serif', fontSize: "30px" }}
          >
            Congrats..!
          </span>
          &emsp;
          <span
            style={{ fontFamily: '"Baskervville", serif', fontSize: "20px" }}
          >
            You have successfully registered and can claim your rewards.
          </span>
          <button
            style={{
              padding: "5px",
              outline: "none",
              border: "1px solid #F05A28",
              backgroundColor: "#F05A28",
              color: "#fff",
              borderRadius: "5px",
              float: "right",
              position: "relative",
              top: "8px",
            }}
            disabled={disabled}
            onClick={() => claimCredits()}
          >
            Claim Your Rewards
          </button>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
            <TableHeader title="Vacancies" />
            {positions?.length === 0 ? (
              ""
            ) : (

              <div >
                <Link
                  className="btn btn-sm btn-nxt float-right"
                  to="/admin/vacancy/history"
                  state={{ position: positions }}
                  style={{
                    position: "relative",
                    right: "1rem"
                  }}
                >
                  Vacancy History
                </Link>
                <Link
                  className="btn btn-sm btn-nxt float-right"
                  to="/admin/vacancy/add"
                >
                  Add Vacancy
                </Link>
              </div>

            )}
          </div>
          <Search
            style={{
              backgroundColor: 'rgba(59, 72, 158, 0.3)',
              padding: '0.60rem 1.25rem',
              marginBottom: '0.5%',
              color: '#111111',
              height: '58px',
              verticalAlign: '-webkit-baseline-middle',
              borderRadius: '2px',
              /* fontWeight: '600', */
              marginLeft: '19.6px',
              marginRight: '0px',
            }}
            title="Filter"
            showSearch={true}
            placeholder="Search by vacancy name"
            onSearch={onSearch}
          />

          <div
            style={{
              marginLeft: "2rem",
              overflowY: "auto",
            }}
          >
            <Grid container>
              <Grid item xs={12} md={4} sm={6} lg={3} xl={2}>
                <Link to="/admin/vacancy/add">
                  <Box
                    component="span"
                    style={{
                      marginLeft: "0.5rem",
                      height: "22rem",
                      width: "250px",
                      borderRadius: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "white",
                      marginRight: "3.2rem",
                      marginTop: "1rem",
                    }}
                    sx={{ p: 2, border: "1px dashed grey" }}
                  >
                    <PersonAddRoundedIcon
                      sx={{ color: "#3b489e", fontSize: "4rem" }}
                      titleAccess="Add Position"
                    />
                  </Box>
                </Link>
              </Grid>
              {_.map(positions, (card, idx) => (
                <Grid item xs={12} md={4} sm={6} lg={3} xl={2}>
                  <CustomCard
                    view={{
                      pathname: "/admin/vacancy/skillsort",
                      state: { position: positions[idx], view: "skillsort" },
                    }}
                    result={{
                      pathname: "/admin/vacancy/result",
                      state: { position: positions[idx], view: "result" },
                    }}
                    shortListedCandi={{
                      pathname: "/admin/vacancy/shortListed",
                      state: {
                        position: positions[idx],
                        view: "shortListedCandidate",
                      },
                    }}
                    examId={positions[idx]?.examId || null}
                    remainingTest={_.sumBy(plans || [], (p) => p.residue || 0)}
                    positionObject={card}
                    shortListed={shortListedCount[card.id]}
                  />
                </Grid>
              ))}
            </Grid>
          </div>
        </div>
      )}
    </main>
  );
};

export default Position;
