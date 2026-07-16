import styled from 'styled-components';

export const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background-image: url('https://res.cloudinary.com/da00pyggy/image/upload/v1780422843/opoy7_obpl9c.jpg');
  background-size: cover;
  background-position: center;
`;

export const FormCard = styled.form`
  width: 100%;
  max-width: 420px;
  padding: 32px;
  border: 1px dashed rgb(16, 189, 242);
  border-radius: 40px;
  background: rgba(2, 12, 25, 0.62);
  backdrop-filter: blur(6px);
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.25);
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

export const PasswordShowButton = styled.button`
  width: 20%;
  background-color: transparent !important;
  outline: none;
  border: 0px;
  color: #ffffff;
  transition: all 0.8s ease;
`

export const Title = styled.h1`
  font-family: roboto;
  color: rgb(16, 189, 242);
  margin: 0 0 8px;
`;

export const Subtitle = styled.p`
  color: #dbeafe;
  margin: 0 0 20px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
`;

export const Label = styled.label`
  color: #e0f2fe;
  font-size: 14px;
`;

export const Input = styled.input`
  width: 100%;
  background-color: rgba(16, 189, 242, 0.14) !important;
  border: 1px solid rgb(16, 189, 242);
  border-radius: 20px;
  color: #ffffff;
  padding: 10px 12px;
  outline: none;
`;

export const SubmitButton = styled.button`
  width: 100%;
  background-color: transparent;
  color: rgb(16, 189, 242);
  border: 1px solid rgb(16, 189, 242);
  padding: 10px 12px;
  margin-top: 8px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background-color: rgba(16, 189, 242, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`;

export const Message = styled.p`
  margin-top: 12px;
  font-size: 14px;
  color: ${({ success }) => (success ? '#bbf7d0' : '#fecaca')};
`;

export const FooterText = styled.p`
  margin-top: 14px;
  color: #bae6fd;
  font-size: 14px;
  text-align: center;
`;
