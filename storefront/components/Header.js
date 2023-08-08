import Link from "next/link";
import React, { useContext } from "react";
import styled from "styled-components";
import Center from "./Center";
import { CartContext } from "./CartContext";

const StyledHeader = styled.header`
  background-color: black;
  padding: 15px;
`;

const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
`;

const StyledNav = styled.nav`
  gap: 15px;
  display: flex;
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
`;

const NavLink = styled(Link)`
  color: #aaa;
  text-decoration: none;
`;
function Header() {
  const { cartProducts } = useContext(CartContext);
  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo href={"/"}>Ecommerce</Logo>
          <StyledNav>
            <NavLink href={"/"}>Home</NavLink>
            <NavLink href={"/products"}>All Products</NavLink>
            <NavLink href={"/categories"}>Categories</NavLink>
            <NavLink href={"/account"}>Account</NavLink>
            <NavLink href={"/cart"}>Cart({cartProducts?.length})</NavLink>
          </StyledNav>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}

export default Header;
