import React, { Component } from 'react'
import styled from 'styled-components'

import ScatterPlot from './ScatterPlot'

const Page = styled.div`
    box-sizing: border-box;
    width: 100%;
    max-width: 1200px;
    padding: 0 15px;
    margin: 0 auto 40px;
    font-size: 16px;
`

const FlexDiv = styled.div`
    display: flex;
    flex-direction: right;

    > dt {width:200px; font-weight:bold};
    > dd {width:250px;margin: 0 10px};
`

const CardBox = styled.div`
    margin: 10px;
    padding: 0 10px;
    float: left;
`
const TranscriptWrapper = styled.div`
    width:1000px;
    height:300px;
    margin: auto 10px;
    background-color:black
`



const Genecard = () => (
    <CardBox>
        <h2>ZNF692</h2>
        <h3>Zinc Finger Protein 692</h3> 
        <dl>
            <FlexDiv><dt>Ensembl gene ID: </dt> <dd>ENSG00000171163</dd></FlexDiv>
            <FlexDiv><dt>Ensembl transcript ID: </dt> <dd>ENST00000451251</dd></FlexDiv>
            <FlexDiv><dt>Uniprot: </dt> <dd>?</dd></FlexDiv>
            <FlexDiv><dt>Location: </dt> <dd>Chr1: 249144205 - 249153343</dd></FlexDiv>
        </dl>
    </CardBox>
)

const TranscriptBox = () => (   
    <TranscriptWrapper>
        Transcript
    </TranscriptWrapper>

)

export default () => (
    <Page>
        <Genecard/>
        <ScatterPlot size={[1000,500]}/>
        {/* <TranscriptBox/> */}
    </Page>
)