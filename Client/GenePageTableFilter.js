import React, { Component } from 'react';
import styled from 'styled-components'

const TableFilter = styled.input`
    text-align: center;
`

class GenePageTableFilter extends Component {
    render() {
        return (
            <div>
                <TableFilter placeholder='Filter Table'/>
            </div>
        );
    }
}

export default GenePageTableFilter;