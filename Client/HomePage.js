import React from 'react'
import styled from 'styled-components'

import { Page, Link, ExternalLink, PopoutDiv } from './UI/BasicElements'
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
                    <h2>
                        A resource for genetic investigations of the human brain
                    </h2>
                </HeadingContainer>

                <GraphicDiv src="./assets/infographic.png"/>

                <br />

                <PopoutDiv>
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
                    <p>
                        <ExternalLink href="https://www.synapse.org/#!Synapse:syn24172458">
                            Study Description and Dataset Download
                        </ExternalLink>
                    </p>

                </PopoutDiv>
                <SearchBar 
                    dataset={props.dataset}
                    style={{ display: 'inline-block', width: '700px', padding: '20px 0', margin: "0 auto" }} />

                <h2>
                    Datasets
                </h2>

                <InlineDiv>
                    <PopoutDiv>
                        <h3>
                            ROS/MAP Brain pQTL
                        </h3>
                        <p>
                            Brain pQTL results for up to 330 individuals in the 
                            <ExternalLink 
                                href="https://www.rushu.rush.edu/research/departmental-research/religious-orders-study"
                                >
                                {" ROS "}
                            </ExternalLink> 
                            and 
                            <ExternalLink 
                                href="https://www.rushu.rush.edu/research/departmental-research/memory-and-aging-project"
                                >
                                {" MAP "}
                            </ExternalLink> 
                            studies from 
                            <ExternalLink 
                                href="https://doi.org/10.1101/816652"
                                >
                                {" Robins et al., 2021 "}
                            </ExternalLink>
                            <br/>
                            <br/>
                            Results were adjusted for the last clinical cognitive diagnosis, first 10 genetic principal components, and 10 surrogate variables
                        </p>
                        {/* <br/>
                        <p>
                            <Link to="/datasets">
                                Detailed Dataset Decription
                            </Link>
                        </p>
                        <p>
                            {'Download Dataset: '}
                            <ExternalLink 
                                href="https://www.synapse.org/#!Synapse:syn21213340"
                                download
                                type="application/octet-stream"
                                >
                                pQTL
                            </ExternalLink>
                        </p> */}
                    </PopoutDiv>
                    <PopoutDiv>
                        <h3>
                            ROS/MAP Brain pQTL in controls only
                        </h3>
                        <p>
                            Brain pQTL results for 139 individuals in the
                            <ExternalLink 
                                href="https://www.rushu.rush.edu/research/departmental-research/religious-orders-study"
                                >
                                {" ROS "}
                            </ExternalLink> 
                            and 
                            <ExternalLink 
                                href="https://www.rushu.rush.edu/research/departmental-research/memory-and-aging-project"
                                >
                                {" MAP "}
                            </ExternalLink> 
                            with normal cognition at their last clinical assessment from 
                            <ExternalLink 
                                href="https://doi.org/10.1101/816652"
                                >
                                {" Robins et al., 2021 "}
                            </ExternalLink>
                            <br/>
                            <br/>
                            Results were adjusted for the last clinical cognitive diagnosis, first 10 genetic principal components, and 10 surrogate variables.
                        </p>
                        {/* <p>
                            <Link to="/datasets">
                                Detailed Dataset Decription
                            </Link>
                        </p>
                        <p>
                            {'Download Dataset: '}
                            <ExternalLink 
                                href="https://www.synapse.org/#!Synapse:syn21213391"
                                download
                                type="data:text/csv;charset=utf-8"
                                >
                                pQTL
                            </ExternalLink>
                            {' '}
                            <ExternalLink 
                                href="https://www.synapse.org/#!Synapse:syn21213297"
                                download        
                                type="data:text/csv;charset=utf-8"
                                >
                                eQTL
                            </ExternalLink>
                        </p> */}
                    </PopoutDiv>
                    <PopoutDiv>
                        <h3>
                            Banner Brain pQTL
                        </h3>
                        <p>
                        Results of brain pQTLs for 149 individuals in the 
                        <ExternalLink 
                            href="https://www.bannerhealth.com/services/research/locations/sun-health-institute/programs/body-donation"
                            >
                            {" Sun Health Brain and Body Donation Program "}
                        </ExternalLink> 
                        from 
                        <ExternalLink 
                            href="https://doi.org/10.1101/816652"
                            >
                            {" Robins et al., 2021 "}
                        </ExternalLink>
                        <br/>
                        <br/>
                        Results were adjusted for the last clinical cognitive diagnosis, first 10 genetic principal components, and 10 surrogate variables
                        </p>
                        {/*<p>
                            <Link to="/datasets">
                                Detailed Dataset Decription
                            </Link>
                        </p>
                        <p>
                            {'Download Dataset: '}
                            <ExternalLink 
                                href="https://www.synapse.org/#!Synapse:syn21213391"
                                download
                                type="data:text/csv;charset=utf-8"
                                >
                                pQTL
                            </ExternalLink>
                            {' '}
                            <ExternalLink 
                                href="https://www.synapse.org/#!Synapse:syn21213297"
                                download        
                                type="data:text/csv;charset=utf-8"
                                >
                                eQTL
                            </ExternalLink>
                        </p> */}
                    </PopoutDiv>
                </InlineDiv>

                {/* <h3>
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
                            dataset='rosmap'
                            geneData={pQTL}/>
                    </div>
                    <div>
                        <h4>
                            pQTL vs eQTL
                        </h4>
                        <NotableGenesTable
                            dataset='banner'
                            geneData={overlap}/>
                    </div>
                </InlineDiv> */}
                <PopoutDiv>
                    <Citations/>
                </PopoutDiv>
            </HomePageDiv>
        )
    }

export default HomePage