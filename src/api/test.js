import request from "@/utils/request";

/**
 * @description 创建
 * @param {*} params { sid: str, status: int }
 * @returns
 */
export function CreateRequest(data) {
    return request({
        url: "/api/testing/create",
        method: "post",
        data,
    });
}

/**
 * @description 列表
 * @param {*} params
 * @returns
 */
export function ListRequest(params) {
    return request({
        url: "/api/testing/list",
        method: "get",
        params,
    });
}

/**
 * @description 获取详情
 * @param {*} params
 * @returns
 */
export function DetailRequest(params) {
    return request({
        url: "/api/testing/info",
        method: "get",
        params,
    });
}

/**
 * @description 编辑
 * @param {*} data
 * @returns
 */
export function EditRequest(data) {
    return request({
        url: "/api/testing/update",
        method: "post",
        data,
    });
}

/**
 * @description 删除
 * @param {*} data
 * @returns
 */
export function DeleteRequest(data) {
    return request({
        url: "/api/testing/delete",
        method: "post",
        data,
    });
}

/**
 * @description 设置状态
 * @param {*} data
 * @returns
 */
export function SetStateRequest(data) {
    return request({
        url: "/api/testing/set_status",
        method: "post",
        data,
    });
}
