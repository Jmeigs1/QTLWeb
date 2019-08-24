import React from 'react'
// import styled from 'styled-components'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

import HomePage from './HomePage'
import GenePage from './GenePage'
import SearchBar from './SearchBar';
import SitePage from './SitePage'
import SideDrawer from './Drawer'
import { ScrollToTop } from './UI/BasicElements'

import './Overrides.css';

export default () => (
    <Router>
        <ScrollToTop>
            <div className={"appContainer"} style = {{
                    paddingBottom: '40px',
                    minWidth: "1200px",
                }}>
                <SideDrawer/>
                <SearchBar/>
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/gene/:geneSymbol/site/:siteValue" 
                        render={
                            ({ match }) => {
                                return (
                                    <SitePage geneSymbol={match.params.geneSymbol} siteValue={match.params.siteValue}/>
                                )
                            }
                        }
                    />
                    <Route exact path="/gene/:geneSymbol" 
                        render={
                            ({ match }) => {
                                return (
                                    <GenePage geneSymbol={match.params.geneSymbol}/>
                                )
                            }
                        }
                    />
                </Switch>
            </div>
        </ScrollToTop>
    </Router>
  )