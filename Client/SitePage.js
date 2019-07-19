import React, { Component } from 'react';
import styled from 'styled-components'

const Page = styled.div`
    box-sizing: border-box;
    width: 100%;
    max-width: 1200px;
    padding: 0 30px;
    margin: 0 auto;
    font-size: 16px;
`

const CardBox = styled.div`
    margin: 10px;
    padding: 0 10px;
    float: left;
`

class SitePage extends Component {
    render() {
        return (
            <Page>
                <CardBox>
                    <h2>{this.props.geneSymbol}</h2>
                    <h3>{this.props.siteValue}</h3>
                    <pre>
                        {
`N_samples
N_samples_w_minor_allele

Table for pop frequencies 

    af_ fields
    gnomad.*

Table for site annotation

    refSeq.siteType                             
    refSeq.exonicAlleleFunction
    refSeq.refCodon
    refSeq.altCodon
    refSeq.refAminoAcid
    refSeq.altAminoAcid
    refSeq.codonPosition
    refSeq.codonNumber
    refSeq.strand`
                        }
                    </pre>
                </CardBox>
            </Page>
        );
    }
}

export default SitePage;