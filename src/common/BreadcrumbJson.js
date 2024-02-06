const breadcrumb = {
  COLLEGE_ADMIN: { homeLink: "/college", name: "college" },
  ADMIN: {
    homeLink: "admin/dashboard",
    name: "admin",
    "/admin/setting": "Settings",
    "/admin/vacancy": "Vacancies",
    "/admin/vacancy/history": "Vacancy-History",
    "/admin/smtp": "SMTP Configuration",
    "/admin/hr": "HR Users",
    "/admin/section": "sections"

  },
  TEST_ADMIN: { homeLink: "/testadmin/question", name: "testadmin", "/testadmin/question": "Questions", "/testadmin/setting": "settings", "/testadmin/section": "sections" },
  PROCESS_ADMIN : {
    homeLink: "/processadmin" , name:"processadmin" ,
    "/processadmin/company/test":"Test"
  },
};
export default breadcrumb;