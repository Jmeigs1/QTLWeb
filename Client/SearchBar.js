import React,{Component} from 'react'
import styled from 'styled-components'
import Autocomplete from 'react-autocomplete'

import Colors from './UI/Colors'

const Searchbox = styled.input`
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    padding: 0.375em 1.5em 0.375em 0.75em;
    border-color: rgb(108, 117, 125);
    border-style: solid;
    border-width: 1px;
    border-radius: 0.25em;
    background-position: right center;
    background-repeat: no-repeat;
    cursor: pointer;
    font-size: 1em;
    outline: currentcolor none medium;
    background-image: none;
    text-align: center;
`

const SearchboxItem = styled.div`
  padding: 0.375em 0.75em;
  background: ${props => (props.isHighlighted ? Colors[3][1] : 'none')};
  cursor: pointer;
  font-size: 14px;
`

class SearchBar extends Component {

    constructor (props) {
        super(props)
        this.state = {
          value: '',
        }
      }

    renderInput = props => {
        const { id } = this.props
        // eslint-disable-next-line react/prop-types
        const { ref, ...rest } = props
        return <Searchbox {...rest} id={id} ref={ref} />
    }

    render() {
        return (
            <div style = {{margin:'auto',width:'400px',paddingTop:'20px'}}>
                <Autocomplete 
                    getItemValue={(item) => item.label}
                    items={[
                    { label: 'ENSG00000171163' },
                    { label: 'ENSG00000094975' },
                    { label: 'ENSG00000135845' },
                    { label: 'ZNF692' }
                    ]}
                    shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
                    inputProps={{placeholder: "Search by gene"}}
                    renderInput={this.renderInput}
                    renderItem={(item, isHighlighted) =>
                    <SearchboxItem key={item.label} isHighlighted={isHighlighted}>
                        {item.label}
                    </SearchboxItem>
                    }
                    wrapperStyle={{
                        display: 'inline-block',
                        width: '100%',
                    }}
                    value={this.state.value}
                    onChange={e => this.setState({ value: e.target.value })}
                    onSelect={value => this.setState({ value })}
                />
            </div>
        )
    }
}

export default SearchBar;