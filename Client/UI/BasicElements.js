import { Link as RouteLink } from "react-router-dom"
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
