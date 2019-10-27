import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import Main from './main.js'

window.addEventListener('load', () => {
  ReactDOM.render(
    <BrowserRouter>
      <Route component={Main} />
      <Switch>
        <Redirect exact from='/other/compression' to='/compression' />
        <Redirect exact from='/other/khanacademy' to='/khanacademy' />
        <Redirect exact from='/other/books' to='/books' />
        <Redirect exact from='/other/articles' to='/articles' />
        <Redirect exact from='/other/advice' to='/advice' />
        <Redirect exact from='/other/mozilla' to='/mozilla' />
        <Redirect exact from='/other/morseCode' to='/morseCode' />
      </Switch>
    </BrowserRouter>, document.getElementById('mountPoint'))
})
