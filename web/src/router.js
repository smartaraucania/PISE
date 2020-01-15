import Vue from 'vue'
import Router from 'vue-router'
import DashboardLayout from '@/layout/DashboardLayout'
import AuthLayout from '@/layout/AuthLayout'

Vue.use(Router)

export const router = new Router({
  linkExactActiveClass: 'active',
  routes: [{
      path: '/',
      redirect: 'home',
      component: DashboardLayout,
      children: [{
          path: '/home',
          name: 'inicio',
          meta: {
            title: 'Panel PISE'
          },
          component: () => import('./views/Home.vue')
        },
        {
          path: '/emergencyTypes',
          name: 'Administrar Tipos de Emergencia',
          meta: {
            title: 'Tipos de Emergencia | PISE'
          },
          component: () => import('./views/Superuser/EmergencyTypeManager.vue')
        },
        {
          path: '/eventsTypes',
          name: 'Administrar Tipos de Eventos Admin',
          meta: {
            title: 'Tipos de Eventos | PISE'
          },
          component: () => import('./views/Superuser/EventTypeManager.vue')
        },
        {
          path: '/users',
          name: 'Administrar Usuarios',
          meta: {
            title: 'Usuarios | PISE'
          },
          component: () => import('./views/Superuser/UserManager.vue')
        },
        {
          path: '/admin/users',
          name: 'Administrar Usuarios Admin',
          meta: {
            title: 'Usuarios | PISE'
          },
          component: () => import('./views/Admin/UserAdminManager.vue')
        },
        {
          path: '/admin/actors',
          name: 'Administrar Actores',
          meta: {
            title: 'Actores | PISE'
          },
          component: () => import('./views/Admin/ActorsManager.vue')
        },
        {
          path: '/admin/emergencyTypes',
          name: 'Administrar Tipos de Emergencia Admin',
          meta: {
            title: 'Tipos de Emergencia | PISE'
          },
          component: () => import('./views/Admin/EmergencyTypeAdminManager.vue')
        },
        {
          path: '/admin/eventsTypes',
          name: 'Administrar Tipos de Eventos',
          meta: {
            title: 'Tipos de Eventos | PISE'
          },
          component: () => import('./views/Admin/EventTypeAdmin.vue')
        },
        {
          path: '/emergencies',
          name: 'Emergencias',
          meta: {
            title: 'Emergencias | PISE'
          },
          component: () => import('./views/Superuser/EmergenciesView.vue')
        },
        {
          path: '/emergency',
          name: 'Emergencia',
          meta: {
            title: 'Emergencia | PISE'
          },
          props: true,
          component: () => import('./views/Superuser/EmergencyView.vue')
        },
      ]
    },
    {
      path: '/',
      redirect: 'login',
      component: AuthLayout,
      children: [{
        path: '/login',
        name: 'login',
        meta: {
          title: 'Ingresar | PISE'
        },
        component: () => import('./views/Login.vue')
      }]
    }
  ]
});

var jwt = require('jsonwebtoken');
const constants = require('./constants');
var loggedUser;

router.beforeEach(async (to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const allPages = ["/login", "/home", "/users", "/404", "/403",
    "/emergencyTypes", "/users", "/emergency", "/emergencies", "/eventsTypes",
    "/admin/users", "/admin/actors", "/admin/utils", "/admin/emergencyTypes", "/admin/eventsTypes"
  ];
  const publicPages = ["/login", "/404", "/403"];
  const superUserPages = ["/users", "/emergencyTypes", "/eventsTypes", "/emergency", "/emergencies"];
  const gobPages = ["/emergency", "/emergencies"];
  const adminPages = ["/admin/utils", "/admin/users", "/admin/actors", "/admin/emergencyTypes", "/admin/eventsTypes"];
  const allPagesValidation = !allPages.includes(to.path);
  const authRequired = !publicPages.includes(to.path);
  const superUserRequired = superUserPages.includes(to.path);
  const gobUserRequired = gobPages.includes(to.path);
  const adminRequired = adminPages.includes(to.path);
  const loggedIn = localStorage.getItem("token");

  if (loggedIn) {
    if (!loggedUser) {
      console.log(loggedIn)
      jwt.verify(loggedIn, constants.secret, function (err, decoded) {
        if (err) return next({
          path: "/403",
        });
        loggedUser = {
          id: decoded.id,
          name: decoded.name,
          lastName: decoded.lastName,
          isAdmin: decoded.permissions[0],
          isSuperUser: decoded.permissions[1],
          isGovernment: decoded.permissions[2],
          actorType: decoded.actorType,
          office: decoded.office
        }
        Vue.prototype.$loggedUser = loggedUser;
      });
    }
    console.log(loggedIn)
  }

  if (authRequired && !loggedIn) {
    return next({
      path: "/login",
    });
  }

  if (adminRequired && !loggedUser.isAdmin) {
    alert("SIN PERMISOS. VUELVE ATRAS.")
    return next({
      path: "/403",
    });
  }

  if (superUserRequired && !loggedUser.isSuperUser) {
    if (gobUserRequired && loggedUser.isGovernment) {
      document.title = to.meta.title;

      return next();
    }
  
    if (superUserRequired && !loggedUser.isAdmin) {
      alert("SIN PERMISOS. VUELVE ATRAS.")
      return next({
        path: "/403",
      });
    }
  }
  
  if (gobUserRequired && !loggedUser.isGovernment && !loggedUser.isSuperUser) {
    if (gobUserRequired && !loggedUser.isAdmin) {
      alert("SIN PERMISOS. VUELVE ATRAS.")
      return next({
        path: "/403",
      });
    }
  }

  if (allPagesValidation) {
    alert("NO ENCONTRADO. VUELVE ATRAS.")
    return next({
      path: "/404",
    });
  }

  document.title = to.meta.title;

  next();
});

export default router;