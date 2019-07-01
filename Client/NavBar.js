import React, { Component } from 'react'
import styled from 'styled-components'
import { Link as RouteLink } from "react-router-dom"

import { Button } from './UI/Button'
import { colors } from './UI/Colors'

const NavBarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  padding: 20px 30px;
  background-color: #699FA1;
  @media (max-width: 900px) {
    flex-direction: column;
    padding: 10px 30px;
  }
`

const AfterNav = styled.div`
  height:10px;
  width:100%;
  background-color: #DF7027;
`

const ToggleMenuButton = styled(Button)`
  background: black;
  color: white;
  @media (min-width: 901px) {
    display: none;
  }
`

const Menu = styled.ul`
  display: flex;
  flex-direction: row;
  padding: 0;
  margin: 0;
  font-weight: bold;
  list-style-type: none;
  a {
    padding: 0.5em;
  }
  @media (max-width: 900px) {
    flex-direction: column;
    width: 100%;
    height: ${props => (props.isExpanded ? 'auto' : 0)};
    a {
      display: inline-block;
      width: 100%;
      padding: 1em 0;
    }
  }
`

const LogoWrapper = styled.div`
  @media (max-width: 900px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 5px;
  }
`

const Logo = styled.div`
  color: #FFF;
  font-size: 1.5em;
  font-weight: bold;
  text-shadow: text-shadow: 0 0 3px #FF0000, 0 0 5px #0000FF;
`

const StyleLink = styled.a`
  color: #FFF;
  text-decoration: none;
  &:active,
  &:hover {
    color: ${colors[2][1]};
    cursor: pointer;
    text-shadow:0px 0px 1px black;
  }
  &:focus {
    text-decoration: underline;
  }
`

const Link = StyleLink.withComponent(RouteLink)

class NavBar extends Component {
    state = {
      isExpanded: false,
    }
  
    toggleMenu = () => {
      this.setState(state => ({ ...state, isExpanded: !state.isExpanded }))
    }
  
    closeMenu = () => {
      this.setState({ isExpanded: false })
  }

  render() {
    const { isExpanded } = this.state
    return (
        <div>
            <NavBarWrapper>
                <LogoWrapper>
                    <Link to="/" onClick={this.closeMenu}>
                        <Logo>QTL Web -> Cool Logo</Logo>
                    </Link>
                    <ToggleMenuButton onClick={this.toggleMenu}>☰</ToggleMenuButton>
                </LogoWrapper>
                <Menu isExpanded={isExpanded}>
                    <li>
                    <Link to="/about" onClick={this.closeMenu}>
                        About
                    </Link>
                    </li>
                    <li>
                    <Link to="/about" onClick={this.closeMenu}>
                        Paper
                    </Link>
                    </li>
                    <li>
                    <Link to="/about" onClick={this.closeMenu}>
                        WingoLab
                    </Link>
                    </li>
                </Menu>
            </NavBarWrapper>
            <AfterNav/>
        </div>
    )
  }

}

export default NavBar