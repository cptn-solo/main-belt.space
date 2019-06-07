import Vue from "vue";
import Router from "vue-router";
import routes from './routes'
import store from '../state/store'

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

// Before each route evaluates...
router.beforeEach(async (routeTo, routeFrom, next) => {
  // If this isn't an initial page load...
  try {
    if (routeFrom.name !== null) {
    } else if (!routeTo.params.exception) {
      try {
        const referrerCode = routeTo.query['code']
        if (referrerCode) {
          store.dispatch('settings/setReferrer', referrerCode)
        }
      } catch (error) {
        // silent
      }

      try {
        await store.dispatch('noscatter/prepareAPI') // will be overriden during login (see checkSavedCredentials below)
        await store.dispatch('engine/checkSavedCredentials')
      } catch (ex) {
        throw ex
      }
    }

    // Check if auth is required on this route
    // (including nested routes).
    const authRequired = routeTo.matched.some(route => route.meta.authRequired)

    // If auth isn't required for the route, just continue.
    if (!authRequired) return next()

    // If auth is required and the user is logged in...
    if (store.getters['userProfile/accountname']) return next()

    try {
      if (await store.dispatch('engine/checkSavedCredentials')) return next()
    } catch (ex) {
      throw ex
    }

    // If auth is required and the user is NOT currently logged in,
    // redirect to login.
    redirectToLogin()
  } catch (ex) {
    redirectToLogin(ex)
  }

  function redirectToLogin(ex = null) {
    // Pass the original route to the login component
    next({ name: 'home', params: { exception: ex } })
  }
})

router.beforeResolve(async (routeTo, routeFrom, next) => {
  // Create a `beforeResolve` hook, which fires whenever
  // `beforeRouteEnter` and `beforeRouteUpdate` would. This
  // allows us to ensure data is fetched even when params change,
  // but the resolved route does not. We put it in `meta` to
  // indicate that it's a hook we created, rather than part of
  // Vue Router (yet?).
  try {
    // For each matched route...
    for (const route of routeTo.matched) {
      await new Promise((resolve, reject) => {
        // If a `beforeResolve` hook is defined, call it with
        // the same arguments as the `beforeEnter` hook.
        if (route.meta && route.meta.beforeResolve) {
          route.meta.beforeResolve(routeTo, routeFrom, (...args) => {
            if (args.length) {
              next(...args)
              reject(new Error('Redirected'))
            } else {
              resolve()
            }
          })
        } else {
          // Otherwise, continue resolving the route.
          resolve()
        }
      })
    }
    // If a `beforeResolve` hook chose to redirect, just return.
  } catch (error) {
    return
  }

  // If we reach this point, continue resolving the route.
  next()
})

// When each route is finished evaluating...
router.afterEach((routeTo, routeFrom) => {
  // Complete the animation of the route progress bar.
})

export default router;