import styled from '@emotion/styled';
import { ListItem } from './DashboardStyles';

export const ClickableListItem = styled(ListItem)`
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8fafc;
    transform: translateX(4px);
  }
  
  &:active {
    transform: translateX(2px);
  }
`;
