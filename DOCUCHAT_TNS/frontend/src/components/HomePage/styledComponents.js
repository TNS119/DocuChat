import styled from "styled-components"

export const FormContainer = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image: url('https://res.cloudinary.com/da00pyggy/image/upload/v1780422843/opoy7_obpl9c.jpg');
    background-size: cover;

    @media (max-width: 768px) {
        background-image: url('https://res.cloudinary.com/da00pyggy/image/upload/v1782409611/copy_of_8e8f4f38-d842-4ff4-aa2a-4651533096dc.png');
    }
`

export const FormElement = styled.form`
    display: flex;
    flex-direction: column;
    color: #ffffff;
    padding: 32px;
    border: 1px dashed rgb(16, 189, 242);
    border-radius: 80px;
    width: 400px;
`

export const LoadingText = styled.p`
    color:rgba(16, 189, 242, 0.55);
    text-align:center;
`
export const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 20px;
    margin-top: 12px;
`

export const Heading = styled.h1`
    font-family: roboto;
    color: ${props => props.color};
`
export const Labels = styled.label`
    margin-bottom: 8px;
    text-align: start;
`
export const InputEle = styled.input`
    width:100%;
    background-color: rgba(16, 189, 242, 0.14) !important;
    border: 1px solid rgb(16, 189, 242);
    border-radius: 20px;
    color: #ffffff;
    padding: 6px;
    outline: none;
`

export const SubmitButton = styled.button`
    background-color: transparent;
    color: rgb(16, 189, 242);
    border: 1px solid rgb(16, 189, 242);
    padding: 4px;
    margin-top: 8px;
    border-radius: 4px;
    width: 30%;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover:not(:disabled) {
        background-color: rgba(16, 189, 242, 0.2);
    }
    
    &:disabled {
        color: rgba(16, 189, 242, 0.5);
        border-color: rgba(16, 189, 242, 0.5);
        cursor: not-allowed;
        opacity: 0.6;
    }
`

export const RetryTxt = styled.p`
  text-align: center;
  color: rgba(16, 189, 242, 0.55);
  margin-top: 0px;
`

export const RetryButton = styled.button`
    background-color: transparent;
    color: rgba(16, 189, 242, 0.55);
    border: 1px solid rgb(16, 189, 242);
    padding: 8px 16px;
    margin-top: 8px;
    margin-bottom:0px;
    border-radius: 4px;
    width: 50%;
    cursor: pointer;
    font-size: 20px;
    &:hover {
        background-color: rgba(16, 189, 242, 0.24);
    }
`

export const UploadWrapper = styled.div`
  display: flex;
  align-items: center;
  font-family: sans-serif;
  padding: 4px;
  margin-top:4px;
`

export const CustomLabel = styled.label`
  display: inline-block;
  padding: 8px 16px;
  background-color: #0bb8e8b1; 
  color: #ffffff;
  border: 0px;
  border-radius: 30px 0px 0px 30px;
  cursor: pointer;
  font-size: 14px; 
  width: 20%;
  text-align: center;
  
  &:hover {
    background-color: #0ee8fca5;
  }
`

export const HiddenInput = styled.input`
  display: none;
`

export const FileDisplayBox = styled.div`
  border: 0px; 
  padding: 8px 4px;
  min-width: 250px;
  color: rgb(225, 234, 237);
  font-size: 14px;
`
