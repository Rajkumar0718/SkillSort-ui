import styled from "styled-components";
import {
  Checkbox,
  FormControl,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import { ArrowDropDown, Clear } from "@mui/icons-material";
import _ from "lodash";

const StyledFormControl = styled(FormControl)`
  width: ${(props) => (props.width ? "190px" : "250px")};

`;


const StyledSelect = styled(Select)`
  width: 100%;
  height:2.5rem;
  background-color: white !important;
  & .MuiInputBase-input:focus {
    background-color: white !important;
 }
`;

const StyledMenuItem = styled(MenuItem)`
  && {
    width: 100%;
    background-color:white !important;
  }
`;

const StyledCheckbox = styled(Checkbox)`
  && {
    color: "fieldtext";
  }
`;

const StyledListItemText = styled(ListItemText)`
  && {
    font-family: "Montserrat";
    white-space: normal;
  }
`;

const StyledClear = styled(Clear)`
  cursor: pointer;

`;

const StyledArrowDropDown = styled(ArrowDropDown)`
  cursor: pointer;

`;

const StyledMenuItemSelectAll = styled(MenuItem)`
  && {
    &.selectedAll {
      background-color: white !important;
    }
  }
`;

function MultiSelectDropDown(props) {
  const {
    value,
    isAllSelected,
    list,
    isObject,
    keyValue,
    displayValue,
    disabled,
    placeholder,
    handleChange,
    showSelectAll,
    width,
  } = props;

  const renderIconComponent = () => {
    if (_.size(value) > 0) {
      return <StyledClear onClick={(e) => handleChange(e, true)} />;
    }
    return <StyledArrowDropDown />;
  };

  return (
    <StyledFormControl size="small" width={width}>
      <StyledSelect
      style={{backgroundColor: 'white'}}
        multiple
        variant="filled"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => handleChange(e, false)}
        IconComponent={renderIconComponent}
        inputProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                backgroundColor: 'white'
              }
            }
          }
       }}
        renderValue={
          isObject
            ? (selected) =>
                _.map(list, (col) => {
                  if (selected.includes(col[keyValue])) {
                    return col[displayValue].concat(", ");
                  }
                })
            : (selected) => selected.join(", ")
        }
      >
        {showSelectAll && (
          <StyledMenuItemSelectAll
            value="all"
            className={isAllSelected ? "selectedAll" : ""}
          >
            <ListItemIcon>
              <StyledCheckbox checked={isAllSelected} />
            </ListItemIcon>
            <StyledListItemText
              primary="Select All"
              className="selectAllText"
            />
          </StyledMenuItemSelectAll>
        )}
        {_.map(list, (option) => (
          <StyledMenuItem
            key={isObject ? option[keyValue] : option}
            value={isObject ? option[keyValue] : option}
          >
            <ListItemIcon>
              <StyledCheckbox
                checked={
                  isObject
                    ? value?.includes(option[keyValue])
                    : value?.indexOf(option) > -1
                }
              />
            </ListItemIcon>
            <StyledListItemText
              primary={isObject ? option[displayValue] : option}
              className="listItemText"
            />
          </StyledMenuItem>
        ))}
      </StyledSelect>
    </StyledFormControl>
  );
}

export default MultiSelectDropDown;