import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import { SandpackCodeEditor, SandpackLayout, SandpackPreview, SandpackProvider, useSandpack } from "@codesandbox/sandpack-react";
import { nightOwl } from "@codesandbox/sandpack-themes";
import axios from "axios";
import _ from "lodash";
import PropTypes from 'prop-types';
import { Resizable } from "re-resizable";
import { useEffect } from "react";
import { authHeader } from "../../api/Api";
import { url } from '../../utils/UrlConstant';
import FileExplorer from "./FileExplorer";


const MyComponent = ({ onGoingExam }) => {

  const { sandpack } = useSandpack();
  const setActiveFiles = (fileName) => {
    sandpack.openFile("/".concat(fileName))
  }

  const addFile = (fileName) => {
    sandpack.addFile(fileName, '//write your code here')
    if (fileName.includes('.')) sandpack.openFile(fileName)
  }

  const deleteFile = (fileName) => {
    sandpack.deleteFile(fileName)
  }

  useEffect(() => {
    const handleSaveShortcut = (event) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        saveCode()
      }
    };

    window.addEventListener('keydown', handleSaveShortcut);

    return () => {
      window.removeEventListener('keydown', handleSaveShortcut);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sandpack.files]);

  const saveCode = () => {
    onGoingExam.sandPackFile = JSON.stringify(sandpack.files)
    axios.post(`${url.CANDIDATE_API}/candidate/onGoingExam`, onGoingExam, {
      headers: authHeader()
    }).catch((error) => {
      // errorHandler(error)
    });
  }

  const updatePackageJson = (jsonName) => {
    if (!jsonName) {
      return
    }
    const keyToFind = _.filter(Object.keys(sandpack.files), file => {
      if (file.includes('package.json')) {
        return file
      }
    })
    const packageJson = JSON.parse(sandpack.files[keyToFind].code)
    packageJson.dependencies[jsonName.name] = jsonName.version
    const updatedPackageJson = JSON.stringify(packageJson, null, 2);
    sandpack.updateFile('package.json', updatedPackageJson, true)
    // sandpack.updateFile(keyToFind,updatedPackageJson,true)
    sandpack.runSandpack()
  }

  return (
    <SandpackLayout style={{ height: '100%' }}>
      <Resizable>
        <FileExplorer file={Object.keys(sandpack.files)} deleteFile={deleteFile} setActiveFiles={setActiveFiles} addFilesToSandpack={addFile} updatePackageJson={updatePackageJson} />
      </Resizable>
      <Resizable defaultSize={{ width: 600 }} minHeight={"100%"} boundsByDirection enable={{ right: true }} >
        <SandpackCodeEditor
          closableTabs
          wrapContent={true}
          showTabs
          showInlineErrors
          style={{ height: '100%' }}
          extensions={[autocompletion()]}
          showLineNumbers
          extensionsKeymap={[completionKeymap]}
        />
      </Resizable>
      <SandpackPreview style={{ height: '100%' }} showOpenInCodeSandbox={false} showNavigator showRefreshButton={true} showRestartButton />
    </SandpackLayout>
  );
};

function ProjectInit({ language, onGoingExam }) {
  const fileJSON = onGoingExam?.sandPackFile ? JSON.parse(onGoingExam.sandPackFile) : {};


  return (

    <SandpackProvider
      options={{
        externalResources: ["https://cdn.tailwindcss.com", 'https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css'],
        showNavigator: true,
        showTabs: true,
        closableTabs: true,
        showConsole: true,
        showConsoleButton: true,
        resizablePanels: true,
        autorun: true,
        autoReload: true,
        // bundlerURL: "http://192.168.1.92:4000",
        visibleFiles: ['/index.js'],
        recompileDelay: 300
      }}
      files={fileJSON}
      theme={nightOwl}
      template={language}
      style={{width: '100%'}}
    >
      <MyComponent onGoingExam={onGoingExam} />
    </SandpackProvider>
  );
}
ProjectInit.propTypes = {
  language: PropTypes.string.isRequired,
  onGoingExam: PropTypes.object.isRequired
}

MyComponent.propTypes = {
  onGoingExam: PropTypes.object.isRequired
}
export default ProjectInit;