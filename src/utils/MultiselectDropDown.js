import { Checkbox, FormControl, ListItemIcon, ListItemText, MenuItem, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowDropDown, Clear } from "@material-ui/icons";
import _ from 'lodash';

const useStyles = makeStyles(() => ({
  formControl: {
    // margin: theme.spacing(1),
    width: window.location.pathname ==='/report' ||  window.location.pathname ==='/college/placement-coordinator' ||  window.location.pathname === '/college'? 200: 250
  },
  indeterminateColor: {
    color: "#f50057"
  },
  selectAllText: {
    fontWeight: 500,
    fontFamily: 'Montserrat'
  },
  selectedAll: {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.08)"
    }
  },
  listItemText: {
    fontFamily: 'Montserrat'
  },
  resize:{
    fontSize:13
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 100
    }
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "center"
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "center"
  },
  variant: "menu"
};

function MultiSelectDropDown(props) {
  const classes = useStyles();
  const value = props.value;
  const isAllSelected = props.isAllSelected;
  const list = props.list;
  const isObject = props.isObject;
  const key = props.keyValue;
  const displayValue = props.displayValue;
  const isDisabled = props.disabled;
  const placeholder = props.placeholder;
  const handleChange = (event,clear) => props.handleChange(event,clear);
  const showSelectAll = props.showSelectAll;


  const returnMenuItem = (option) => {
    if (isObject) {
      return (
        <MenuItem key={option[key]} value={option[key]}>
          <ListItemIcon>
            <Checkbox checked={value.includes(option[key])} />
          </ListItemIcon>
          <ListItemText primary={option[displayValue]} classes={{primary: classes.listItemText}} primaryTypographyProps={{ style: { whiteSpace: "normal" } }}/>
        </MenuItem>
      )
    }
    else {
      return (
        <MenuItem key={option} value={option}>
          <ListItemIcon>
            <Checkbox checked={value.indexOf(option) > -1} />
          </ListItemIcon>
          <ListItemText primary={option} classes={{primary: classes.listItemText}} primaryTypographyProps={{ style: { whiteSpace: "normal" } }}/>
        </MenuItem>
      )
    }
  }

  const renderIconComponent = () =>{
    if(_.size(value) > 0) {
      return <Clear style={{cursor: 'pointer'}} onClick={(e) => handleChange(e, true)}/>
    }
    return <ArrowDropDown/>
  }

  return (
    <FormControl style={{width : props.width ?'200px':'250px'}} size={'small'}>
      <Select
        multiple
        value={value}
        disabled={isDisabled}
        placeholder={placeholder}
        onChange={(e) => handleChange(e,false)}
        IconComponent = {renderIconComponent}
        renderValue={isObject ? (selected) => _.map(list, col => {
          if (selected.includes(col[key])) {
            return col[displayValue].concat(", ")
          }
        }) : (selected) => selected.join(", ")}
        MenuProps={MenuProps}
      >
        {showSelectAll &&  <MenuItem
          value="all"
          classes={{
            root: isAllSelected ? classes.selectedAll : ""
          }}
        >
          <ListItemIcon>
            <Checkbox
              checked={isAllSelected}
            />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.selectAllText }}
            primary="Select All"
          />
        </MenuItem> }
        {_.map(list, (option) => {
          return (returnMenuItem(option))
        })}
      </Select>
    </FormControl>
  )
}

export default MultiSelectDropDown;
