import React, { Component } from 'react'

import {Page} from './UI/BasicElements'

import Citations from './UI/Citations'

class DatasetPage extends Component {
    render() {
        return (
            <Page>

                <h2>
                    General Analysis
                </h2>
                <div>
                    <p>	
                        We investigated only the proximal genetic effects of common SNVs by testing only SNVs
                        within 100 Kb of each protein coding gene with a minor allele frequency (MAF) over 5%. 
                    </p>
                    <p>
                        Protein abundance from cortical microdissections of the dPFC (Broadman area 9) of 
                        ROSMAP subjects was generated using tandem mass tag (TMT) isobaric labeling mass 
                        spectrometry methods for protein identification and quantification
                    </p>
                    <p>
                        Bonferroni correction was used to define all QTLs
                    </p>
                </div>

                <h2>
                    pQTL
                </h2>
                <div>
                    <p>
                        Used data from 144 ROSMAP participants with both proteomic and genotyping data
                    </p>
                    <p>
                        In total, the genotypes of 2,599,383 SNVs were tested against the abundance 
                        of 7,901 proteins
                    </p>
                </div>

                <h2>
                    pQTL vs eQTL
                </h2>
                <div>
                    <p>
                        Used data from 144 ROSMAP participants with both proteomic and genotyping data, 
                        and 169 ROSMAP participants with both transcriptomic and genotyping data
                    </p>
                    <p>
                        Gene expression was measured from the dPFC (Broadman area 46) of ROSMAP subjects 
                        using the Illumina HiSeq platform
                    </p>
                    <p>
                        To identify eQTLs and pQTLs from the same set of genes, we tested the genotypes 
                        of 2,082,000 SNVs against the abundance of protein and mRNA, respectively, 
                        from 5,739 genes
                    </p>
                </div>
                <Citations/>
            </Page>
        )
    }
}

export default DatasetPage