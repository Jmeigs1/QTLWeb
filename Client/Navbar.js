import React from 'react'
import { withRouter } from 'react-router-dom'


import styled from 'styled-components'

import {Page,LinkDiv,ExternalLink} from './UI/BasicElements'
import SearchBar from './SearchBar'

const LinkStyled = styled(LinkDiv)`
    display:inline-block;
    margin-right:20px;
`

const ExternalLinkStyled = styled(ExternalLink)`
    display:inline-block;
    margin-right:20px;
`

const Container = styled(Page)`
    padding: 0;
    display:flex;
    align-items:center;
`

const linkData = (label, url, isExternal) => {
    return {label, url, isExternal}
}

const links = [
    linkData('Dataset Descriptions', '/Datasets', 0),
    // linkData('Pre-Print', 'https://www.biorxiv.org/content/10.1101/816652v1', 1),
    linkData('WingoLab', 'http://wingolab.org', 1),
]

const Navbar = (props) => {

    const goToLink = (link, isExternal) => {
        if(isExternal){
            window.location = link
        }
        else {
            props.history.push(link)
        }
    }

    return (
        <div className='white-shadowed' style={{
            borderBottom:"1px solid",
            }}>
            <Container>
                <div
                    style={{fontSize:"36px",display:"inline-block",verticalAlign:"middle",marginRight:"20px",cursor:"pointer"}}
                    onClick={() => goToLink('/',0)}
                >
                    BrainQTL
                </div>
                <div style={{display:"inline-block",lineHeight:"36px",padding:"0 10px"}}>
                    {links.map( (link) => {
                        return link.isExternal ?  
                        (<ExternalLinkStyled key={link.label} href={link.url}>
                            {link.label}
                        </ExternalLinkStyled>)
                        : (
                        <LinkStyled key={link.label} onClick={() => goToLink(link.url,link.isExternal)}>
                            {link.label}
                        </LinkStyled>
                        )
                    })}
                </div>
                <SearchBar
                    style={{ display: 'inline-block', width: '250px',marginLeft:"auto"}}
                    dataset={props.dataset}
                />
            </Container>
        </div>
    )
}

export default withRouter(Navbar)