import { ElementType } from 'react';
import { GridProps, GridTypeMap } from '@mui/material/Grid';
import { OverridableComponent } from '@mui/material/OverridableComponent';

declare module '@mui/material/Grid' {
  interface GridTypeMap {
    props: GridTypeMap['props'] & {
      component?: ElementType;
      item?: boolean;
    }
  }

  const Grid: OverridableComponent<GridTypeMap>;
}