import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { nightOwl } from "@codesandbox/sandpack-themes";
import axios from "axios";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import  url  from "../../utils/UrlConstant";
import { authHeader } from "../../api/Api";

export default function ProjectResultView() {
  const { resultId } = useParams();
  const [fileJSON, setFileJSON] = useState({})
  const [template, setTemplate] = useState('')
  const [isJsonFetched, setIsJsonFetched] = useState(false)

  useEffect(() => {
    axios.get(`${url.CANDIDATE_API}/candidate/exam-result/${resultId}`, {
      headers: authHeader()
    })
      .then(res => {
        let files = JSON.parse(res.data.response.sandPackFile)
        _.map(Object.keys(files), fileName => {
          if (files[fileName]?.code === "//write your code here") {
            if (!fileName.includes('.')) {
              delete files[fileName]
            }
          }
        })
        setFileJSON(files)
        setIsJsonFetched(true)
        setTemplate(res.data.response.frontendLanguage)
      }).catch((error) => {
        // errorHandler(error)
      });
    // eslint-disable-next-line
  }, [])

  return (
    <>
      {isJsonFetched &&
        <SandpackProvider
          files={fileJSON}
          theme={nightOwl}
          template={template}
          options={{
            showNavigator: true,
            showTabs: true,
            closableTabs: true,
            showConsole: true,
            showConsoleButton: true,
            resizablePanels: true,
            autorun: true,
          }}
        >
          <SandpackLayout>
            <SandpackFileExplorer style={{ height: '95vh' }} />
            <SandpackCodeEditor
              style={{ height: '95vh' }}
              showTabs
              showLineNumbers={false}
              showInlineErrors
              wrapContent
              closableTabs
              readOnly
            />
            <SandpackPreview style={{ height: '95vh' }} showOpenInCodeSandbox={false} showNavigator />
          </SandpackLayout>
        </SandpackProvider>}
    </>
  )
};