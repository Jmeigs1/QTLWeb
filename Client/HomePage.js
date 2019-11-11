import React from 'react'
import styled from 'styled-components'

import { Page, Link, ExternalLink } from './UI/BasicElements'
import InlineDiv from './UI/InlineDiv'
import Citations from './UI/Citations'
import { pQTL, overlap } from './Data/NotableGenes'

import SearchBar from './SearchBar'
import NotableGenesTable from './NotableGenesTable'

const InfoPage = styled(Page)`
    p {
    margin-bottom: 1em;
    line-height: 1.4;
    }
`

const HomePageDiv = styled(InfoPage)`
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

const GraphicDiv = styled.img`
    box-sizing: border-box;
    width: 100%;
    box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12);
`

const HomePage = (props) => 
    {
        document.title = 'BrainQTL'

        return (
            <HomePageDiv>
                <HeadingContainer>
                    <h3>
                        A resource for genetic investigations of the human brain
                    </h3>
                </HeadingContainer>

                <GraphicDiv src="./assets/infographic.png"/>

                <br />

                <h3>
                    Search - Visualization and Download
                </h3>
                <p>
                    Search for genetic variants associated with quantitative molecular traits by gene name,
                    UniProt protein ID, Ensembl gene ID, reference SNP ID, or SNP location
                </p>
                <p>
                    Please note that the scope of the analysis and search does not include genes from mitochondrial or sex chromosomes
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
                            {/* <ExternalLink 
                                href="https://brainqtl-downloads.s3.amazonaws.com/pQTLresults_for_brainqtl_Aug21.csv"
                                download
                                type="application/octet-stream"
                                >
                                pQTL
                            </ExternalLink> */}
                            <ExternalLink 
                                href="javascript:void(null)"
                                download
                                type="application/octet-stream"
                                >
                                pQTL (Coming Soon)
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
                            {/* <ExternalLink 
                                href="https://brainqtl-downloads.s3.amazonaws.com/pQTLoverlapeQTL_for_brainqtl_Aug21.csv"
                                download
                                type="data:text/csv;charset=utf-8"
                                >
                                pQTL
                            </ExternalLink> */}
                            <ExternalLink 
                                href="javascript:void(null)"
                                download
                                type="data:text/csv;charset=utf-8"
                                >
                                pQTL (Coming Soon)
                            </ExternalLink>
                            {' '}
                            {/* <ExternalLink 
                                href="https://brainqtl-downloads.s3.amazonaws.com/eQTLoverlappQTL_for_brainqtl_Aug21.csv"
                                download        
                                type="data:text/csv;charset=utf-8"
                                >
                                eQTL
                            </ExternalLink> */}
                            <ExternalLink 
                                href="javascript:void(null)"
                                download        
                                type="data:text/csv;charset=utf-8"
                                >
                                eQTL (Coming Soon)
                            </ExternalLink>
                        </p>
                    </div>
                </InlineDiv>

                <h3>
                    Notable Genes
                </h3>

                <p>
                    Genes within the results set with the largest number of significant results
                </p>

                <InlineDiv>
                    <div>
                        <h4>
                            pQTL
                        </h4>
                        <NotableGenesTable
                            dataset='pqtl'
                            geneData={pQTL}/>
                    </div>
                    <div>
                        <h4>
                            pQTL vs eQTL
                        </h4>
                        <NotableGenesTable
                            dataset='overlap'
                            geneData={overlap}/>
                    </div>
                </InlineDiv>
                <Citations/>
            </HomePageDiv>
        )
    }

export default HomePage