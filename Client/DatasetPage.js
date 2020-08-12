import React, { Component } from 'react'

import { Page, ExternalLink, Divider, PopoutDiv } from './UI/BasicElements'

import Citations from './UI/Citations'

class DatasetPage extends Component {
    render() {
        return (
            <Page>
                <PopoutDiv>
                    <h1>
                        What is a Quantitative Trait Locus?
                    </h1>
                    <p>
                        <ExternalLink href="https://en.wikipedia.org/wiki/Quantitative_trait_locus">
                            {'Quantitative trait loci (QTL) '}
                        </ExternalLink>
                        are genome sites that are associated with variation
                        of some measurable trait, in other words, a quantitative trait. There are many
                        traits that have been mapped to different genetic sites in humans,
                        <ExternalLink href="https://ncbi.nlm.nih.gov/pmc/articles/PMC2063446">
                            {' see this review'}
                        </ExternalLink>
                        . The traits we are most interested in are brain protein and RNA
                        levels. The reason we want to understand and catalog naturally occurring genetic
                        variants that associate with different brain protein and RNA levels is that
                        those sites are more likely to contribute to human traits and illnesses.
                    </p>

                    <h2>
                        How were protein QTLs identified?
                    </h2>
                    <p>
                    We used protein data derived from dosolateral prefrontal cortex from 338 research 
                    volunteers from the ROS/MAP studies (see Research Volunteers section below) who also 
                    underwent whole genome sequencing. For each of the 7,376 proteins measured in the 338 
                    individual brains, we tested all common (minor allele frequency {'>'} 0.05) single nucleotide 
                    variants (SNVs) in a 200 Kbp region around the protein-coding gene. In total, we tested 
                    501,414 SNVs and provided estimates of effect sizes and p-values for associations between 
                    those sites and the different proteins tested.
                    </p>
                </PopoutDiv>

                <PopoutDiv>
                    <h2>
                        Resource descriptions
                    </h2>
                    <h3>
                        Research Volunteers
                    </h3>
                    <p>
                        Subjects in this study are participants of the Religious Orders Study (ROS) and
                        the Rush Memory and Aging Project (MAP). ROS and MAP are longitudinal cohort
                        studies of Alzheimer’s disease and aging maintained by investigators at the
                        <ExternalLink href="https://www.radc.rush.edu">
                            {' Rush Alzheimer\'s Disease Center '}
                        </ExternalLink>
                        in Chicago, IL. Both studies recruit
                        participants without known dementia at baseline and follow them annually using
                        detailed clinical evaluation. ROS recruits individuals from catholic religious
                        orders from across the USA, while MAP recruits individuals from retirement
                        communities as well as individual home visits in the Chicago, IL area.
                        Participants in each study undergo annual medical, neurological, and
                        neuropsychiatric assessments from enrollment to death, and neuropathologic
                        evaluations at autopsy. Participants provided informed consent, signed an
                        Anatomic Gift Act, and repository consent to allow their data and biospecimens
                        to be repurposed. The studies were approved by an Institutional Review Board of
                        Rush University Medical Center. Information and data from ROS/MAP studies may be
                        requested
                        <ExternalLink href="https://www.radc.rush.edu">
                            {' here'}
                        </ExternalLink>.
                    </p>


                    <h3>
                        Brain Protein Data
                    </h3>
                    <p>
                        Protein abundance of the brain was measured using liquid chromatography followed
                        by tandem mass spectrometry on proteins of the dorsolateral prefrontal cortex.
                        Protein abundance from cortical microdissections of the
                        dorsolateral prefrontal cortex (dPFC; Broadman area 9) of ROS/MAP subjects was
                        generated using tandem mass tag (TMT) isobaric labeling mass spectrometry
                        methods for protein identification and quantification. Samples were prepared and
                        sequenced in batches of 8 and run with two global internal standards for quality
                        control purposes. Samples were randomly assigned to batches such that no
                        clinical characteristic was correlated with any particular batch. All proteomic
                        sequencing was performed by the
                        <ExternalLink href="https://www.cores.emory.edu/eipc/about/index.html">
                            {' Emory Proteomics Core '}
                        </ExternalLink>
                        and the
                        <ExternalLink href="https://biochem.emory.edu/seyfried/index.html">
                            {' Seyfried laboratory'}
                        </ExternalLink>.
                    </p>


                    <h3>
                        Genetic Data
                    </h3>
                    <p>
                        The genomic data were derived using whole-genome sequencing from either
                        dosolateral prefrontal cortex or DNA extracted from blood. Further details of
                        the sequencing are described
                        <ExternalLink href="https://ncbi.nlm.nih.gov/pubmed/30084846">
                            {' here '}
                        </ExternalLink>
                        and data may be requested
                        <ExternalLink href="https://synapse.org/#!Synapse:syn10901595">
                            {' here'}
                        </ExternalLink>.
                    </p>
                </PopoutDiv>

                <PopoutDiv>
                    <h2>
                        Acknowledgements
                    </h2>
                    <p>
                        We are grateful for the generosity of the research volunteers who gave their
                        time, and, ultimately, donated their brains to science. We thank our
                        collaborators at the
                        <ExternalLink href="http://alzheimers.emory.edu">
                            {' Emory Goizueta Alzheimer\'s Disease Research Center'}
                        </ExternalLink>
                        ,
                        <ExternalLink href="https://www.radc.rush.edu">
                            {' Rush Alzheimer\'s Disease Center'}
                        </ExternalLink>
                        , and Columbia University.
                    </p>
                    <Citations />
                </PopoutDiv>
            </Page>
        )
    }
}

export default DatasetPage