import React from 'react'
import PropTypes from 'prop-types'

import { Link } from './UI/BasicElements'

import {
    StyledTable,
    StyledTableBody,
    StyledTableCell,
    StyledTableCellHeader,
    StyledTableHead,
    StyledTableRoot,
    StyledTableRow,
    StyledTableRowHead,
}
from './UI/Table'

let NotableGenesTable = (props) => {

    const keys = Object.keys(props.geneData[0])

    return (
        <div>
            <StyledTableRoot style={{height:'300px'}}>
                <StyledTable>
                    <StyledTableHead>
                        <StyledTableRowHead>
                            {keys.map(
                                (col,i) => (
                                    <StyledTableCellHeader key={i}>
                                        {col}
                                    </StyledTableCellHeader>
                                )
                            )}
                        </StyledTableRowHead>
                    </StyledTableHead>
                    <StyledTableBody>
                        {
                            props.geneData.map(
                                (gene, i) => (
                                    <StyledTableRow key={i}>
                                        {keys.map(
                                            (key, j) => {
                                                if(key == 'GeneSymbol'){
                                                    return(
                                                        <StyledTableCell key={j}>
                                                            <Link to={`/gene/${gene.GeneSymbol}/dataset/${props.dataset}`}>
                                                                {gene.GeneSymbol}
                                                            </Link>
                                                        </StyledTableCell>
                                                    )
                                                }
                                                else{
                                                    return(
                                                        <StyledTableCell key={j}>
                                                            {gene[key]}
                                                        </StyledTableCell>
                                                    )
                                                }
                                            }
                                        )}
                                    </StyledTableRow>
                                )
                            )
                        }
                    </StyledTableBody>                    
                </StyledTable>
            </StyledTableRoot>
        </div>
    )
}

NotableGenesTable.propTypes = {
    dataset: PropTypes.string.isRequired,
    geneData: PropTypes.arrayOf(
        PropTypes.shape({
            "GeneSymbol": PropTypes.string.isRequired,
            "UniprotID": PropTypes.string.isRequired,
        })
    ).isRequired
}

export default NotableGenesTable