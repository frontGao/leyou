import { login, localLogin, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import router, { resetRouter } from "@/router";

const state = {
    token: getToken("token"),
    localToken: getToken("local-token"),
    name: "",
    avatar: "",
    introduction: "",
    roles: [],
};

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token;
    },
    SET_LOCAL_TOKEN: (state, token) => {
        state.localToken = token;
    },
    SET_INTRODUCTION: (state, introduction) => {
        state.introduction = introduction;
    },
    SET_NAME: (state, name) => {
        state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles;
    },
};

const actions = {
    // user login
    login({ commit }, userInfo) {
        const { username, password } = userInfo;
        return new Promise((resolve, reject) => {
            localLogin({ username: username.trim(), password: password })
                .then((response) => {
                    const { data } = response;
                    commit("SET_LOCAL_TOKEN", data.token);
                    setToken("local-token", data.token);
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });

            login({ account: username.trim(), pwd: password })
                .then((response) => {
                    const { data } = response;
                    commit("SET_TOKEN", data.Token);
                    setToken("token", data.Token);
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.localToken)
                .then((response) => {
                    const { data } = response;

                    if (!data) {
                        reject("Verification failed, please Login again.");
                    }

                    const { roles, name, avatar, introduction } = data;

                    // roles must be a non-empty array
                    if (!roles || roles.length <= 0) {
                        reject("getInfo: roles must be a non-null array!");
                    }

                    commit("SET_ROLES", roles);
                    commit("SET_NAME", name);
                    commit("SET_AVATAR", avatar);
                    commit("SET_INTRODUCTION", introduction);
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });

            // commit("SET_ROLES", ["admin"]);
            // commit("SET_NAME", "Super Admin");
            // commit(
            //     "SET_AVATAR",
            //     "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"
            // );
            // commit("SET_INTRODUCTION", "I am a super administrator");
            // resolve();
        });
    },

    // user logout
    logout({ commit, state, dispatch }) {
        return new Promise((resolve, reject) => {
            logout(state.token)
                .then(() => {
                    commit("SET_LOCAL_TOKEN", "");
                    commit("SET_ROLES", []);
                    removeToken("local-token");
                    resetRouter();

                    // reset visited views and cached views
                    // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
                    dispatch("tagsView/delAllViews", null, { root: true });

                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });

            // commit("SET_TOKEN", "");
            // commit("SET_ROLES", []);
            // removeToken();
            // resetRouter();

            // // reset visited views and cached views
            // // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
            // dispatch("tagsView/delAllViews", null, { root: true });
            // resolve();
        });
    },

    // remove token
    resetToken({ commit }) {
        return new Promise((resolve) => {
            commit("SET_TOKEN", "");
            commit("SET_ROLES", []);
            removeToken("local-token");
            resolve();
        });
    },

    // dynamically modify permissions
    async changeRoles({ commit, dispatch }, role) {
        const token = role + "-token";

        commit("SET_TOKEN", token);
        setToken("local-token", token);

        const { roles } = await dispatch("getInfo");

        resetRouter();

        // generate accessible routes map based on roles
        const accessRoutes = await dispatch(
            "permission/generateRoutes",
            roles,
            { root: true }
        );
        // dynamically add accessible routes
        router.addRoutes(accessRoutes);

        // reset visited views and cached views
        dispatch("tagsView/delAllViews", null, { root: true });
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
