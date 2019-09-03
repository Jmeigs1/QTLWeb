import React,{Component} from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import Autocomplete from 'react-autocomplete'
import axios from 'axios'
import { debounce } from 'throttle-debounce'

import Colors from './UI/Colors'
import {DatasetDisplayName,Datasets} from './UI/Datasets'

const Searchbox = styled.input`
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    padding: 0.375em 1.5em 0.375em 0.75em;
    border-color: rgb(108, 117, 125);
    border-style: solid;
    border-width: 1px;
    border-radius: 0.25em;
    background-position: right center;
    background-repeat: no-repeat;
    cursor: pointer;
    font-size: 1em;
    outline: currentcolor none medium;
    background-image: none;
    text-align: center;
    height:36px;
`

const SearchboxItem = styled.div`
  padding: 0.375em 0.75em;
  background: ${props => (props.isHighlighted ? Colors[3][1] : 'none')};
  cursor: pointer;
  font-size: 14px;
`

const defaultGenes = [
    {label: 'ENSG00000171163', value: 'ZNF692', link: '/gene/ZNF692'},
    {label: 'ENSG00000094975', value: 'SUCO', link: '/gene/SUCO'},
    {label: 'ENSG00000135845', value: 'PIGC', link: '/gene/PIGC'},
    {label: 'ZNF692', value: 'ZNF692', link: '/gene/ZNF692'},
    {label: 'PCSK9', value: 'PCSK9', link: '/gene/PCSK9'}
]

class SearchBar extends Component {

    constructor (props) {
        super(props)
        this.state = {
            suggestions: [],
        }

        this.getSuggestionsDebounce = debounce(
            250,
            this.getSuggestions
        )
    }

    getSuggestions = value => {

        if(value == ''){
            
            let ret = [{
                label:      "No results found",
            }]
            this.setState({ suggestions: ret })

            return
        }

        axios({
            method: "get",
            url: window.location.origin + "/api/es/" + value
        }).then(res => {

            if(res.data && res.data.hits && res.data.hits.hits && res.data.hits.hits.length > 0){
                const results = res.data.hits.hits.map(h => {

                    let field

                    for(var prop in h.highlight){
                        if(prop != "Dataset"){
                            field = prop
                            break
                        }
                    }

                    let geneSymbol = h._source.NonIndexedData.GeneSymbol

                    let geneSymbolLabel = 
                        h._source[field] == geneSymbol 
                        ? `${geneSymbol}` 
                        : `${h._source[field]} (${geneSymbol})`

                    let datasetLabel = h._source.Dataset ? `(${DatasetDisplayName[h._source.Dataset].displayName})` : ``

                    let label = `${geneSymbolLabel} ${datasetLabel}`

                    let linkDataset = h._source.Dataset ? DatasetDisplayName[h._source.Dataset].value : this.props.dataset

                    let ret = {
                        label:      label,
                        value:      geneSymbol,
                        link:       `/gene/${geneSymbol}/dataset/${linkDataset}`,
                        dataset:    h._source.Dataset,
                        highlight:  h._source[field]
                    }
                    return ret
                })
                this.setState({ suggestions: results })
            }
            else {
                let ret = [{
                    label:      "No results found",
                }]
                this.setState({ suggestions: ret })
            }
        })
    }

    renderInput = props => {
        const { id } = this.props
        const { ref, ...rest } = props
        return <Searchbox {...rest} id={id} ref={ref} />
    }

    componentDidUpdate() {

    }

    render() {
        return (
            <div style={this.props.style ? this.props.style : {display: 'inline-block',width: '250px', paddingTop: '20px'}}>
                <Autocomplete
                    //The following line is important to make autoHighlighting work but breaks the
                    //value argument to most functions related to items as it sets it to the input text
                    getItemValue={(item) => this.state.value}
                    items={this.state.suggestions}
                    inputProps={{
                        placeholder: "Search by gene",
                    }}
                    renderInput={this.renderInput}
                    renderItem={(item, isHighlighted) =>
                        <SearchboxItem key={item.label} isHighlighted={isHighlighted}>
                            {item.label}
                        </SearchboxItem>
                    }
                    wrapperStyle={{ position: 'relative',width:"100%" }}
                    menuStyle={{ position: 'absolute', top: '36px', left: 0,backgroundColor:"white" }}
                    value={this.state.value}
                    onChange={e => {
                        let trimVal = e.target.value.trim()
                        this.setState({ value: trimVal })
                        this.getSuggestionsDebounce(trimVal)
                    }}
                    onSelect={(unusedVar_Value,item) => {
                        if(item.link){

                            this.props.history.push({
                                pathname: item.link,
                            })

                            this.setState({
                                value: item.highlight
                            })
                        }
                    }}
                />
            </div>
        )
    }
}

export default withRouter(SearchBar);