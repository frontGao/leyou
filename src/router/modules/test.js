import Layout from "@/layout";

const testAdminRouter = {
    path: "/",
    component: Layout,
    redirect: "/list",
    children: [
        {
            path: "list",
            component: () => import("@/views/test-list/index.vue"),
            name: "list",
            meta: { title: "测试列表" },
        },
    ],
};
export default testAdminRouter;
