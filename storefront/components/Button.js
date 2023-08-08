import { css, styled } from "styled-components";
import { primary } from "@/lib/colors";

export const ButtonStyle = css`
  ${(props) =>
    props.primary &&
    !props.outline &&
    css`
      background-color: ${primary};
      color: #fff;
      border: 1px solid ${primary};
    `}
  ${(props) =>
    props.primary &&
    props.outline &&
    css`
      background-color: transparent;
      color: ${primary};
      border: 1px solid ${primary};
    `}
  ${(props) =>
    props.size === "l" &&
    css`
      font-size: 1.2rem;
      padding: 10px 20px;
      svg {
        height: 20px;
      }
    `};
  ${(props) =>
    props.white &&
    !props.outline &&
    css`
      background-color: white;
      color: #000;
      border: 1px solid #fff;
    `}
  ${(props) =>
    props.white &&
    props.outline &&
    css`
      background-color: transparent;
      color: #fff;
      border: 1px solid #fff;
    `}


padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  font-weight: bold;
  svg {
    height: 16px;
    margin-right: 5px;
  }
`;

const StyledButton = styled.button`
  ${ButtonStyle}
`;

export default function Button({ children, ...rest }) {
  return <StyledButton {...rest}>{children}</StyledButton>;
}
