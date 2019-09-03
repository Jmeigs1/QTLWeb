import React from 'react'
import styled from 'styled-components'

import Colors from './UI/Colors'
import { Page, Link } from './UI/BasicElements'
import Citations from './UI/Citations'

import SearchBar from './SearchBar'

const InfoPage = styled(Page)`
    p {
    margin-bottom: 1em;
    line-height: 1.4;
    }
`

const HomePage = styled(InfoPage)`
    display: flex;
    flex-direction: column;
    margin-top: 0px;
`

const HeadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 40px;
`

const GraphicDiv = styled.div`
    box-sizing: border-box;
    width: 100%;
    height: 300px;
    box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12);
    background-color: grey;
`

export default (props) => 
    {
        const dataset = props.dataset ? props.dataset : 'pqtl'

        return (
            <HomePage>
                <HeadingContainer>
                    <h1>BrainQTL</h1>
                    <h3>
                        A resource for genetic investigations of the human brain
                    </h3>
                </HeadingContainer>

                <GraphicDiv />

                <br />

                <h3>
                    Search - Visualization and Download
                </h3>
                <p>
                    Search for genetic variants associated with quantitative molecular traits by gene name,
                    UniProt protein ID, Ensembl gene ID, reference SNP ID, or SNP location
                </p>
                <SearchBar 
                    dataset={props.dataset}
                    style={{ display: 'inline-block', width: '700px', paddingTop: '20px', margin: "0 auto" }} />
                <h3>Examples</h3>
                <p>
                    <p>Gene : <Link to={`/gene/TAB1/dataset/${dataset}`}>TAB1</Link></p>
                    <p>SNP location (HSPB11) : <Link to={`/gene/HSPB11/dataset/${dataset}`}>chr1:54289020</Link></p>
                    <p>UniProt protein ID (ARHGAP22) : <Link to={`/gene/ARHGAP22/dataset/${dataset}`}>B4DED8</Link></p>
                    <p>RefSNP # (SHB) : <Link to={`/gene/SHB/dataset/${dataset}`}>rs7020901</Link></p>

                    
                </p>
                <h3>Download</h3>
                <p>
                    To download the results of an analysis, click <Link to='/Downloads'> here </Link>
                </p>
                <Citations/>
            </HomePage>
        )
    }