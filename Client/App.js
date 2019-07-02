import React from 'react'
// import styled from 'styled-components'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"

import SearchBar from './SearchBar'
import HomePage from './HomePage'
import GenePage from './GenePage'
import './Overrides.css';
import SideDrawer from './Drawer'

export default () => (
    <Router style={{background: 'linear-gradient(to right,#C3E5E7, #FFFFFF)'}}>
        <div className={"appContainer"}>
            <SideDrawer/>
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