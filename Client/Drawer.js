import React from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

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

    const sideList = side => (
        <div
            role="presentation"
            onClick={ () => {
                toggleDrawer(side, false)
            }}
            onKeyDown={toggleDrawer(side, false)}
        >
            <List>
                {['About', 'Paper', 'WingoLab'].map((text, index) => (
                    <ListItem button key={text} onClick={() => (window.location = '/' + text)}>
                        <ListItemIcon>{index % 2 === 0 ? <div>1</div> : <div>2</div>}</ListItemIcon>
                        <ListItemText primary={text}/>
                    </ListItem>
                ))}
            </List>
            <Divider />
        </div>
    );

    return (
        <div>
            <Button onClick={toggleDrawer('left', true)}>Navigation</Button>
            <SwipeableDrawer
                open={state.left}
                onClose={toggleDrawer('left', false)}
                onOpen={toggleDrawer('left', true)}
            >

                <img src="https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_auto:good%2Cw_300/MTIwNjA4NjMzOTc0MTk1NzI0/john-smith-9486928-1-402.jpg"
                onClick={() => window.location = ('')}
                />
                {sideList('left')}
            </SwipeableDrawer>
        </div>
    );
}