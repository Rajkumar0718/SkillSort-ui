const crumbsPathWithName = [{
  collegeadmin: [{ homeLink: "/college", name: "college" }],
  superadmin: [
    { homeLink: '/home', name: 'home' },
    { homeLink: "/collegeadmin", name: "superAdmin", '/collegeadmin': 'Colleges' }
  ]
}];
export default crumbsPathWithName;
