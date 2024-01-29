import { Box, TextField, Typography } from "@mui/material";
import { styled, useTheme } from '@mui/material/styles';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import _ from "lodash";
import React, { useState } from "react";
import { AiFillFileAdd, AiOutlineClose, AiTwotoneFolderOpen } from 'react-icons/ai';
import { MdOutlineDeleteForever } from 'react-icons/md';

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: 'var(--sp-colors-clickable)',
  [`& .${treeItemClasses.content}`]: {
    color: 'var(--sp-colors-clickable)',
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    fontWeight: theme.typography.fontWeightMedium,
    '&.Mui-expanded': {
      fontWeight: theme.typography.fontWeightRegular,
    },
    '&:hover': {
      fontWeight: theme.typography.fontWeightBold,
      backgroundColor: 'var(--sp-colors-surface3)',
      color: 'white'
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: 'var(--sp-colors-accent)',
    },
    '&.MuiCollapse-wrapperInner': {
      paddingLeft: '0.5rem'
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: 'inherit',
      color: 'inherit',
    },
    [`& .${treeItemClasses.iconContainer}`]: {
      width: 0
    }
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    paddingLeft: '0.5rem',
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    width: 0
  }
}));


const StyledTreeItem = React.forwardRef(function StyledTreeItem(props, ref) {
  const theme = useTheme();
  const donShowDeleteIcon = ["App.js", "package.json", "index.html", "manifest.json", "App.css", "index.css", "index.js", "styles.css", "App.tsx", "index.tsx", "tsconfig.json", "main.ts", "polyfills.ts", "app.module.ts", "app.component.ts", "app.component.html", "app.component.css", "App.vue", "main.js", "shims-vue.d.ts", "App.svelte"]
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    colorForDarkMode,
    bgColorForDarkMode,
    addFile,
    labelId,
    dialogOpen,
    isExpanded,
    isFileAdd,
    fileAddFolder,
    addFileToTree,
    externalFileAdd,
    getDeleteButtonForFolder,
    ...other
  } = props;
  const [showIcon, setShowIcon] = useState(false);
  const styleProps = {
    '--tree-view-bg-color':
      theme.palette.mode !== 'dark' ? bgColor : bgColorForDarkMode,
  };

  const handleEnterFunction = (e) => {
    if (e.key === 'Enter') {
      addFileToTree(e.target.value)
    }
  }


  return (
    <StyledTreeItemRoot
      label={
        <Box
          onMouseEnter={() => setShowIcon(true)}
          onMouseLeave={() => setShowIcon(false)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            pr: 0,
            p: 0.5
          }}
        >
          <Box component={!isExpanded ? LabelIcon : AiTwotoneFolderOpen} color="inherit" sx={{ mr: 1 }} />
          {!isFileAdd ? <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
            {labelText}
          </Typography> : fileAddFolder === labelText ? <TextField inputProps={{ style: { color: 'white' } }} onKeyDown={(e) => handleEnterFunction(e, labelId)} /> : <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
            {labelText}
          </Typography>}
          {showIcon && !labelText.includes('.') && !isFileAdd && !externalFileAdd ?
            <AiFillFileAdd title='Add file'
              onClick={() => addFile(labelText, labelId)}
            />
            : isFileAdd && fileAddFolder === labelText ? <AiOutlineClose style={{ paddingLeft: '4px', color: "red" }} onClick={() => addFile('')} /> : null}
          {showIcon && (getDeleteButtonForFolder || labelText.includes('.')) && !_.includes(donShowDeleteIcon, labelText) && <MdOutlineDeleteForever color="red" onClick={() => dialogOpen(labelId)} />}
        </Box>
      }
      style={styleProps}
      {...other}
      ref={ref}
    />
  );
});

export default StyledTreeItem;