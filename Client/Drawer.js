import React from 'react'
import { withRouter } from 'react-router-dom'

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import {FaBars} from 'react-icons/fa'

import styled from 'styled-components'

const StyledListItemText = styled(ListItemText)`
    font-family: Raleway, sans-serif;
    color: #4C688B;
    font-size: 16px;
`


let Drawer = (props) => {
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
        linkData('WingoLab', 'http://wingolab.org'),
    ]

    const goToLink = (link) => {
        props.history.push(link)
        setState({
            left: false
        })
    }

    const sideList = side => (
        <div>
            <List>
                {links.map((link, index) => (
                    <ListItem button key={link.label} onClick={() => goToLink(link.url)}>
                        <StyledListItemText disableTypography primary={link.label}/>
                    </ListItem>
                ))}
            </List>
            <Divider />
        </div>
    );

    return (
        <div id="test" style={{display:"inline"}}>
            <Button onClick={toggleDrawer('left', true) }><FaBars size={"3em"}/></Button>
            <SwipeableDrawer
                open={state.left}
                onClose={toggleDrawer('left', false)}
                onOpen={toggleDrawer('left', true)}
            >

                <div
                    onClick={() => goToLink('/')}
                    style={{cursor:'pointer',backgroundColor:"grey",height:"300px", width:"300px"}}
                >
                </div>
                {sideList('left')}
            </SwipeableDrawer>
        </div>
    );
}

export default withRouter(Drawer)