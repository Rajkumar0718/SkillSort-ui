
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, TextField } from '@mui/material';

import { TreeView } from '@mui/x-tree-view/TreeView';
import _ from 'lodash';
import { AiFillFile, AiOutlinePlus } from 'react-icons/ai';
import { BiLogoTypescript } from 'react-icons/bi';
import { DiGit } from 'react-icons/di';
import { FaFileLines, FaFolder } from 'react-icons/fa6';
import { LuFileJson } from 'react-icons/lu';


import { PiFileCssFill, PiFileHtmlFill, PiFileJsFill, PiFileJsxFill } from 'react-icons/pi';

import React, { useEffect, useRef, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import StyledTreeItem from './StyledTreeItem';
import axios from 'axios';
import CustomAutoComplete from './CustomAutoComplete';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const fileIcons = {
  "js": PiFileJsFill,
  "html": PiFileHtmlFill,
  "txt": FaFileLines,
  "jsx": PiFileJsxFill,
  "css": PiFileCssFill,
  "json": LuFileJson,
  "gitignore": DiGit,
  "ts": BiLogoTypescript
}

const fileAvailable = ['js', 'html', 'txt', 'json', 'css', 'tsx', 'jsx', 'gitignore', 'ts']




export default function FileExplorer({ file, setActiveFiles, addFilesToSandpack, deleteFile, updatePackageJson }) {
  const [files, setFiles] = useState([]);
  const [flattenTree, setFlattenTree] = useState([])
  const [open, setOpen] = React.useState(false);
  const myref = useRef(null);

  const [expanded, setExpanded] = React.useState([]);
  const [basePath, setBasePath] = useState('');
  const [isFileAdd, setIsFileAdd] = useState(false)
  const [fileAddFolder, setFileAddFolder] = useState('')
  const [externalFileAdd, setExternalFileAdd] = useState(false)
  const [showSearch, setShowSearch] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [toggleClicked, setToggleClicked] = useState(false);



  const handleToggle = (event, nodeIds) => {
    if (nodeIds)
      setExpanded(nodeIds);
  };

  const toggleSearch = () => {
    setToggleClicked(!toggleClicked)
    myref.current.style.width = !toggleClicked ? '300px' : '140px'
    setShowSearch(!showSearch);
  };

  const handleAddFile = (label, nodeId) => {
    setIsFileAdd(!isFileAdd)
    if (label) {
      setFileAddFolder(label)
      const path = _.find(flattenTree, f => f.nodeId === nodeId)?.label || ""
      setBasePath('/'.concat(path))
    }
  }

  const addFileToTree = (name) => {
    addFilesToSandpack(basePath.concat('/').concat(name))
    setBasePath('')
    setIsFileAdd(false)
    setExternalFileAdd(false)
    setFileAddFolder('')
  }

  const handledeleteFile = () => {
    setOpen(false)
    deleteFile(basePath)
    setBasePath('')
  }

  const handleOpen = (nodeId) => {
    const path = _.find(flattenTree, f => f.nodeId === nodeId)?.label || ""
    setBasePath('/'.concat(path))
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }


  function convertToTreeItems(tree, parentId = null) {
    return Object.keys(tree).map((key, index) => {
      const id = parentId ? `${parentId}.${index}` : `${index}`;
      const childKeys = Object.keys(tree[key]);
      const children = (childKeys.length > 0) ? convertToTreeItems(tree[key], id) : [];
      return {
        nodeId: id,
        label: key,
        children: children,
      };
    });
  }



  const findLabel = (node) => {
    if (node.label.includes(".")) {
      const path = _.find(flattenTree, f => f.nodeId === node.nodeId).label
      setActiveFiles(path)
    }

  }


  function flattenNodes(nodeArray, parentLabel = "", result = []) {

    for (const node of nodeArray) {
      const label = parentLabel === "" ? node.label : parentLabel + "/" + node.label;
      const children = node.children;
      result.push({ ...node, label, children: [] })
      if (children && children.length > 0) {
        flattenNodes(children, label, result);
      }

    }

    return result;
  }

  const getFolderIcons = (name) => {
    let names = name.split('.')
    let iconName = names[names.length - 1]
    if (names.length > 1 && fileAvailable.indexOf(iconName) > -1) {
      return fileIcons[iconName]
    } else if (name.includes('.')) {
      return AiFillFile
    }

    return FaFolder
  }

  const handleSearch = (searchValue) => {
    axios
      .get(`https://registry.npmjs.org/-/v1/search?text=${searchValue}&size=20`)
      .then((response) => {
        setSuggestions(response.data.objects);
      })
      .catch((error) => {
        console.error('Error fetching suggestions:', error);
      });
  }

  const updatePackage = (jsonFile) => {
    if (jsonFile)
      updatePackageJson(jsonFile.package)
  }

  useEffect(() => {
    let tree = {};
    file.forEach(path => {
      path.split('/').reduce((r, name, i, a) => {
        if (!r[name]) {
          r[name] = {};
        }
        return r[name];
      }, tree);
    });
    let f = convertToTreeItems(tree[""]);
    setFiles(f)
    setFlattenTree(flattenNodes(f))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  const handleEnterFunction = (e) => {
    if (e.key === 'Enter') {
      addFileToTree(e.target.value)
    }
  }

  const getDeleteButtonForFolder = (nodeId, nodes = files) => {
    for (const node of nodes) {
      if (node.nodeId === nodeId) {
        return node.children.length === 0;
      } else if (node.children.length > 0) {
        const found = getDeleteButtonForFolder(nodeId, node.children);
        if (found !== undefined) {
          return found;
        }
      }
    }
    return undefined;
  }

  const renderTreeItems = (tree, findLabel) => {
    return tree.map((item, i) => {
      const hasChildren = item?.children && item.children.length > 0;

      return (
        <StyledTreeItem
          key={item.nodeId}
          nodeId={item.nodeId}
          labelText={item.label}
          labelIcon={getFolderIcons(item.label)}
          onClick={() => findLabel(item)}
          labelId={item.nodeId}
          addFile={handleAddFile}
          file={files}
          isFileAdd={isFileAdd}
          fileAddFolder={fileAddFolder}
          externalFileAdd={externalFileAdd}
          dialogOpen={handleOpen}
          addFileToTree={addFileToTree}
          getDeleteButtonForFolder={getDeleteButtonForFolder(item.nodeId)}
          isExpanded={expanded.indexOf(item.nodeId) !== -1}
        >
          {hasChildren ? renderTreeItems(item.children, findLabel) : null}
        </StyledTreeItem>
      )
    });
  };

  const setTreeView = (tree) => {
    return renderTreeItems(tree, findLabel);
  }

  return (
    <div style={{ height: '100%' }}>

      <TreeView
        expanded={expanded}
        onNodeToggle={handleToggle}
        aria-label="file system navigator"
        style={{ overflow: 'auto', paddingTop: '1rem', backgroundColor: 'var(--sp-colors-surface1)',height:'100%' }}
      >
        <div style={{ float: 'right', justifyContent: 'center', alignItems: 'center' }}>
          {!externalFileAdd ? <AiOutlinePlus onClick={() => setExternalFileAdd(true)} /> : <MdOutlineCancel color='red' onClick={() => setExternalFileAdd(false)} />}
        </div>
        {externalFileAdd ? <TextField style={{ padding: '.3rem' }} inputProps={{ style: { color: 'white' } }} onKeyDown={(e) => handleEnterFunction(e)} /> : null}
        {setTreeView(files)}
        <div style={{ position: 'relative', top: '30%' }}>
          <button ref={myref} style={{ float: 'left', width: '140px', backgroundColor: 'var(--sp-colors-surface1)', borderColor: 'rgb(17, 82, 147)' }} onClick={toggleSearch}>Dependencies</button>
          <br />
          <br />

          {showSearch && (
            <CustomAutoComplete handleSearch={handleSearch} updatePackage={updatePackage} suggestions={suggestions} />
          )}
        </div>
      </TreeView>


      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Are tou sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to delete the file
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handledeleteFile()}>Yes </Button>
          <Button onClick={handleClose}>No</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
