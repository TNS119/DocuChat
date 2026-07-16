import {useNavigate} from "react-router-dom"
import {useEffect, useState} from "react"
import {v4 as uuidv4} from 'uuid'
import {Watch} from 'react-loader-spinner'
// import { buildApiUrl } from '../../api'
import {FormContainer, FormElement,LoadingContainer,LoadingText,Heading,Labels,InputEle , UploadWrapper, CustomLabel, HiddenInput,FileDisplayBox,SubmitButton, RetryTxt, RetryButton, ActionRow} from "./styledComponents"



const UploadStatusConstants = {
    "retry": "RETRY",
    "inprogress": "INPROGRESS",
    "success": "SUCCESS"
}


const Home = ({ authFetch }) => {
    const navigate = useNavigate()
    const [topic,setTopic] = useState("")
    const [uploadStatus, setUploadStatus] = useState(UploadStatusConstants.success)
    const [file,setFile] = useState(null)
    const [activeSessionId,setActiveSessionId] = useState(null)
    const [latestSession, setLatestSession] = useState(null)

    useEffect(() => {
        const loadLatestSession = async () => {
            try {
                const response = await authFetch("/auth/sessions")
                if (!response.ok) {
                    return
                }
                const data = await response.json()
                if (data?.sessions?.length) {
                    const lastSession = data.sessions[data.sessions.length - 1]
                    setLatestSession(lastSession)
                }
            } catch (error) {
                console.log("Unable to load latest session", error)
            }
        }

        loadLatestSession()
    }, [])

    const reUploadingFile = async () =>{
        setUploadStatus(UploadStatusConstants.inprogress)
        try{
            console.log("uploading started")
            const formData = new FormData();
            console.log(`active id for retry${activeSessionId}`)
            formData.append("file",file)
            formData.append("session_id",activeSessionId)
            const response = await authFetch(
                `/process/${topic}`,
                {
                    method: "POST",
                    body: formData,
                }
            )
            if(!response.ok){
                throw new Error(`Upload failed with status ${response.status}`)
            }
            console.log("uploaded file")
            const data = await response.json()
            console.log(data)
            if(data[1] === 500){
                    throw new Error(`Uploaded but not processed: ${data[0].error}`)
            }
            setUploadStatus(UploadStatusConstants.success)
            navigate("/chat",{
                state:{
                    query_response: data.response_msg,
                    title: topic,
                    session_id: activeSessionId
                }
            })
        }catch(error){
            console.log(`Error at uploading and processing file: ${error}`)
            setUploadStatus(UploadStatusConstants.retry)
        }
        
    }

    const uploadingFile = async () =>{
        setUploadStatus(UploadStatusConstants.inprogress)
        try{
            console.log("uploading started")
            const formData = new FormData();
            const session_id = uuidv4()
            console.log(session_id)
            setActiveSessionId(session_id)
            formData.append("file",file)
            formData.append("session_id",session_id)
            const response = await authFetch(
                `/process/${topic}`,
                {
                    method: "POST",
                    body: formData,
                }
            )
            if(!response.ok){
                throw new Error(`Upload failed with status ${response.status}`)
            }
            console.log("uploaded file")
            const data = await response.json()
            console.log(data)
            if(data[1] === 500){
                    throw new Error(`Uploaded but not processed: ${data[0].error}`)
            }
            
            setUploadStatus(UploadStatusConstants.success)
            navigate("/chat",{
                state:{
                    query_response: data.response_msg,
                    title: topic,
                    session_id: session_id
                }
            })
        }catch(error){
            console.log(`Error at uploading and processing file: ${error}`)
            setUploadStatus(UploadStatusConstants.retry)
        }
        
    }
    const submission = (event) => {
        event.preventDefault()
        console.log("uploading")
        uploadingFile("false")
    }

    const topicChange =(event)=>{
        setTopic(event.target.value)
    }

    const loadingView = () =>(
            <LoadingContainer>
                <Watch  color="rgba(0, 192, 251, 0.28)" height="60" width="60" />
                <LoadingText>Processing file...</LoadingText>
            </LoadingContainer>
    )

    const retryView = () =>(
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "20px"}}>
            <RetryButton onClick={reUploadingFile}>Retry!</RetryButton>
            <RetryTxt>Upload failed! Please try again.</RetryTxt>
        </div>
    )

    const renderInputForm = ()=>(
        <FormElement onSubmit={submission}>
            <Heading>DOCUCHART</Heading>
            <Labels htmlFor="topic">Enter the topic</Labels>
            <InputEle id="topic" type="text" onChange={topicChange} value={topic}/>
            <UploadWrapper>
            <CustomLabel htmlFor="File">FILE</CustomLabel>
            <HiddenInput 
                id="File" 
                type="file" 
                accept=".pdf, .docx, .doc, .pptx, .xlsx, .csv, .html, .epub, .md, .txt, .text, .qmd, .Rmd, .odt, .ods, .odp, .eml, .msg, image/*, audio/*, .vtt"
                onChange={(e) => setFile(e.target.files[0])}
            />
            <FileDisplayBox>
                {file ? file.name : "No file chosen"}
            </FileDisplayBox>
            </UploadWrapper>

            <ActionRow>
                <SubmitButton type="submit" disabled={!file}>Submit</SubmitButton>
                {latestSession && (
                    <SubmitButton type="button" onClick={() => navigate('/chat', { state: { session_id: latestSession.session_id, title: latestSession.topic } })}>
                        Continue to chat
                    </SubmitButton>
                )}
            </ActionRow>
        </FormElement>
    )

    const getStatusView = () => {
        switch(uploadStatus){
            case UploadStatusConstants.inprogress:
                return loadingView()
            case UploadStatusConstants.retry:
                return retryView()
            case UploadStatusConstants.success:
                return renderInputForm()
            default:
                return renderInputForm()
        }
    }

    return(
    <FormContainer>
        {getStatusView()}
    </FormContainer>
)

}
export default Home
