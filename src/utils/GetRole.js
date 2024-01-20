const getRole = (isAuthenticated) => {
  if (isAuthenticated) {
    let token = isAuthenticated.split(".")[1];
    let base64 = token.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload)
  }
  return "";
}

export default getRole;