// Rutas del módulo Cálculo
export default [
    {
        path: '',
        name: 'calculo-main',
        component: () => import('./views/calculo-main.vue'),
        meta: { title: 'Cálculo' }
    }
]
