export const isEmpty = value => value === undefined || value === null || value === '' || value.length === 0;

export const isValidName = (name) => {
    let check = /^[a-zA-Z ]+$/g;
    return check.test(name);
}

export function isValidEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export function isValidMobileNo(number) {
    return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4,6})$/.test(number);
}

export function isValidPassword(password) {
    return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/.test(password);
}

export function isValidSmtpHost(password) {
    return /^[a-z.]*$/.test(password);
}

export function isValidWebSite(site) {
    return /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/.test(site);
}
export function isVaildnum(num) {
    return /[^0-9.]/g.test(num);
}

export function isRoleValidation() {
    const isAuthenticated = localStorage.getItem('jwtToken') ? localStorage.getItem('jwtToken') : localStorage.getItem("token");
    if (isAuthenticated) {
        let token = isAuthenticated.split(".")[1];
        let base64 = token.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            // let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        var payload = JSON.parse(jsonPayload);
    }
    const role = payload?.role?.split(",");
    if (role?.length > 1) {
        return role;
    }
    return payload?.role;
}
