import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/teacher',
    component: Layout,
    redirect: '/teacher/table',
    name: '讲师管理',
    meta: { title: '讲师管理', icon: 'example' },
    children: [
      {
        path: '/list',
        name: '讲师列表',
        component: () => import('@/views/teacher/list/index'),
        meta: { title: '讲师列表', icon: 'table' }
      },
      {
        path: '/save',
        name: '添加讲师',
        component: () => import('@/views/teacher/save/index'),
        meta: { title: '添加讲师', icon: 'tree' }
      },
      {
        path: '/update/:id',
        name: '修改讲师',
        component: () => import('@/views/teacher/save/index'),
        meta: { title: '修改讲师', icon: 'tree' },
        hidden: true
      }
    ]
  },
  {
    path: '/subject',
    component: Layout,
    redirect: '/subject/table',
    name: '讲师管理',
    meta: { title: '课程分类', icon: 'example' },
    children: [
      {
        path: '/subject/list',
        name: '课程列表',
        component: () => import('@/views/subject/list/index'),
        meta: { title: '课程列表', icon: 'table' }
      },
      {
        path: '/upload',
        name: '上传课程',
        component: () => import('@/views/subject/upload/index'),
        meta: { title: '上传课程', icon: 'tree' }
      }
    ]
  },
  {
    path: '/course',
    component: Layout,
    redirect: '/course/index',
    name: '讲师管理',
    meta: { title: '课程管理', icon: 'example' },
    children: [
      {
        path: '/course/list',
        name: '课程列表',
        component: () => import('@/views/course/list'),
        meta: { title: '课程列表', icon: 'table' }
      },
      {
        path: '/course/publish1',
        name: '上传课程',
        component: () => import('@/views/course/publish1'),
        meta: { title: '发布课程', icon: 'tree' }
      },
      {
        path: '/course/publish1/:id',
        name: '上传课程',
        component: () => import('@/views/course/publish1'),
        meta: { title: '发布课程', icon: 'tree' },
        hidden: true
      },
      {
        path: '/course/publish2/:id',
        name: '上传课程',
        component: () => import('@/views/course/publish2'),
        meta: { title: '发布课程', icon: 'tree' },
        hidden: true
      },
      {
        path: '/course/publish3/:id',
        name: '上传课程',
        component: () => import('@/views/course/publish3'),
        meta: { title: '发布课程', icon: 'tree' },
        hidden: true
      }
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    redirect: '/statistics/table',
    name: 'Example',
    meta: { title: '统计分析', icon: 'example' },
    children: [
      {
        path: '/statistics/createData',
        name: 'Table',
        component: () => import('@/views/statistics/createData'),
        meta: { title: '生成数据', icon: 'table' }
      },
      {
        path: '/statistics/showChart',
        name: 'Tree',
        component: () => import('@/views/statistics/showChart'),
        meta: { title: '图表显示', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: '表单', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: '嵌套菜单',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: '菜单1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: '菜单1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: '菜单1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: '菜单1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: '菜单1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: '菜单1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: { title: '菜单2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: '外链', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
