import React, { useContext } from "react";
import Center from "./Center";
import { styled } from "styled-components";
import Button from "./Button";
import ButtonLink from "./ButtonLink";
import CartIcon from "./icons/CartIcon";
import { CartContext } from "./CartContext";

const Bg = styled.div`
  background-color: #222;
  color: #fff;
  padding: 50px 0;
`;

const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 3rem;
`;
const Desc = styled.p`
  color: #aaa;
  font-size: 0.8rem;
`;
const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
  img {
    max-width: 60%;
  }
`;

const Column = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 25px;
  text-decoration: none;
`;
function Featured({ product }) {
  const { addProduct } = useContext(CartContext);
  function addFeaturedToCart() {
    addProduct((prev) => [...prev, product._id]);
  }
  return (
    <Bg>
      <Center>
        <ColumnsWrapper>
          <Column>
            <div>
              <Title>{product.title}</Title>
              <Desc>{product.description}</Desc>
              <ButtonsWrapper>
                <ButtonLink
                  href={"/products/" + product._id}
                  outline="true"
                  white="true"
                >
                  Read More
                </ButtonLink>
                <Button white="true" onClick={addFeaturedToCart}>
                  <CartIcon /> Add to Cart
                </Button>
              </ButtonsWrapper>
            </div>
          </Column>
          <div>
            <img src="http://res.cloudinary.com/dtw3bd2xf/image/upload/v1691398213/lskpfgbirsjzfchhv4xg.jpg"></img>
          </div>
        </ColumnsWrapper>
      </Center>
    </Bg>
  );
}

export default Featured;
