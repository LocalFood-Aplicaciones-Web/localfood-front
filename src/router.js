import { createRouter, createWebHistory } from "vue-router";

/**
 * Importación de vistas globales esenciales
 * Estas vistas SIEMPRE deben existir en cualquier proyecto:
 * - Home (pantalla principal)
 * - PageNotFound (fallback para rutas inválidas)
 */
import Home from "@/shared/presentation/views/home.vue";
const PageNotFound = () => import("@/shared/presentation/views/page-not-found.vue");

const routes = [
    {
        path: "/home",
        name: "home",
        component: Home,
        meta: { title: "Inicio" }
    },

    {
        path: "/",
        redirect: "/home"
    },
    {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: PageNotFound,
        meta: { title: "Página no encontrada" }
    }
];

// Crear instancia del router
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

// Cambiar el título dinámico y dejar logs de navegación
router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from?.name} to ${to?.name}`);

    const baseTitle = "LocalFood";
    document.title = to.meta?.title
        ? `${to.meta.title} - ${baseTitle}`
        : baseTitle;

    next();
});

export default router;
