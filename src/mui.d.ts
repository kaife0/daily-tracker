import { ElementType } from 'react';
import { GridProps, GridTypeMap } from '@mui/material/Grid';
import { OverridableComponent } from '@mui/material/OverridableComponent';

declare module '@mui/material/Grid' {
  interface GridTypeMap {
    props: GridTypeMap['props'] & {
      // item is already defined in MUI's Grid component, so we don't need to add it
      component?: ElementType;
      // Add any missing props here if needed
    }
  }

  // Make sure the Grid component is properly typed
  const Grid: OverridableComponent<GridTypeMap>;
}