import React from 'react'
import styled from 'styled-components'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"

import NavBar from './NavBar'
import SearchBar from './SearchBar'
import HomePage from './HomePage'
import DisplayPage from './DisplayPage'

export default () => (
    <Router>
        <div>
            <NavBar/>
            <SearchBar/>
            <Route exact path="/" component={HomePage} />
            <Route path="/display" component={DisplayPage} />
        </div>
    </Router>
  )