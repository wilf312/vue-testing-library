import 'jest-dom/extend-expect'

import App from './components/Router/App.vue'
import Home from './components/Router/Home.vue'
import About from './components/Router/About.vue'

import { render, fireEvent } from '../../src'

import { setTitle } from '../../setTitle'

const routes = [
  // meta 入れる
  { path: '/', component: Home, meta: { title: 'Home' } },
  { path: '/about', component: About, meta: { title: 'About' } },
  { path: '*', redirect: '/' }
]

afterEach(() => {
  document.title = ''
})

test('full app rendering/navigating', async () => {
  const { queryByTestId } = render(App, { routes })

  // normally I'd use a data-testid, but just wanted to show this is also possible
  expect(queryByTestId('location-display')).toHaveTextContent('/')
  await fireEvent.click(queryByTestId('about-link'))

  expect(queryByTestId('location-display')).toHaveTextContent('/about')
})

test('setting initial route', () => {
  const { queryByTestId } = render(App, { routes }, (vue, store, router) => {
    router.push('/about')
  })

  expect(queryByTestId('location-display')).toHaveTextContent('/about')
})

test('route to about', () => {
  const { queryByTestId, baseElement } = render(App, { routes }, (_, __, router) => {
    router.afterEach(setTitle)
    router.push('/about')
  })
  const titleDOM = baseElement.parentNode.querySelector('title')
  expect(titleDOM.innerHTML).toBe('About')
})


test('route to home', () => {
  const { queryByTestId, baseElement } = render(App, { routes }, (_, __, router) => {
    router.afterEach(setTitle)
    router.push('/home')
  })
  const titleDOM = baseElement.parentNode.querySelector('title')
  expect(titleDOM.innerHTML).toBe('Home')
})
