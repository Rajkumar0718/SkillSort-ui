import { FaClipboard } from "react-icons/fa";

const sidebar = {
  "ADMIN": [{
    to: '/admin/hr',
    name: 'HR Users',
    icon: 'fa fa-id-badge'
  }, {
    isSubMenu: true,
    name: 'Test',
    icon: 'fa fa-file-text-o',

    toolTipMarginTop: '2.5rem',
    toggleValue: 'showSubMenuTest',
    onClick: 'toggleClickedSubMenu',
    param: 'test',
    height: ['9.2rem', '3.5rem'],
    subMenu: [{
      to: '/admin/onGoingTest',
      name: 'OnGoing Test',
      focusLinks: ['/admin/onGoingTest', '/admin/onGoingTest/candidate']
    },
    {
      to: '/admin/test',
      name: 'Test',
      focusLinks: ['/admin/test','/admin/test/add']
    },
    {
      to: '/admin/questions',
      name: 'Question',
      focusLinks: ['/admin/questions', '/admin/questions/add']
    }, {
      to: '/admin/section',
      name: 'Section',
      focusLinks: ['/admin/section']
    }]
  }, {
    isSubMenu: false,
    name: 'Vacancy',
    to: '/admin/vacancy',
    icon: 'fa fa-user-plus',
    subPath: ['/admin/vacancy/history', '/admin/vacancy/result', '/admin/vacancy/edit', '/admin/vacancy/add', '/admin/vacancy/skillsort','/admin/profile'],
  }, {
    to: '/admin/setting',
    name: 'Setting',
    icon: 'fa fa-cogs'
  }, {
    isSubMenu: false,
    name: 'SMTP Configuration',
    to: '/admin/smtp',
    icon: 'fa fa-tasks'
  }],
  "HR_MANAGER": [{
    isSubMenu: false,
    to: "/admin/dashboard",
    name: "Dashboard",
    icon: 'fa fa-tachometer'
  }, {
    to: '/admin/hr',
    name: 'HR Users',
    icon: 'fa fa-id-badge'
  }, {
    isSubMenu: true,
    name: 'Test',
    icon: 'fa fa-file-text-o',
    toolTipMarginTop: '2.5rem',
    toggleValue: 'showSubMenuTest',
    onClick: 'toggleClickedSubMenu',
    param: 'test',
    height: ['9.2rem', '3.5rem'],
    subMenu: [{
      to: '/admin/onGoingTest',
      name: 'OnGoing Test'
    },
    {
      to: '/admin/test',
      name: 'Test'
    },
    {
      to: '/admin/questions',
      name: 'Question'
    }, {
      to: '/admin/section',
      name: 'Section'
    }]
  }, {
    isSubMenu: false,
    name: 'Candidates',
    to: '/admin/candidates',
    icon: 'fa fa-user-o'
  }, {
    isSubMenu: false,
    to: '/admin/result',
    name: 'Result',
    icon: 'fa fa-newspaper-o'
  }, {
    to: '/admin/setting',
    name: 'Setting',
    icon: 'fa fa-cogs'
  }, {
    isSubMenu: true,
    name: 'SkillSort',
    icon: 'fa fa-user-circle-o',
    toolTipMarginTop: '2.5rem',
    toggleValue: 'showSubMenuSkillsort',
    onClick: 'toggleClickedSubMenu',
    param: 'skillsort',
    height: ['7.8rem', '3.5rem'],
    subMenu: [{
      to: '/admin/adv-search',
      name: 'Adv Search'
    },
    {
      to: '/admin/shortlisted-candidates',
      name: 'Shortlisted'
    },
    {
      to: '/admin/skillsort',
      name: 'Notified'
    }]
  }],
  "HR": [{
    isSubMenu: false,
    to: "/admin/dashboard",
    name: "Dashboard",
    icon: 'fa fa-tachometer'
  }, {
    isSubMenu: false,
    name: 'Candidates',
    to: '/admin/candidates',
    icon: 'fa fa-user-o'
  }, {
    isSubMenu: false,
    to: '/admin/result',
    name: 'Result',
    isDefault: true,
    icon: 'fa fa-newspaper-o'
  }, {
    isSubMenu: true,
    name: 'SkillSort',
    icon: 'fa fa-user-circle-o',
    toolTipMarginTop: '2.5rem',
    toggleValue: 'showSubMenuSkillsort',
    onClick: 'toggleClickedSubMenu',
    param: 'skillsort',
    height: ['7.8rem', '3.5rem'],
    subMenu: [{
      to: '/admin/adv-search',
      name: 'Adv Search'
    },
    {
      to: '/admin/shortlisted-candidates',
      name: 'Shortlisted'
    },
    {
      to: '/admin/skillsort',
      name: 'Notified'
    }]
  }],
  "COLLEGE_ADMIN": [{
    isSubMenu: false,
    to: "/college/placement-coordinator",
    name: "Placement Coordinator",
    icon: 'fa fa-user-circle-o',
    subPath: ['/college/placement-coordinator/add', '/college/placement-coordinator/edit']
  }, {
    isSubMenu: false,
    name: 'Students',
    isDefault: true,
    to: '/college',
    icon: 'fa fa-users',
    subPath: ['/college/add', '/college/edit']
  }, {
    isSubMenu: false,
    to: '/college/collegeReport',
    name: 'SkillSort User Report',
    icon: 'fa fa-file-text-o'
  }
  ],
  "SUPER_ADMIN_COLLEGE": [{
    isSubMenu: false,
    to: "/home",
    name: "HOME",
    icon: 'fa fa-home'
  }, {
    isSubMenu: false,
    name: 'College',
    isDefault: true,
    to: '/collegeadmin',
    subPath: ['/collegeadmin/add', '/collegeadmin/edit'],
    icon: 'fa fa-building-o'
  }, {
    isSubMenu: false,
    to: '/collegeadmin/admin',
    name: 'College Admin',
    subPath: ['/collegeadmin/admin/add', '/collegeadmin/admin/edit'],
    icon: 'fa fa-user-circle-o'
  },
  ],

  "SUPER_ADMIN_COMPANY": [{
    isSubMenu: false,
    to: "/home",
    name: "HOME",
    icon: 'fa fa-home'
  }, {
    isSubMenu: false,
    name: 'Company',
    isDefault: true,
    to: '/companyadmin',
    subPath: ['/companyadmin/add', '/companyadmin/edit','/companyadmin/plan'],
    icon: 'fa fa-building-o'
  }, {
    isSubMenu: false,
    to: '/companyadmin/admin',
    name: 'Company Admin',
    subPath: ['/companyadmin/admin/add', '/companyadmin/admin/edit'],
    icon: 'fa fa-user-circle-o'
  }
  ],
  "SUPER_ADMIN_PANELISTS": [{
    isSubMenu: false,
    to: "/home",
    name: "HOME",
    icon: 'fa fa-home'
  }, {
    isSubMenu: false,
    name: 'Panelist',
    isDefault: true,
    to: '/panelists',
    subPath: ['/panelists/verify'],
    icon: 'fa fa-user-circle-o '
  }, {
    isSubMenu: false,
    to: '/panelists/payment',
    name: 'Payment',
    icon: 'fa fa-money'
  }
  ],
  "SUPER_ADMIN_REPORT": [{
    isSubMenu: false,
    to: "/home",
    name: "HOME",
    icon: 'fa fa-home'
  }, {
    isSubMenu: false,
    name: 'SkillSort User Report',
    isDefault: true,
    to: '/report',
    icon: 'fa fa-file-text-o'
  }, {
    isSubMenu: false,
    to: '/report/advance-search',
    name: 'Advance Search',
    icon: 'fa fa-search'
  }, {
    isSubMenu: false,
    to: '/report/activity-dashboard',
    name: 'Activity Report',
    icon: 'fa fa-file'
  }
  ],
  "SUPER_ADMIN_SKILL_SORT_ADMIN": [{
    isSubMenu: false,
    to: "/home",
    name: "HOME",
    icon: 'fa fa-home'
  }, {
    isSubMenu: false,
    name: 'Process Admin',
    isDefault: true,
    to: '/skillsortadmin',
    subPath: ['/skillsortadmin/add', '/skillsortadmin/edit'],
    icon: 'fa fa-user'
  }, {
    isSubMenu: false,
    to: '/skillsortadmin/testadmin',
    name: 'Activity Report',
    subPath: ['/skillsortadmin/testadmin/add', '/skillsortadmin/testadmin/edit'],
    icon: 'fa fa-user-circle'
  }, {
    isSubMenu: false,
    to: '/skillsortadmin/advertisement',
    name: 'Advertisement',
    subPath: ['/skillsortadmin/advertisement/add','/skillsortadmin/advertisement/edit'],
    icon: 'fa fa-bullhorn'
  }
  ],

  "SUPER_ADMIN_SETTINGS": [{
    isSubMenu: false,
    to: "/home",
    name: "HOME",
    icon: 'fa fa-home'
  }, {
    isSubMenu: false,
    to: "/settings",
    name: "Industry Type",
    icon: 'fa fa-universal-access'
  }, {
    isSubMenu: false,
    name: 'Department',
    isDefault: true,
    to: '/settings/department',
    icon: 'fa fa-sitemap'
  }, {
    isSubMenu: false,
    to: '/settings/practiceExam',
    name: 'PracticeExam',
    subPath: ['/settings/practiceExam/addPracticeExam', '/settings/practiceExam/viewPracticeExam'],
    icon: 'fa fa-graduation-cap'
  }, {
    isSubMenu: false,
    to: '/settings/smtp',
    name: 'SMTP Config',
    icon: 'fa fa-cogs'
  }, {
    isSubMenu: false,
    to: '/settings/test',
    name: 'Test',
    subPath: ['/settings/test/addtest', '/settings/test/view'],
    icon: 'fa fa-th-list'
  }, {
    isSubMenu: false,
    to: '/settings/plan-master',
    name: 'Plan',
    icon: 'fa fa-battery-three-quarters'
  }, {
    isSubMenu: false,
    to: '/settings/weightage',
    name: 'Weightage',
    icon: 'fa fa-balance-scale'
  }, {
    isSubMenu: false,
    to: '/settings/freeCredits',
    name: 'FreeCredits',
    icon: 'fa fa-ticket'
  }
  ],
  "COLLEGE_STUDENT": [{
    isSubMenu: false,
    to: "/student/student-test",
    name: "Dashboard",
    icon: 'fa fa-home'
  }, {
    isSubMenu: false,
    name: 'Profile',
    to: '/student/profile',
    isDefault: true,
    icon: 'fa fa-users'
  }, {
    isSubMenu: false,
    to: '/student/company-offer',
    name: 'Offered Companies',
    icon: 'fa fa-briefcase'
  }, {
    isSubMenu: false,
    to: '/student/practice-exam',
    name: 'Practice Exam',
    icon: () => <FaClipboard style={{ fontSize: '1.3rem', color: '#3b489e' }} />,
    isReactIcon: true
  }
  ],
  "COMPETITOR": [{
    isSubMenu: false,
    to: "/competitor/testList",
    name: "Dashboard",
    icon: 'fa fa-home'
  }, {
    isSubMenu: false,
    to: "/competitor/company-offer",
    name: "Offered Companies",
    icon: 'fa fa-briefcase'
  }, {
    isSubMenu: false,
    to: "/competitor/update",
    name: "Profile",
    icon: 'fa fa-id-card-o'
  }
  ],
  "TEST_ADMIN": [{
    isSubMenu: false,
    to: "/testadmin/dashboard",
    name: "Dashboard",
    icon: 'fa fa-tachometer'
  }, {
    isSubMenu: false,
    name: 'Section',
    to: '/testadmin/section',
    icon: 'fa fa-columns'
  }, {
    isSubMenu: false,
    to: '/testadmin/grouptypes',
    name: 'GroupTypes',
    icon: 'fa fa-podcast'
  }, {
    isSubMenu: false,
    isDefault: true,
    to: '/testadmin/question',
    name: 'Questions',
    pathName: '/testadmin',
    icon: 'fa fa-question-circle-o'
  }, {
    isSubMenu: false,
    to: '/testadmin/setting',
    name: 'Setting',
    icon: 'fa fa-cog',
  }
  ],
  "PROCESS_ADMIN":[{
    isSubMenu: false,
    to: "/processadmin",
    name: "HOME",
    icon: 'fa fa-building-o'
  }]

}


export default sidebar;
