import React from 'react'
import styled from 'styled-components'

import Colors from './UI/Colors'
import { Page, Link, ExternalLink } from './UI/BasicElements'
import InlineDiv from './UI/InlineDiv'
import Citations from './UI/Citations'
import { pQTL, overlap } from './Data/NotableGenes'


import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'

import SearchBar from './SearchBar'
import NotableGenesTable from './NotableGenesTable'

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

        document.title = 'BrainQTL'

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
                    style={{ display: 'inline-block', width: '700px', padding: '20px 0', margin: "0 auto" }} />

                <h3>
                    Datasets
                </h3>

                <InlineDiv>
                    <div style={{
                        boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.2), \
                        0px 1px 1px 0px rgba(0,0,0,0.14), \
                        0px 2px 1px -1px rgba(0,0,0,0.12)",
                        background: "#FFF",
                        padding:"10px",
                    }}>
                        <h3 style={{}}>
                            pQTL
                        </h3>
                        <p>
                            View SNVs associated with protein abundance
                        </p>
                        <br/>
                        <p>
                            <Link to="/datasets">
                                Detailed Dataset Decription
                            </Link>
                        </p>
                        <p>
                            {'Download Dataset: '}
                            <ExternalLink 
                                href="https://brainqtl-downloads.s3.amazonaws.com/pQTLresults_for_brainqtl_Aug21.csv"
                                download
                                type="application/octet-stream"
                                >
                                pQTL
                            </ExternalLink>
                        </p>
                    </div>
                    <div style={{
                        boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.2), \
                        0px 1px 1px 0px rgba(0,0,0,0.14), \
                        0px 2px 1px -1px rgba(0,0,0,0.12)",
                        background: "#FFF",
                        padding:"10px",
                    }}>
                        <h3 style={{}}>
                            pQTL vs eQTL
                        </h3>
                        <p>
                            Compare SNVs associated with both protein abundance and gene expression
                        </p>
                        <p>
                            <Link to="/datasets">
                                Detailed Dataset Decription
                            </Link>
                        </p>
                        <p>
                            {'Download Dataset: '}
                            <ExternalLink 
                                href="https://brainqtl-downloads.s3.amazonaws.com/pQTLoverlapeQTL_for_brainqtl_Aug21.csv"
                                download
                                type="data:text/csv;charset=utf-8"
                                >
                                pQTL
                            </ExternalLink>
                            {' '}
                            <ExternalLink 
                                href="https://brainqtl-downloads.s3.amazonaws.com/eQTLoverlappQTL_for_brainqtl_Aug21.csv"
                                download        
                                type="data:text/csv;charset=utf-8"
                                >
                                eQTL
                            </ExternalLink>
                        </p>
                    </div>
                </InlineDiv>

                <h3>
                    Notable Genes
                </h3>

                <p>
                    Genes within the results set with the largest number of bonferroni corrected significant results
                </p>

                <InlineDiv>
                    <div>
                        <h4>
                            pQTL
                        </h4>
                        <NotableGenesTable
                            dataset={dataset}
                            geneData={pQTL}/>
                    </div>
                    <div>
                        <h4>
                            pQTL vs eQTL
                        </h4>
                        <NotableGenesTable
                            dataset={dataset}
                            geneData={overlap}/>
                    </div>
                </InlineDiv>
                <Citations/>
            </HomePage>
        )
    }