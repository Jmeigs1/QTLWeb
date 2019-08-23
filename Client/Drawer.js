import React from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FadeIn from 'react-fade-in';
import SearchBar from "./SearchBar";
import {FaBars} from 'react-icons/fa';

import styled from 'styled-components'

const StyledListItemText = styled(ListItemText)`
    font-family: Raleway, sans-serif;
    color: #4C688B;
    font-size: 16px;
`

export default function SideDrawer() {
    const [state, setState] = React.useState({
        left: false,
    });

    const toggleDrawer = (side, open) => event => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [side]: open });
    };

    const linkData = (label, url) => {
        return {label, url}
    }

    const links = [
        linkData('Home', '/'),
        linkData('Downloads', '/Downloads'),
        linkData('Paper', '/Paper'),
        linkData('WingoLab', '/WingoLab'),
    ]

    const sideList = side => (
        <div
            role="presentation"
            onClick={ () => {
                toggleDrawer(side, false)
            }}
            onKeyDown={toggleDrawer(side, false)}
        >
            <List>
                {links.map((link, index) => (
                    <ListItem button key={link.label} onClick={() => (window.location = link.url)}>
                        <StyledListItemText disableTypography primary={link.label}/>
                    </ListItem>
                ))}
            </List>
            <Divider />
        </div>
    );

    return (
        <div>
            <FadeIn>
                <Button onClick={toggleDrawer('left', true) }><FaBars size={"3em"}/></Button>
                <SearchBar/>
            </FadeIn>
            <SwipeableDrawer
                open={state.left}
                onClose={toggleDrawer('left', false)}
                onOpen={toggleDrawer('left', true)}
            >

                <img 
                    src="https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_auto:good%2Cw_300/MTIwNjA4NjMzOTc0MTk1NzI0/john-smith-9486928-1-402.jpg"
                    onClick={() => window.location = ('')}
                    style={{cursor:'pointer'}}
                />
                {sideList('left')}
            </SwipeableDrawer>
        </div>
    );
}