import { ForwardedRef, RefObject, forwardRef } from "react";

import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

export const tableIcons = {
  Add: forwardRef((props, ref: ForwardedRef<SVGSVGElement> ) => <AddIcon {...props} ref={ref} />),
  Check: forwardRef((props, ref: ForwardedRef<SVGSVGElement> ) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref: ForwardedRef<SVGSVGElement> ) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref: ForwardedRef<SVGSVGElement> ) => <RemoveCircleOutlineIcon sx={{color: "red"}} {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref: ForwardedRef<SVGSVGElement> ) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref: ForwardedRef<SVGSVGElement> ) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref: ForwardedRef<SVGSVGElement> ) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref: ForwardedRef<SVGSVGElement> ) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref: ForwardedRef<SVGSVGElement> ) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref: ForwardedRef<SVGSVGElement> ) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref: ForwardedRef<SVGSVGElement> ) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref: ForwardedRef<SVGSVGElement> ) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref: ForwardedRef<SVGSVGElement> ) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref: ForwardedRef<SVGSVGElement> ) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref: ForwardedRef<SVGSVGElement> ) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref: ForwardedRef<SVGSVGElement> ) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref: ForwardedRef<SVGSVGElement> ) => <ViewColumn {...props} ref={ref} />),
};
