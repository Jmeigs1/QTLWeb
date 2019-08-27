import React,{useState, memo} from 'react'
import styled from 'styled-components'

import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'

const FlexDiv = styled.div`
    display: flex;
    flex-direction: right;

    > dt {width:200px; font-weight:bold};
    > dd {width:250px;margin: 0 10px};
`

const CardBox = styled.div`
    margin: 10px;
    padding: 0 10px;
    float: left;
`
const TranscriptWrapper = styled.div`
    width:1000px;
    height:300px;
    margin: auto 10px;
    background-color:black
`

let GeneCard = (props) => {

    const [value, setValue] = useState('eqtl')

    const handleChange = (event) => {
        setValue(event.target.value)
    }

    //Test's if any of the transcripts could join between KG and ENS
    const xRefIndex = props.mainGeneTranscripts.map(v => v["knownCanonical.Transcript"] !== null).indexOf(true)

    if(xRefIndex === -1){
        return (
            <CardBox>
                <h2>{props.mainGeneTranscripts[0]["ensGene.GeneID"]}</h2>
                <h3>Gene could not be cross track joined between ENS and KG</h3>
            </CardBox>
        )
    }

    const geneInfo = props.mainGeneTranscripts[xRefIndex]

    return (
        <CardBox>
            <h2>{geneInfo["knownXref.GeneSymbol"]}</h2>
            <h3>{Buffer.from( geneInfo["knownXref.Description"],'utf-8' ).toString().split(',')[0]}</h3>
            <dl>
                <FlexDiv><dt>Ensembl gene ID: </dt> <dd>{geneInfo["ensGene.GeneID"]}</dd></FlexDiv>
                <FlexDiv><dt>Uniprot: </dt> <dd>{geneInfo["knownXref.UniProtProteinAccessionNumber"]}</dd></FlexDiv>
                <FlexDiv>
                    <dt>Location: </dt>
                    <dd>
                        {geneInfo["knownGene.chrom"]}: {geneInfo["knownGene.txStart"]} - {geneInfo["knownGene.txEnd"]}
                    </dd>
                </FlexDiv>
                <FlexDiv>
                <dt>Size: </dt>
                    <dd>
                        {0 + geneInfo["knownGene.txEnd"] - geneInfo["knownGene.txStart"]}
                    </dd>
                </FlexDiv>
            </dl>
            <p style={{fontWeight:"bold"}}> Dataset </p>
            <FormControl style={{
                boxShadow:"0px 1px 3px 0px rgba(0,0,0,0.2), \
                        0px 1px 1px 0px rgba(0,0,0,0.14), \
                        0px 2px 1px -1px rgba(0,0,0,0.12)",
                background: "#FFF",
                paddingTop:"5px",
                }} component="fieldset">
                <RadioGroup aria-label="position" name="position" value={value} onChange={handleChange} row>
                    <FormControlLabel
                    value="eqtl"
                    control={<Radio color="primary" />}
                    label={<div style={{fontSize:"20px"}}>EQTL</div>}
                    labelPlacement="top"
                    style={{fontSize:"20px"}}
                    />
                    <FormControlLabel
                    value="pqtl"
                    control={<Radio color="primary" />}
                    label={<div style={{fontSize:"20px"}}>PQTL</div>}
                    labelPlacement="top"
                    />
                </RadioGroup>
            </FormControl>
        </CardBox>
    )
}

export default memo(GeneCard)