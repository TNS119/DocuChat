import styled from "styled-components"

export const ChatContainer= styled.div`
    background-image: url('https://res.cloudinary.com/da00pyggy/image/upload/v1780423651/chat_bg_q2psr4.jpg');
    background-size: cover;
    height: 100vh;
    padding: 24px;
    color: #ffffff;
    font-family: roboto;
    display:flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    overflow: hidden;

    @media (max-width: 768px) {
        background-image: url('https://res.cloudinary.com/da00pyggy/image/upload/v1782409611/copy_of_8e8f4f38-d842-4ff4-aa2a-4651533096dc.png');
    }
`
export const InputTab = styled.form`
    background-color: #ffffff61;
    border-radius: 0px 0px 30px 30px;
    padding: 12px;
    width: 100%;
    text-align:left;
    display:flex;
    align-items:center;
    flex-shrink: 0;
`
export const InputBox = styled.input`
    width: 100%;
    border: 1px dotted transparent;
    outline: none;
    margin:0px;
    padding: 2px;
    color: #faf5f5;
    background-color: transparent;
    text-align:left;
    font-size: 16px;
    margin-left: 16px;

    &::placeholder{
        color: #faf5f5;
    }
`
export const EnterButn = styled.button`
    outline: none;
    cursor:pointer;
    background-color: transparent;
    border:0px;
    font-size: 24px;
    margin-left: auto;
    color: #ffffff;
`

export const MessagesContainer = styled.div`
    flex: 1;
    width: 100%;
    background-color: #36dbf414;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 12px;
    margin: 12px 24px;
    margin-bottom: 0px;
    padding: 12px;
    margin-bottom: 4px;
    border-radius: 8px 8px 0px 0px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
        display: none;
    }
`

export const LoadingContainer = styled.div`
    width:80px;
    background-image: url('https://res.cloudinary.com/da00pyggy/image/upload/v1781644324/b53f3ade-6415-4258-8c2b-d36492aa61ef.png');
    background-size: cover;
    filter: drop-shadow(0 0 6px rgba(0, 180, 255, 0.4));
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 20px;
    margin: 8px;
    margin-top: 12px;
`

export const ChatHeadSection = styled.div`
    width: 100%;
    padding: 12px;
    display:flex;
    align-items:center;
`
    // justify-content: space-around;^^

export const HeadContainer = styled.div`
    width: 62%;
    margin-left: auto;
`
export const TopicHeading = styled.h1`
    font-weight: bold;
    text-decoration: underline;
`

export const BackButton =styled.button`
    background-color: transparent;
    outline: none;
    border:0px;
    padding: 2px;
    color: #ffffff;
    cursor: pointer;
    width: 2%;
`
export const RetrySection = styled.div`
  display:flex;
  justify-content: space-between;
  align-items:center;
  background-color: #550f0f5c;
  color: #ffffff;
  width: 22%;
  border: 0px;  
  padding: 2px 6px 2px 6px;
  border-radius: 18px 18px 18px 2px;
  cursor: pointer;
` 
export const ErrText = styled.p`
    margin-right: auto;
    padding-left: 12px
`
export const RetryButton = styled.button`
  outline: none;
  cursor: pointer;
  background-color: #78090969;
  color: #ffffff;
  width: 10%;
  border: 0px;
  padding: 8px;
  border-radius: 4px;
`

export const TokenInfoSEC = styled.div`
  text-align: center;
  color: #ffffff;
  width:100%
`
