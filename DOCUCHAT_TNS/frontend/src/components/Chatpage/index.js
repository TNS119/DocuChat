import {useState,useEffect,useRef} from "react"
import { useLocation, useNavigate} from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";
import { FaRedo } from "react-icons/fa";
import { FaCircleArrowUp } from "react-icons/fa6";
import {MagnifyingGlass} from 'react-loader-spinner'
import {ChatContainer,ChatHeadSection, MessagesSubContainer, TopicHeading, HeadContainer, InputTab,InputBox,MessagesContainer,ErrText,EnterButn, BackButton,LoadingContainer,RetrySection,RetryButton,TokenInfoSEC} from "./styledComponents"
import Message from "../Message"
import SideNavBar from "../SideNavbar"
import { mapSessionMessagesToViewMessages } from "./messageUtils"
import { buildApiUrl } from "../../api"


const MessageStatusConstants = {
    "retry": "RETRY",
    "inprogress": "INPROGRESS",
    "success": "SUCCESS",
    "Exceeded": "EXCEEDED"
}


const Chatpage = ({ authFetch }) => {
    const routeNavigation = useNavigate()
    const {state} = useLocation()
    const [userInput,setUserInput] = useState("")
    const [msgStatus,setMsgStatus] = useState(MessageStatusConstants.success)
    const messagesEndRef = useRef(null)
    const [messages,setMessages] = useState([])
    const [sidebarSessions,setSidebarSessions] = useState([])
    const [activeSessionId,setActiveSessionId] = useState(state?.session_id || "")
    const [activeTopic,setActiveTopic] = useState(state?.title || "")
    const [username,setUsername] = useState("User")

    useEffect(()=>{
        const initialMessage = state?.query_response
        if (initialMessage) {
            setMessages([{ id: `initial-${Date.now()}`, message: initialMessage, sender: "bot" }])
        }
    }, [state?.query_response])

    useEffect(() => {
        const loadProfile = async () => {
            try {
                
                const response = await authFetch("/auth/me")
                if (!response.ok) {
                    return
                }
                const data = await response.json()
                if (data?.user?.username) {
                    setUsername(data.user.username)
                }
            } catch (error) {
                console.log("Unable to load profile", error)
            }
        }

        const loadSidebarSessions = async () => {
            try {
                const response = await authFetch("/auth/sessions")

                if (!response.ok) {
                    return
                }

                const data = await response.json()
                if (data?.sessions) {
                    setSidebarSessions(data.sessions)
                }
            } catch (error) {
                console.log("Error loading sidebar sessions:", error)
            }
        }

        loadProfile()
        loadSidebarSessions()
    }, [])

    useEffect(() => {
        if (!activeSessionId) {
            return
        }

        const loadSessionHistory = async () => {
            try {
                const response = await authFetch(`/auth/session/${activeSessionId}`)

                if (!response.ok) {
                    return 
                }

                const data = await response.json()
                if (data?.success && data.session?.messages) {
                    setMessages(mapSessionMessagesToViewMessages(data.session.messages, activeSessionId))
                    if (data.session.topic) {
                        setActiveTopic(data.session.topic)
                    }
                }
            } catch (error) {
                console.log("Error loading session history:", error)
            }
        }

        loadSessionHistory()
    }, [activeSessionId])
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block:"center" })
    }, [messages])
    
    const inputChange =(event)=>{
        setUserInput(event.target.value)
    }

    const getResponseFromLLM =async (query)=>{
        setMsgStatus(MessageStatusConstants.inprogress)
        try{
            console.log("sent request to Backend")
            const response = await authFetch(
                "/response",
                {
                    method: "POST",
                    headers:{
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        query: query,
                        status: false,
                        user_id: "1" ,
                        session_id: activeSessionId || state?.session_id,
                        topic_name: activeTopic || state?.title
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
            setMessages(prev =>[
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
        setMessages(prev =>[
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
        let userQuery = messages.at(-1)?.message
        console.log(userQuery)
        getResponseFromLLM(userQuery, true)    
    }

    const onBackInput = ()=>{
        routeNavigation("/")
    }

    const handleSelectSession = (sessionId, topic) => {
        setActiveSessionId(sessionId)
        setActiveTopic(topic)
    }

    const handleDeleteSession =  async (sessionId) => {
        setSidebarSessions((prevSessions) => {
            const updated = prevSessions.filter((session) => session.session_id !== sessionId)
            return updated
        })

        await authFetch(
                `/auth/session/${sessionId}`,
                {
                    method: "DELETE"
                }
            );

        setActiveSessionId((currentActive) => {
            if (currentActive !== sessionId) return currentActive
            const nextSession = sidebarSessions.find((session) => session.session_id !== sessionId)
            if (nextSession) {
                setActiveTopic(nextSession.topic)
                return nextSession.session_id
            }else{
                routeNavigation("/")
            }
        })

    }


    const handleLogout = async () => {
        try {
            await fetch(buildApiUrl("/auth/logout"), {
                method: "POST",
                credentials: "include"
            })
        } catch (error) {
            console.log("Logout failed", error)
        } finally {
            routeNavigation('/login')
        }
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
                        <ErrText>   something went wrong....</ErrText>
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
            <SideNavBar
                sessions={sidebarSessions}
                activeSessionId={activeSessionId}
                onSelectSession={handleSelectSession}
                onDeleteSession={handleDeleteSession}
                username={username}
                onLogout={handleLogout}
            />
            <MessagesSubContainer>
                <ChatHeadSection>
                    <BackButton onClick={onBackInput}>
                        <IoArrowBackCircle size={"32px"}/>
                    </BackButton>
                    <HeadContainer>
                        <TopicHeading>{activeTopic}</TopicHeading>
                    </HeadContainer>
                </ChatHeadSection>
                <MessagesContainer>
                    {messages.map(each => (
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
            </MessagesSubContainer>
        </ChatContainer>
    )
}

export default Chatpage
