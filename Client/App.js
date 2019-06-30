import React from 'react'
// import styled from 'styled-components'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"

import NavBar from './NavBar'
import SearchBar from './SearchBar'
import HomePage from './HomePage'
import GenePage from './GenePage'

export default () => (
    <Router>
        <div>
            <NavBar/>
            <SearchBar/>
            <Route exact path="/" component={HomePage} />
            <Route path="/display" component={GenePage} />
            <Route path="/gene/:geneSymbol" 
                render={
                    ({ match }) => {
                        return (
                            <GenePage geneSymbol={match.params.geneSymbol}/>
                        )
                    }
                }
            />
        </div>
    </Router>
  )