import React, { Component } from 'react'
import styled from 'styled-components'

import { bystroCols, bystroData, sampleSiteResult, sampleSiteResultHeader } from './TestData'
import * as tableStyle from './UI/Table'

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
    "refSeq.siteType",
    "refSeq.exonicAlleleFunction",
    "refSeq.refCodon",
    "refSeq.altCodon",
    "refSeq.refAminoAcid",
    "refSeq.altAminoAcid",
    "refSeq.codonPosition",
    "refSeq.codonNumber",
    "refSeq.strand"
]


const TableFunc = (props) => {

    let [headers, rows, colsMapFunc] = [props.headers, props.rows, props.colsMapFunc]

    return (
        <tableStyle.StyledTableRoot style = {{width:'700px'}}>
            <tableStyle.StyledTable>
                <tableStyle.StyledTableHead>
                    <tr>
                        {headers.map((o,i) => 
                            (<tableStyle.StyledTableCellHeader key ={i}>
                                {o}
                            </tableStyle.StyledTableCellHeader>))
                        }
                    </tr>
                </tableStyle.StyledTableHead>
                <tbody>
                    {rows.map(colsMapFunc)}
                </tbody>
            </tableStyle.StyledTable>
        </tableStyle.StyledTableRoot>
    )
}

class SitePage extends Component {
    render() {

        let bystroObj = {}
        let i = 0
        for(let o of bystroCols){
            bystroObj[o] = bystroData[i]
            i++
        }

        console.log("bystroObj: ", bystroObj)
        console.log("N_samples: ", bystroObj.N_samples)

        return (
            <Page>
                <h2>{this.props.geneSymbol}</h2>
                <h3>{this.props.siteValue}</h3>

                <h3>Result Data</h3>
                <TableFunc
                    headers = {[
                        'Label',
                        'Data',
                    ]}
                    colsMapFunc = {(data, i) => (
                        <tableStyle.StyledTableRow key = {i}>
                            <tableStyle.StyledTableCell>
                                {data}
                            </tableStyle.StyledTableCell>
                            <tableStyle.StyledTableCell>
                                {sampleSiteResult[i]}
                            </tableStyle.StyledTableCell>
                        </tableStyle.StyledTableRow>
                    )}
                    rows = {sampleSiteResultHeader}
                />
                <h3> Population Frequencies </h3>
                <TableFunc
                    headers = {[
                        'Population',
                        'Genomes',
                        'Exomes',
                    ]}
                    colsMapFunc = {(data, i) => (
                        <tableStyle.StyledTableRow key = {i}>
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
                    rows = {popColumns}
                />
                <h3>Site Annotation Data</h3>
                <TableFunc
                    headers = {[
                        'Label',
                        'Data',
                    ]}
                    colsMapFunc = {(data, i) => (
                        <tableStyle.StyledTableRow key = {i}>
                            <tableStyle.StyledTableCell>
                                {data}
                            </tableStyle.StyledTableCell>
                            <tableStyle.StyledTableCell>
                                {bystroObj[data]}
                            </tableStyle.StyledTableCell>
                        </tableStyle.StyledTableRow>
                    )}
                    rows = {siteAnnoColumns}
                />
            </Page>
        );
    }
}


export default SitePage;