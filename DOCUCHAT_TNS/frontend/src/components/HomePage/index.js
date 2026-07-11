import {useNavigate} from "react-router-dom"
import {useState} from "react"
import {v4 as uuidv4} from 'uuid'
import {Watch} from 'react-loader-spinner'
import {FormContainer, FormElement,LoadingContainer,LoadingText,Heading,Labels,InputEle , UploadWrapper, CustomLabel, HiddenInput,FileDisplayBox,SubmitButton, RetryTxt, RetryButton} from "./styledComponents"



const UploadStatusConstants = {
    "retry": "RETRY",
    "inprogress": "INPROGRESS",
    "success": "SUCCESS"
}



const Home =(props) =>{
    const navigate = useNavigate()
    const [topic,setTopic] = useState("")
    const [uploadStatus, setUploadStatus] = useState(UploadStatusConstants.success)
    const [file,setFile] = useState(null)

    const uploadingFile = async () =>{
        setUploadStatus(UploadStatusConstants.inprogress)
        try{
            console.log("uploading started")
            const formData = new FormData();
            const session_id = uuidv4()
            console.log(session_id)
            formData.append("pdf",file)
            formData.append("session_id",session_id)
            const response = await fetch(
                `https://docuchat-pqz3.onrender.com/process/${topic}`,
                
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
        uploadingFile()
    }

    const topicChange =(event)=>{
        setTopic(event.target.value)
    }

    const loadingView = () =>(
            <LoadingContainer>
                <Watch  color="rgba(0, 192, 251, 0.28)" height="60" width="60" />
                <LoadingText>Processing PDF...</LoadingText>
            </LoadingContainer>
    )

    const retryView = () =>(
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "20px"}}>
            <RetryButton onClick={uploadingFile}>Retry!</RetryButton>
            <RetryTxt>Upload failed! Please try again.</RetryTxt>
        </div>
    )

    const renderInputForm = ()=>(
        <FormElement onSubmit={submission}>
            <Heading color="rgb(16, 189, 242)">DOCUCHART</Heading>
            <Labels htmlFor="topic">Enter the topic</Labels>
            <InputEle id="topic" type="text" onChange={topicChange} value={topic}/>
            <UploadWrapper>
            <CustomLabel htmlFor="File">DOC</CustomLabel>
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

            <SubmitButton type="submit" disabled={!file}>Submit</SubmitButton>
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
