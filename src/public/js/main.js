import React from 'react'
import DocumentTitle from './documentTitle.js'
import TopBar from './topBar.js'
import { Route, Switch } from 'react-router-dom'
import Blog from './blog.js'
import BlogPostList from './blogPostList.js'
import Compression from './compression.js'
import Resume from './resume.js'
import Math from './math.js'
import RemoteViewer from './remoteViewer.js'
import StackExchangeListViewer from './stackExchangeListViewer.js'

export default class Main extends React.Component {
  render () {
    return (
      <div>
        <DocumentTitle pathname={window.location.pathname} />
        <TopBar />
        <div className='mainBody'>
          <Switch>
            <Route path='/' exact component={BlogPostList} />
            <Route path='/compression' exact component={Compression} />
            <Route path='/compression/:name' exact component={Compression} />

            <Route path='/blog' exact component={Blog} />
            <Route path='/blog/**' exact component={Blog} />
            <Route path='/page/**' exact component={Blog} />

            <Route path='/projects' exact component={RemoteViewer} />
            <Route path='/resume' exact component={Resume} />
            <Route path='/other' exact component={RemoteViewer} />
            <Route path='/about' exact component={RemoteViewer} />
            <Route path='/contact' exact component={RemoteViewer} />

            <Route path='/math' exact component={Math} />
            <Route path='/math/:name' exact component={Math} />

            <Route path='/faq' exact component={RemoteViewer} />
            <Route path='/khanacademy' exact component={RemoteViewer} />
            <Route path='/links' exact component={RemoteViewer} />
            <Route path='/books' exact component={RemoteViewer} />
            <Route path='/articles' exact component={RemoteViewer} />
            <Route path='/advice' exact component={RemoteViewer} />
            <Route path='/mozilla' exact component={RemoteViewer} />
            <Route path='/mozilla/new' exact component={RemoteViewer} />
            <Route path='/universityClasses' exact component={RemoteViewer} />
            <Route path='/braille' exact component={RemoteViewer} />
            <Route path='/morseCode' exact component={RemoteViewer} />
            <Route path='/running' exact component={RemoteViewer} />
            <Route path='/stackexchange' exact component={RemoteViewer} />
            <Route path='/stackexchange-:social/:page' exact component={StackExchangeListViewer} />
            <Route path='/stackexchange-:social/:page' exact component={StackExchangeListViewer} />
            <Route path='/stackexchange-:social/:page' exact component={StackExchangeListViewer} />
          </Switch>
        </div>
      </div>)
  }
}
