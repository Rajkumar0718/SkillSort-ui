const breadcrumb = {
  COLLEGE_ADMIN: { homeLink: "/college", name: "college", "/college/placement-coordinator": "Placement-Coordinators" },
  ADMIN: {
    homeLink: "/admin/vacancy",
    name: "admin",
    "/admin/setting": "Settings",
    "/admin/vacancy": "Vacancies",
    "/admin/vacancy/history": "Vacancy-History",
    "/admin/smtp": "SMTP Configuration",
    "/admin/hr": "HR Users",
    "/admin/section": "sections"

  },
  TEST_ADMIN: { homeLink: "/testadmin/question", name: "testadmin", "/testadmin/question": "Questions", "/testadmin/setting": "settings", "/testadmin/section": "sections" },
  SUPER_ADMIN_COLLEGE: { homeLink: '/home', name: 'Home', '/collegeadmin/add': "Add College", '/collegeadmin': 'Colleges', '/collegeadmin/admin': 'College Admins', '/collegeadmin/admin/add': 'Add' },
  SUPER_ADMIN_COMPANY: { homeLink: '/home', name: 'Home', '/companyadmin/add': "Add Company", '/companyadmin': 'Companies', '/companyadmin/admin': 'Company Admins', '/companyadmin/admin/add': 'Add','/companyadmin/plan':'Plans' },
  SUPER_ADMIN_PANELISTS: { homeLink: '/home', name: 'Home' },
  SUPER_ADMIN_REPORT: { homeLink: '/home', name: 'Home', '/report/advance-search': "Adv-Search", '/report': "Dashboard", '/report/activity-dashboard': "Activity-Report" },
  SUPER_ADMIN_SKILL_SORT_ADMIN: {
    homeLink: '/home', name: 'Home', '/skillsortadmin': "ProcessAdmin List", '/skillsortadmin/add': "Add", '/skillsortadmin/testadmin': "TestAdmin List", '/skillsortadmin/testadmin/add': "Add", '/skillsortadmin/advertisement': "Advertisement List", '/skillsortadmin/advertisement/add': "Add Advertisement",
    '/skillsortadmin/edit': "Edit", '/skillsortadmin/testadmin/edit': "Edit"
  },
  SUPER_ADMIN_SETTINGS: {
    homeLink: '/home', name: 'Home', '/settings': "Industry Type", '/settings/department': "Department", '/settings/practiceExam': "PracticeExam", '/settings/practiceExam/viewPracticeExam': "view", '/settings/practiceExam/addPracticeExam': "Add",
    '/settings/smtp': "SMTP", '/settings/test': "Level", '/settings/test/addtest': "Add", '/settings/test/view': "view", '/settings/plan-master': "Plan Master", '/settings/weightage': "Weightage", '/settings/freeCredits': "FreeCredits"
  },
  PROCESS_ADMIN: {
    homeLink: '/processadmin', name: 'processadmin',
  }
};
export default breadcrumb;
