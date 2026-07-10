import ReactMarkdown from 'react-markdown';
import {MessageItemContainer} from "./styledComponents"

const Message = props =>{
    const {msgcontent,msgsource} =props
    return(
        <MessageItemContainer position = {msgsource}>
            <ReactMarkdown>{msgcontent}</ReactMarkdown>
        </MessageItemContainer>
    )

}

export default Message