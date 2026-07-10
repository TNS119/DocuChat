import {useState,useEffect,useRef} from "react"
import { useLocation, useNavigate} from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";
import { FaRedo } from "react-icons/fa";
import { FaCircleArrowUp } from "react-icons/fa6";
import {MagnifyingGlass} from 'react-loader-spinner'
import {ChatContainer,ChatHeadSection, TopicHeading, HeadContainer, InputTab,InputBox,MessagesContainer,ErrText,EnterButn, BackButton,LoadingContainer,RetrySection,RetryButton,TokenInfoSEC} from "./styledComponents"
import Message from "../Message"


const MessageStatusConstants = {
    "retry": "RETRY",
    "inprogress": "INPROGRESS",
    "success": "SUCCESS",
    "Exceeded": "EXCEEDED"
}


const Chatpage = () =>{
    const navigateBack = useNavigate()
    const {state} = useLocation()
    const [userInput,setUserInput] = useState("")
    const [msgStatus,setMsgStatus] = useState(MessageStatusConstants.success)
    const messagesEndRef = useRef(null)
    const [responseMsgs,setResponseMsgs] = useState([])

    useEffect(()=>{
        console.log("Effect 1 ran");
        setResponseMsgs(prev =>[
            ...prev,
            {
            id: Date.now(),
            message: state.query_response,
            sender: "bot"
            }])
        },[])  
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block:"center" })
    }, [responseMsgs])
    
    const inputChange =(event)=>{
        setUserInput(event.target.value)
    }


    const getResponseFromLLM =async (query)=>{
        setMsgStatus(MessageStatusConstants.inprogress)
        try{
            console.log("sent request to Backend")
            const response = await fetch(
                "https://docuchat-pqz3.onrender.com/response",
                {
                    method: "POST",
                    headers:{
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        query: query,
                        status: "False",
                        session_id: state.session_id,
                        topic_name: state.title
                    })
                }
            )
            
            console.log("got response from  Backend")
            if(!response.ok){
                throw new Error(`response failed from FASTAPI: ${response.statusText}`);
            }
            const data = await response.json();
            // console.log("Response message:")
            // console.log(data)
            if(data[1] === 500){
                console.log("Token exceeded detected, setting status...") 
                setMsgStatus(MessageStatusConstants.Exceeded)
                return
            }
            setResponseMsgs(prev =>[
                ...prev,
                {
                id: Date.now(),
                message: data.response_msg,
                sender: data.sender
                }]
            )
            setMsgStatus(MessageStatusConstants.success)
        }catch (error){
            console.log(`Error at nodejs(port 5000): ${error}`)
            setMsgStatus(MessageStatusConstants.retry)
        }
        
    }

    const onEnterInput = (event)=>{
        event.preventDefault()
        getResponseFromLLM(userInput,false)
        setResponseMsgs(prev =>[
            ...prev,
            {
            id: Date.now(),
            message: userInput,
            sender: "user"
            }
        ])
        setUserInput("")
    }

    

    const onRetry = ()=>{
        let userQuery = responseMsgs.at(-1).message
        console.log(userQuery)
        getResponseFromLLM(userQuery, true)    
    }

    const onBackInput = ()=>{
        navigateBack("/")
    }

    const getStatusSec = () =>{
        switch(msgStatus){
            case MessageStatusConstants.inprogress:
                return(
                    <LoadingContainer>
                        <MagnifyingGlass  color="rgb(19, 18, 18)" height="40" width="40" />
                    </LoadingContainer>
                )
            case MessageStatusConstants.retry:
                return(
                    <RetrySection > 
                        <FaRedo onClick={onRetry} size={24}/>
                        <ErrText>something went wrong....</ErrText>
                    </RetrySection>
                )
            case MessageStatusConstants.Exceeded:
                return (
                    <TokenInfoSEC>
                        <RetryButton onClick={onRetry}>
                            Retry Again
                        </RetryButton>
                        <p>It seems like Token limit Exceeded wait upto 60sec and Retry...</p>
                    </TokenInfoSEC>
                )
            case MessageStatusConstants.success:
                return null  
            default:
                return null

        } 
    }


    return(
        <ChatContainer>
            <ChatHeadSection>
                <BackButton onClick={onBackInput}>
                    <IoArrowBackCircle size={"32px"}/>
                </BackButton>
                <HeadContainer>
                    <TopicHeading>{state.title}</TopicHeading>
                </HeadContainer>
                
            </ChatHeadSection>
            <MessagesContainer>
                {responseMsgs.map(each => (
                    <Message key={each.id} msgcontent={each.message} msgsource={each.sender}/>
                ))}
                {getStatusSec()}
                <div ref={messagesEndRef} />
            </MessagesContainer>
            <InputTab onSubmit={onEnterInput}>
                <InputBox 
                    type="text" 
                     autoComplete="off"
                    placeholder="Ask Anything about PDF..." 
                    onChange={inputChange} value={userInput}
                />
                {userInput !== "" && <EnterButn type="submit"><FaCircleArrowUp /></EnterButn>}
            </InputTab>
        </ChatContainer>
    )
}

export default Chatpage
