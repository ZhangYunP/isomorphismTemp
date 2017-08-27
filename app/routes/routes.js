import App from '../component/app.jsx'
import Zero from '../component/zero.jsx'
import First from '../component/first.jsx'
import Second from '../component/second.jsx'

const routes = {
  path: '/',
  component: App,
  indexRoute: {
    component: Zero
  },
  childRoutes: [
    { path: 'first', component: First },
    { path: 'second', component: Second }
  ]
}
export default routes
