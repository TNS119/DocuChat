import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {FaEye, FaEyeSlash } from "react-icons/fa";
import { buildApiUrl } from '../../api';
import {
  PageContainer,
  FormCard,
  Title,
  Subtitle,
  Field,
  Label,
  InputContinaer,
  Input,
  SubmitButton,
  PasswordShowButton,
  Message,
  FooterText
} from './styledComponents';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [passwordType,setPasswordType] = useState("password")
  const [status, setStatus] = useState({ success: false, message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePassword = () =>{
        if (passwordType === "password" ){
            setPasswordType("text")
        }else{
            setPasswordType("password")
        }
    }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ success: false, message: '' });

    try {
      const response = await fetch(buildApiUrl('/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'Registration failed');
      }

      setStatus({ success: true, message: 'Account created. Redirecting to login...' });
      setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      setStatus({ success: false, message: error.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <FormCard onSubmit={handleSubmit}>
        <Title>Create account</Title>
        <Subtitle>Join DOCUCHART and start chatting with your PDFs.</Subtitle>
        <Field>
          <Label htmlFor="username">Username</Label>
          <InputContinaer>
          <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
          />
          </InputContinaer>
        </Field>

      <Field>
          <Label htmlFor="password">Password</Label>
          <InputContinaer>
          <Input
              id="password"
              type = {passwordType}
              value={formData.password}
              onChange={handleChange}
              placeholder="Choose a password"
              required
          />
          <PasswordShowButton type="button" onClick={handlePassword}>
              {passwordType ==="password"? <FaEye size={20}/> :<FaEyeSlash size={20}/>}
          </PasswordShowButton>
          </InputContinaer>
          
      </Field>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </SubmitButton>

        {status.message && <Message success={status.success}>{status.message}</Message>}

        <FooterText>
          Already have an account? <Link to="/login" style={{ color: '#7dd3fc' }}>Login</Link>
        </FooterText>
      </FormCard>
    </PageContainer>
  );
};

export default RegisterPage;
