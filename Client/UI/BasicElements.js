import { useEffect } from "react"
import { Link as RouteLink, withRouter } from "react-router-dom"
import styled from 'styled-components'

import Colors from './Colors'

const StyleLink = styled.a`
    color: ${Colors[2][0]};
    text-decoration: none;
    font-weight: bold;
    &:visited {
        color: ${Colors[2][0]};
    }
    &:active,
    &:hover {
        color: ${Colors[1][2]};
    cursor: pointer;
    text-shadow:0px 0px 1px black;
    }
    &:focus {
    text-decoration: underline;
    }
`

export const Link = StyleLink.withComponent(RouteLink)

export const ExternalLink = StyleLink

export const Page = styled.div`
    box-sizing: border-box;
    width: 100%;
    max-width: 1200px;
    padding: 0 30px;
    margin: 0 auto;
    font-size: 16px;
`
