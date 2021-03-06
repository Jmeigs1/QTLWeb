import React, { Component } from 'react'
import styled from 'styled-components'

import * as tableStyle from './UI/Table'
import GeneCard from './GeneCard'
import {DatasetDisplayName} from './UI/Datasets'

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

const popColumns = [
    "af_afr",
    "af_amr",
    "af_asj",
    "af_eas",
    "af_fin",
    "af_nfe",
    "af_oth",
    "af_male",
    "af_female",
]

const siteAnnoColumns = [
    "dbSNP.name",
    "refSeq.siteType",
    "refSeq.exonicAlleleFunction",
    "refSeq.refCodon",
    "refSeq.altCodon",
    "refSeq.refAminoAcid",
    "refSeq.altAminoAcid",
    "refSeq.codonPosition",
    "refSeq.codonNumber",
    "refSeq.strand",
]

const TableFunc = (props) => {

    let [label, headers, rows, colsMapFunc] = [props.label, props.headers, props.rows, props.colsMapFunc]

    return (
        <tableStyle.StyledTableRootInline style={props.style ? props.style : {}}>
            <h3>{label}</h3>
            <tableStyle.StyledTable>
                <tableStyle.StyledTableHead>
                    <tr>
                        {headers.map((o, i) =>
                            (<tableStyle.StyledTableCellHeader key={i}>
                                {o}
                            </tableStyle.StyledTableCellHeader>))
                        }
                    </tr>
                </tableStyle.StyledTableHead>
                <tbody>
                    {rows.map(colsMapFunc)}
                </tbody>
            </tableStyle.StyledTable>
        </tableStyle.StyledTableRootInline>
    )
}

class VariantPage extends Component {

    constructor(props) {
        super(props)

        this.state = {
            dataLoaded: false,
            varientData: {},
            siteRangeData: {},
        }
    }

    componentDidMount() {
        document.title = `QTL's - ${this.props.geneSymbol} \
- ${this.props.site} \
- ${this.props.dataset}`

        this.loadData()
    }

    componentDidUpdate() {
        
    }

    loadData() {
        this.getSiteRange().then((siteRangeData) => {
            this.getVarientData().then(
                data => {
                    this.setState({
                        siteRangeData: siteRangeData.genes,
                        varientData: data._source,
                        dataLoaded: true,
                    })
                }
            )
        }
        )
    }

    getSiteRange() {
        return fetch(
            window.location.origin + '/api/gene/' + this.props.geneSymbol
        ).then(response => response.json())
    }

    getVarientData() {
        return fetch(
            window.location.origin +
            `/api/es/varient/${this.props.geneSymbol}` +
            `/site/${this.props.site}/chr/${this.props.chr}/dataset/${this.props.dataset}`
        ).then(resp => {
            return resp.json()
        })
    }

    render() {

        if (!this.state.dataLoaded) {
            return (
                <Page>
                </Page>
            )
        }

        let bystroObj = this.state.varientData.BystroData

        return (
            <Page>
                <CardBox>
                    <GeneCard
                        mainGeneTranscripts={this.state.siteRangeData}
                    />
                    <div style={{float:"left",marginRight:"20px"}}>
                        <h3> 
                            Site
                        </h3>
                        <p>
                            {this.props.site}
                        </p>
                    </div>

                    <div style={{float:"left",marginRight:"20px"}}>
                        <h3> 
                            Chr
                        </h3>
                        <p>
                            {this.props.chr}
                        </p>
                    </div>

                    <div style={{float:"left",marginRight:"20px"}}>
                        <h3> 
                            Dataset
                        </h3>
                        <p>
                            {DatasetDisplayName[this.props.dataset].displayName}
                        </p>
                    </div>
                </CardBox>

                <br style={{clear:"both"}}/>

                <TableFunc
                    label="Site Annotation Data"
                    headers={[
                        'Label',
                        'Data',
                    ]}
                    colsMapFunc={(data, i) => (
                        <tableStyle.StyledTableRow key={i}>
                            <tableStyle.StyledTableCell>
                                {data}
                            </tableStyle.StyledTableCell>
                            <tableStyle.StyledTableCell>
                                {bystroObj[data]}
                            </tableStyle.StyledTableCell>
                        </tableStyle.StyledTableRow>
                    )}
                    rows={siteAnnoColumns}
                />
                <TableFunc
                    label="Population Frequencies"
                    headers={[
                        'Population',
                        'Genomes',
                        'Exomes',
                    ]}
                    colsMapFunc={(data, i) => (
                        <tableStyle.StyledTableRow key={i}>
                            <tableStyle.StyledTableCell>
                                {data}
                            </tableStyle.StyledTableCell>
                            <tableStyle.StyledTableCell>
                                {bystroObj["gnomad.genomes." + data]}
                            </tableStyle.StyledTableCell>
                            <tableStyle.StyledTableCell>
                                {bystroObj["gnomad.exomes." + data]}
                            </tableStyle.StyledTableCell>
                        </tableStyle.StyledTableRow>
                    )}
                    rows={popColumns}
                />
                <br />
                <TableFunc
                    label="Result Data"
                    headers={[
                        'Label',
                        'Data',
                    ]}
                    colsMapFunc={(data, i) => (
                        <tableStyle.StyledTableRow key={i}>
                            <tableStyle.StyledTableCell>
                                {data}
                            </tableStyle.StyledTableCell>
                            <tableStyle.StyledTableCell>
                                {this.state.varientData.NonIndexedData[data]}
                            </tableStyle.StyledTableCell>
                        </tableStyle.StyledTableRow>
                    )}
                    rows={Object.keys(this.state.varientData.NonIndexedData)}
                />

            </Page>
        )
    }
}


export default VariantPage