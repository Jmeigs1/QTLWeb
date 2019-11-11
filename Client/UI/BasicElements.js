import { useEffect } from "react"
import { Link as RouteLink, withRouter } from "react-router-dom"
import styled from 'styled-components'

import Colors from './Colors'

const StyledLink = `
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

export const ExternalLink = styled.a`${StyledLink}`

export const LinkDiv = styled.div`${StyledLink}`

export const Link = ExternalLink.withComponent(RouteLink)

export const Page = styled.div`
    box-sizing: border-box;
    width: 100%;
    max-width: 1200px;
    padding: 10px 30px;
    margin: 0 auto;
    font-size: 16px;
`

export const Divider = styled.hr`
    border-color: ${Colors[0][0]};
    margin: 40px 0;
`