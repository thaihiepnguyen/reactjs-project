import { Typography } from  '@mui/material';
import styled from 'styled-components';

interface Props {
    $colorName?: string;
    $fontWeight?: number | string;
}

const Heading4 = styled(Typography)<Props>`
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: ${props => props.$fontWeight || 600};
    font-size: 18x;
    line-height: 32px;
    color: ${props => props.$colorName || 'black'};
    @media only screen and (max-width: 767px) {
        font-size: 14px;
    }
`

export default Heading4;