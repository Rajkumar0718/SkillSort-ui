import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TableHeader from "../../utils/TableHeader";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useLocation,useNavigate } from "react-router";
import AddPosition from "./AddPosition";
import AdvSearch from "./AdvanceSearch";
import ViewResult from "./ViewResult";
import SelectedStudentList from "./SelectedStudentList";
import SkillSortNotifiedCandidateList from "./SkillSortNotifiedCandidateList";
import ShortListedCandidate from "./ShortListedCandidate";
import AddExam from "./AddExam";

const PositionDetails = (props) => {
  const [activeTab, setActiveTab] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  const isSkillSort = window.location.pathname === "/admin/vacancy/skillsort";
  const isResult = window.location.pathname === "/admin/vacancy/result";
  const isAddVacany = window.location.pathname === "/admin/vacancy/add";
  const isEditVacany = window.location.pathname === "/admin/vacancy/edit";
  const isAddExam = window.location.pathname === "/admin/vacancy/Exam-add";
  const isshortListed = window.location.pathname === "/admin/vacancy/shortListed";
  const [formVisible, setFormVisible] = useState('')

  useEffect(()=>{
    if (isSkillSort) {
          setFormVisible("AdvanceSearch");
        } else if (isshortListed) {
          setFormVisible("Shortlisted");
        } else if (isResult) {
          setFormVisible("Result");
        } else if (isAddVacany || isEditVacany) {
          setFormVisible("vacancy");
        } else if (isAddExam) {
          setFormVisible("Exam");
        }
  },[])

  const examId = location?.state?.position?.examId;

    const updateExamId = (examId) => {
      const updatedPosition = { ...location.state.position, examId: examId };
      navigate({ state: { position: updatedPosition } });
    }
  const handleFormChange = (name) => {
    setFormVisible(name);
  };
  const handleTabChange = (event, value) => {
    setActiveTab(value);
  };
  const getTabs = () => {
    if (isSkillSort) {
      return (
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab
            value={0}
            onClick={() => handleFormChange("AdvanceSearch")}
            label="Advance Search"
          />
          <Tab
            value={1}
            onClick={() => handleFormChange("Shortlisted")}
            label="Shortlisted"
          />
        </Tabs>
      );
    } else if (isshortListed) {
      return (
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab
            value={1}
            onClick={() => handleFormChange("AdvanceSearch")}
            label="Advance Search"
          />
          <Tab
            value={0}
            onClick={() => handleFormChange("Shortlisted")}
            label="Shortlisted"
          />
        </Tabs>
      );
    } else if (isResult) {
      return (
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab
            disabled={!examId}
            value={0}
            onClick={() => handleFormChange("Result")}
            label="Result"
          />
          <Tab
            disabled={!examId}
            value={2}
            onClick={() => handleFormChange("SelectedCandidates")}
            label="Selected Candidates"
          />
          <Tab
            disabled={!examId}
            value={1}
            onClick={() => handleFormChange("Notified")}
            label="Notified Candidates"
          />
        </Tabs>
      );
    } else if (isAddVacany || isEditVacany) {
      return (
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab
            value={0}
            onClick={() => handleFormChange("vacancy")}
            label="vacancy"
          />
          {examId && isEditVacany ? (
            <Tab
              value={1}
              onClick={() => handleFormChange("Exam")}
              label="Test"
            />
          ) : null}
        </Tabs>
      );
    } else if (isAddExam) {
      return (
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab
            value={0}
            onClick={() => handleFormChange("Exam")}
            label="Test"
          />
        </Tabs>
      );
    }
  };
  return (
    <div style={{ overflowX: "hidden" }}>

      {!isAddVacany ? (
        <TableHeader title={location?.state?.position?.name} />
      ) : (
        ""
      )}
      <Divider
        sx={{ position: "relative", width: "98%", left: "20px", opacity: "1" }}
      />
      <Box style={{ position: "relative", left: "20px" }}>{getTabs()}</Box>
        {formVisible === "vacancy" && ( <AddPosition position={location?.state?.position} action="Update" /> )}
        {formVisible === "AdvanceSearch" && ( <AdvSearch position={location?.state?.position} /> )}
        {formVisible === 'Exam' && <AddExam updateExamId={updateExamId} position={location?.state} />}
        {formVisible === 'Result' && <ViewResult position={location?.state?.position} />}
        {formVisible === 'SelectedCandidates' && <SelectedStudentList position={location?.state?.position} />}
        {formVisible === 'Notified' && <SkillSortNotifiedCandidateList position={location?.state?.position} />}
        {formVisible === 'Shortlisted' && <ShortListedCandidate position={location?.state?.position} />}
    </div>
  );
};

export default PositionDetails;
