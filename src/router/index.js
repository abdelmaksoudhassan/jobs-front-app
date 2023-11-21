import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { getSession } from '../helpers/functions'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/authentication',
      name: 'authentication',
      component: () => import('../views/AuthenticationView.vue'),
      redirect: {name: 'login'},
      children:[
        {
          path: '/login',
          name: 'login',
          component: () => import('../views/Authentication/LoginView.vue')
        },
        {
          path: '/signup',
          name: 'signup',
          component: () => import('../views/Authentication/SignupView.vue')
        }
      ]
    },
    {
      path: '/posts',
      name: 'posts',
      component: () => import('../views/PostsView.vue')
    },
    {
      path: '/post/:id',
      name: 'post',
      component: () => import('../views/PostView.vue')
    },
    {
      path: '/manage-Category',
      name: 'managecategory',
      component: () => import('../views/ManageCategoryView.vue'),
      meta: { needAdminAuth: true }
    },
    {
      path: '/manage-Jobs',
      name: 'managejobs',
      component: () => import('../views/ManageJobsView.vue'),
      redirect:{name:'postjob'},
      children:[
        {
          path: '/post-job',
          name: 'postjob',
          component: () => import('../views/ManageJobs/PostJobView.vue'),
          meta: { needAuth: true }
        },
        {
          path: '/pending-job',
          name: 'pendingjobs',
          component: () => import('../views/ManageJobs/PendingJobsView.vue'),
          meta: { needAdminAuth: true }
        },
        {
          path: '/my-jobs',
          name: 'myjobs',
          component: () => import('../views/ManageJobs/MyJobsView.vue'),
          meta: { needAuth: true }
        }
      ]
    },
    {
      path: '/profile-setting',
      name: 'profilesetting',
      component: () => import('../views/ProfileSettingView.vue'),
      redirect: {name:'updateinfo'},
      meta: { needAuth: true },
      children:[
        {
          path: '/update-info',
          name: 'updateinfo',
          component: () => import('../views/ProfileSetting/UpdateInfoView.vue')
        },
        {
          path: '/more-info',
          name: 'moreinfo',
          component: () => import('../views/ProfileSetting/MoreInfoView.vue')
        }
      ]
    },
    {
      path: '/profile/:id',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/manage-admins',
      name: 'manageadmins',
      component: () => import('../views/ManageAdminsView.vue'),
      meta: { needAdminAuth: true }
    },
    {
      path: '/complete-data',
      name: 'completedata',
      component: () => import('../views/CompleteDataView.vue'),
      meta: { needAuth: true }
    },
    {
      path:'/:catchAll(.*)',
      name:'error',
      component: () => import('../views/ErrorView.vue')
    }
  ]
})

router.beforeEach((to,from,next)=>{
  const session = getSession()
  const {token} = session
  if(to.matched.some(route => route.meta.needAuth)){
    if(! token){
      next({name:'login'})
    }else{
      next()
    }
  }else{
    next()
  }
})

router.beforeEach((to,from,next)=>{
  const session = getSession()
  const {token,role} = session
  if(to.matched.some(route => route.meta.needAdminAuth)){
    if(! token || role != 'admin'){
      next({name:'home'})
    }else{
      next()
    }
  }else{
    next()
  }
})

export default router