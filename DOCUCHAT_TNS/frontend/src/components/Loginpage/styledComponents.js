import styled from 'styled-components';

export const OuterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background-image: url('https://res.cloudinary.com/da00pyggy/image/upload/v1780422843/opoy7_obpl9c.jpg');
  background-size: cover;
  background-position: center;
`;

export const InnerContainer = styled.form`
  width: 100%;
  max-width: 420px;
`;

export const Card = styled.div`
  padding: 32px;
  border: 1px dashed rgb(16, 189, 242);
  border-radius: 40px;
  background: rgba(2, 12, 25, 0.62);
  backdrop-filter: blur(6px);
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.25);
`;

export const Heading = styled.h1`
  margin: 0 0 8px;
  color: rgb(16, 189, 242);
  font-family: roboto;
  font-size: 28px;
`;

export const SubHeading = styled.p`
  margin: 0 0 20px;
  color: #dbeafe;
  font-size: 15px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
`;

export const Label = styled.label`
  color: #e0f2fe;
  font-size: 14px;
`;
export const InputContinaer = styled.div`
  width: 100%;
  background-color: rgba(16, 189, 242, 0.14) !important;
  border: 1px solid rgb(16, 189, 242);
  border-radius: 20px;
  display: flex;
  flexDirection: row;
  justify-content: space-between;
  alignItems: center;
`
export const Input = styled.input`
  width: 100%;
  border-radius: 20px;
  padding: 10px 6px 10px 16px;
  background-color: transparent !important;
  outline: none;
  border: 0px;
  color: #ffffff;
  font-size: 14px;
`;

export const PasswordShowButton = styled.button`
  width: 20%;
  background-color: transparent !important;
  outline: none;
  border: 0px;
  color: #ffffff;
  transition: all 0.8s ease;
`

export const Button = styled.button`
  width: 100%;
  background-color: transparent;
  color: rgb(16, 189, 242);
  border: 1px solid rgb(16, 189, 242);
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 8px;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background-color: rgba(16, 189, 242, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`;

export const ErrorText = styled.p`
  color: #fecaca;
  margin: 0 0 10px;
  font-size: 14px;
  min-height: 20px;
`;

export const LinkText = styled.p`
  margin-top: 14px;
  color: #bae6fd;
  font-size: 14px;
  text-align: center;
`;