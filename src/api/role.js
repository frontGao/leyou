// import request from "@/utils/request";
import localRequest from "@/utils/local-request";

export function getRoutes() {
    return localRequest({
        url: "/vue-element-admin/routes",
        method: "get",
    });
}

export function getRoles() {
    return localRequest({
        url: "/vue-element-admin/roles",
        method: "get",
    });
}

export function addRole(data) {
    return localRequest({
        url: "/vue-element-admin/role",
        method: "post",
        data,
    });
}

export function updateRole(id, data) {
    return localRequest({
        url: `/vue-element-admin/role/${id}`,
        method: "put",
        data,
    });
}

export function deleteRole(id) {
    return localRequest({
        url: `/vue-element-admin/role/${id}`,
        method: "delete",
    });
}
