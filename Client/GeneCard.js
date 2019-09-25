import React,{memo} from 'react'
import styled from 'styled-components'

const FlexDiv = styled.div`
    display: flex;
    flex-direction: right;

    > dt {width:200px; font-weight:bold};
    > dd {width:250px;margin: 0 10px};
`

let GeneCard = (props) => {

    //Test's if any of the transcripts could join between KG and ENS
    const xRefIndex = props.mainGeneTranscripts.map(v => v["knownCanonical.Transcript"] !== null).indexOf(true)
    const ensIndex = props.mainGeneTranscripts.map(v => v["ensGene.GeneID"] !== null).indexOf(true)

    const geneInfo  = props.mainGeneTranscripts[xRefIndex > -1 ? xRefIndex : 0]
    const ensInfo   = ensIndex > -1 ? props.mainGeneTranscripts[ensIndex]["ensGene.GeneID"] : ""

    return (
        <div>
            <h2>{geneInfo["knownXref.GeneSymbol"]}</h2>
            <h3>{Buffer.from( geneInfo["knownXref.Description"],'utf-8' ).toString().split(',')[0]}</h3>
            <dl>
                <FlexDiv><dt>Ensembl gene ID: </dt> <dd>{ensInfo}</dd></FlexDiv>
                <FlexDiv>
                    <dt>Uniprot: </dt>
                    <dd>
                    {geneInfo["knownXref.UniProtProteinAccessionNumber"] + " - " + geneInfo["knownXref.UniProtDisplayID"]}
                    </dd>
                </FlexDiv>
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
        </div>
    )
}

export default memo(GeneCard)