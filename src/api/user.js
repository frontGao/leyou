import request from "@/utils/request";
import localRequest from "@/utils/local-request";

export function localLogin(data) {
    return localRequest({
        url: "/vue-element-admin/user/login",
        method: "post",
        data,
    });
}

/**
 *
 * @param {*} { account: str, pwd: str }
 * @returns
 */
export function login(data) {
    return request({
        url: "/api/white/user/login",
        method: "post",
        data,
    });
}

export function getInfo(token) {
    return localRequest({
        url: "/vue-element-admin/user/info",
        method: "get",
        params: { token },
    });
}

export function logout() {
    return localRequest({
        url: "/vue-element-admin/user/logout",
        method: "post",
    });
}
