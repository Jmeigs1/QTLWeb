import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import Autosuggest from 'react-autosuggest' // https://github.com/moroshko/react-autosuggest
import axios from 'axios'

import Colors from './UI/Colors'
import { DatasetDisplayName } from './UI/Datasets'

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
    background: 'none';
    cursor: pointer;
    font-size: 14px;
`

const SearchBoxItemContainer = styled.div`
    position: relative;
    width: 100%;
    .react-autosuggest__suggestions-list {
        position: absolute;
        width: 100%
        background: white;
        list-style-type: none;
        padding: 0;
    }
    .react-autosuggest__suggestion--highlighted {
        background: ${Colors[3][1]};
    }
`

class SearchBar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            value: '',
            suggestions: [],
        }
    }

    /**
     * As input is typed in, save it to state
     */
    onValueChange = (event, { newValue }) => {
        this.setState({
            value: newValue,
        })
    }

    getSuggestions = value => {
        if (value == '') return [{
            label: "No results found",
        }]

        return axios({
            method: "get",
            url: window.location.origin + '/api/es/' + value,
        }).then(res => {
            if (res.data && res.data.hits && res.data.hits.hits && res.data.hits.hits.length > 0) {
                const hits = res.data.hits.hits.map(h => {
                    let field

                    for (var prop in h.highlight) {
                        if (prop != "Dataset") {
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

                    return {
                        label: label,
                        value: geneSymbol,
                        link: `/gene/${geneSymbol}/dataset/${linkDataset}`,
                        dataset: h._source.Dataset,
                        highlight: h._source[field],
                    }
                })
                return hits
            }
            else return [{
                label: "No results found",
            }]
        })

    }


    getSuggestionValue = suggestion => {
        return (suggestion.highlight || suggestion.label || 'NULL')
    }

    renderInputComponent = inputProps => {
        return (
            <Searchbox {...inputProps} aria-label="searchbar__input" />
        )
    }

    renderSuggestionsContainer = ({ containerProps, children }) => {
        if (!children) return
        return (
            <SearchBoxItemContainer {...containerProps} aria-label="searchbar__suggestions">
                {children}
            </ SearchBoxItemContainer>
        )
    }

    renderSuggestion = suggestion => {
        return (
            <SearchboxItem>
                {suggestion.highlight || suggestion.label || 'NULL'}
            </SearchboxItem>
        )
    }

    onSuggestionsFetchRequested = ({ value }) => {
        this.getSuggestions(value)
            .then((suggestions) => {
                this.setState({
                    suggestions: suggestions,
                })
            })
    }

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        })
    }

    onSuggestionSelected = (event, { suggestion, suggestionValue }) => {
        if (!suggestion) return
        this.props.history.push({
            pathname: suggestion.link,
        })
        this.setState({
            value: suggestionValue,
        })
    }

    render() {
        return (
            <div style={this.props.style ? this.props.style : { display: 'inline-block', width: '250px', paddingTop: '20px' }}>
                <Autosuggest
                    suggestions={this.state.suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={{
                        placeholder: 'Search for genome',
                        value: this.state.value,
                        onChange: this.onValueChange,
                    }}
                    renderInputComponent={this.renderInputComponent}
                    renderSuggestionsContainer={this.renderSuggestionsContainer}
                    onSuggestionSelected={this.onSuggestionSelected}
                    highlightFirstSuggestion={true}
                    onSuggestionHighlighted={this.onSuggestionHighlighted}
                />
            </div>
        )
    }
}

export default withRouter(SearchBar)