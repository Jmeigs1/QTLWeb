import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

import DatasetPage from './DatasetPage'
import GenePage from './GenePage'
import HomePage from './HomePage'
import SearchBar from './SearchBar'
import SideDrawer from './Drawer'
import SitePage from './SitePage'

import './Overrides.css'

class App extends Component {

    constructor(props) {
        super(props)

        this.state = {
            dataset: 'pqtl',
            loading: false,
        }
    }

    shouldComponentUpdate(prevProps, prevState){
        //this change will always happen by itself
        return prevState.dataset == this.state.dataset 
    }

    setDatasetFunc = (newDataset,cb) => {
        this.setState({
            dataset: newDataset,
        },cb)
    }

    setLoadingFunc = (newLoading,cb) => {
        this.setState({
            loading: newLoading,
        },cb)
    }

    render() {
        return (
            <Router>
                <div id="appContainer" className={"appContainer"} style = {{
                        paddingBottom: '40px',
                        minWidth: "1200px",
                    }}>
                    <SideDrawer/>
                    <SearchBar
                        dataset={this.state.dataset}
                        />
                    <Switch>
                        <Route exact path="/" 
                            render={
                                () => 
                                    (<HomePage
                                        dataset={this.state.dataset}
                                        setDatasetFunc={this.setDatasetFunc}
                                    />)
                            } />
                        <Route exact path="/gene/:geneSymbol/site/:site/chr/:chr/dataset/:dataset" 
                            render={
                                ({ match }) => {
                                    return (
                                        <SitePage 
                                            geneSymbol={match.params.geneSymbol}
                                            site={match.params.site}
                                            chr={match.params.chr}
                                            dataset={match.params.dataset}
                                            />
                                    )
                                }
                            }
                        />
                        <Route exact path="/gene/:geneSymbol/dataset/:dataset" 
                            render={
                                ({ match }) => {
                                    return (
                                        <GenePage geneSymbol={match.params.geneSymbol}
                                            dataset={match.params.dataset}
                                            setDatasetFunc={this.setDatasetFunc}
                                            loading={this.state.loading}
                                            setLoadingFunc={this.setLoadingFunc}/>
                                    )
                                }
                            }
                        />
                        <Route exact path="/datasets" 
                            render={
                                () => {
                                    return (
                                        <DatasetPage/>
                                    )
                                }
                            }
                        />
                    </Switch>
                </div>
                <div className="loading style-2" style={this.state.loading ? {} : {display: "none"}}>
                    <div className="loading-wheel"></div>
                </div>
            </Router>
          )
    }
}

export default App