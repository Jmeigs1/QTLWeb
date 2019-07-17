import React from 'react'
import styled from 'styled-components'
import { Link as RouteLink } from "react-router-dom"

import { colors } from './UI/Colors'

const Page = styled.div`
    box-sizing: border-box;
    width: 100%;
    max-width: 1200px;
    padding: 0 15px;
    margin: 0 auto 40px;
    font-size: 16px;
`

const InfoPage = styled(Page)`
    p {
    margin-bottom: 1em;
    line-height: 1.4;
    }
`

const HomePage = styled(InfoPage)`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 0px;
`

const HeadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-bottom: 40px;
`

const StyleLink = styled.a`
    color: ${colors[2][0]};
    text-decoration: none;
    &:visited {
        color: ${colors[2][0]};
    }
    &:active,
    &:hover {
        color: ${colors[1][2]};
    cursor: pointer;
    text-shadow:0px 0px 1px black;
    }
    &:focus {
    text-decoration: underline;
    }
`

const SubHeading = styled.h2`
    padding-top: 0;
    padding-bottom: 0;
    font-size: 1.2em;
    font-weight: lighter;
    letter-spacing: 2px;
    text-align: center;
`

const Link = StyleLink.withComponent(RouteLink)

export default () => (
<HomePage>
    <HeadingContainer>
        <SubHeading>QTL Results</SubHeading>
        <p>
        Examples - Gene:{' '}
        <Link to="/gene/ENSG00000171163">
        ZNF692
        </Link>
        </p>
    </HeadingContainer>

    <p>
        The{' '}
        <Link to="/display">
        QTL Wiki - 
        </Link>{' '}
        A quantitative trait locus (QTL) is a region of DNA which is associated with 
        a particular phenotypic trait, which varies in degree and which can be attributed 
        to polygenic effects, i.e., the product of two or more genes, and their environment.[2] 
        These QTLs are often found on different chromosomes. The number of QTLs which explain 
        variation in the phenotypic trait indicates the genetic architecture of a trait. It may 
        indicate that plant height is controlled by many genes of small effect, or by a 
        few genes of large effect.

    </p>
    <p>
        Typically, QTLs underlie continuous traits (those traits which vary continuously, e.g. height) 
        as opposed to discrete traits (traits that have two or several character values, e.g. red hair in humans, 
        a recessive trait, or smooth vs. wrinkled peas used by Mendel in his experiments).
    </p>
    <p>
        Moreover, a single phenotypic trait is usually determined by many genes. Consequently, many QTLs 
        are associated with a single trait. Another use of QTLs is to identify candidate genes underlying 
        a trait. Once a region of DNA is identified as contributing to a phenotype, it can be sequenced. 
        The DNA sequence of any genes in this region can then be compared to a database of DNA for genes 
        whose function is already known.
    </p>
</HomePage>
)