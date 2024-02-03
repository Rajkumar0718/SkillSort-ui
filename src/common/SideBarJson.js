import { FaClipboard } from "react-icons/fa";

const sidebar = {
  "ADMIN": [ {
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
    name: 'Vacancy',
    to: '/admin/vacancy',
    icon: 'fa fa-user-plus',
     subPath: ['/admin/vacancy/history','/admin/vacancy/result','/admin/vacancy/edit','/admin/vacancy/add','/admin/vacancy/skillsort'],
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
    subPath: ['/college/placement-coordinator/add','/college/placement-coordinator/edit']
  }, {
    isSubMenu: false,
    name: 'Students',
    isDefault: true,
    to: '/college',
    icon: 'fa fa-users',
    subPath: ['/college/add','/college/edit']
  }, {
    isSubMenu: false,
    to: '/college/collegeReport',
    name: 'SkillSort User Report',
    icon: 'fa fa-file-text-o'
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
    to: '/student/student-practice-exam',
    name: 'Practice Exam',
    icon: () => <FaClipboard style={{ fontSize: '1.3rem', color: '#3b489e' }}/>,
    isReactIcon:true
  },{
    isSubMenu: false,
    to: '/student/advertisement',
    name: 'Advertisement',
    icon: 'fa fa-bullhorn'
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
  },{
    isSubMenu: false,
    isDefault: true,
    to: '/testadmin/question',
    name: 'Questions',
    pathName: '/testadmin',
    icon: 'fa fa-question-circle-o'
  },{
    isSubMenu: false,
    to: '/testadmin/setting',
    name: 'Setting',
    icon: 'fa fa-cog',
  }
  ],
}


export default sidebar;
