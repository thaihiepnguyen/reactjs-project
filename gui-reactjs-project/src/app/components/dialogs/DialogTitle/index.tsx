import styled from "styled-components";
import {
  DialogTitle as DialogTitleMUI,
} from "@mui/material";

interface DialogTitleProps {
  $backgroundColor?: string;
  $padding?: string;
}
export const DialogTitle = styled(DialogTitleMUI)<DialogTitleProps>`
  background-color: ${props => `var(${props.$backgroundColor || '#17497f'})`};
  border-bottom: ${props => props.$backgroundColor ? "1px solid #d2d2d2" : "unset"};
  display: flex;
  justify-content: space-between;
  padding: 24px;
  color: var(--ghost-white);
  font-size: 22px;
  line-height: 31px;
`

export const DialogTitleConfirm = styled(DialogTitleMUI)<DialogTitleProps>`
  display: flex;
  justify-content: space-between;
  padding: ${props=> props.$padding || '24px'};
  color: #08182a;
  font-size: 22px;
  line-height: 32px;
`