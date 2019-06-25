import React from 'react'
import styled from 'styled-components'

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
`

export default () => (
    <div style = {{margin:'auto',width:'400px',paddingTop:'20px'}}>
        <Searchbox placeholder = "Search by gene" />
    </div>
)