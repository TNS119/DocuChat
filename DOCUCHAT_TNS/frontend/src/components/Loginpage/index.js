import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {FaEye, FaEyeSlash } from "react-icons/fa";
import { buildApiUrl } from '../../api';
import {
    OuterContainer,
    InnerContainer,
    Card,
    Heading,
    SubHeading,
    Field,
    Label,
    InputContinaer,
    Input,
    PasswordShowButton,
    Button,
    ErrorText,
    LinkText
} from './styledComponents';

const LoginPage = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordType,setPasswordType] = useState("password")
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(buildApiUrl('/auth/login'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok || !data?.success) {
                throw new Error(data?.message || 'Login failed');
            }

            setIsAuthenticated(true);
            navigate('/', { replace: true });
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handlePassword = () =>{
        if (passwordType === "password" ){
            setPasswordType("text")
        }else{
            setPasswordType("password")
        }
    }

    return (
        <OuterContainer>
            <InnerContainer onSubmit={handleSubmit}>
                <Card>
                    <Heading>Welcome back</Heading>
                    <SubHeading>Sign in to continue with your PDF chats</SubHeading>

                    <Field>
                        <Label htmlFor="username">Username</Label>
                        <InputContinaer>
                        <Input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            placeholder="Enter your username"
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
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                        <PasswordShowButton type="button" onClick={handlePassword}>
                            {passwordType ==="password"? <FaEye size={20}/> :<FaEyeSlash size={20}/>}
                        </PasswordShowButton>
                        </InputContinaer>
                        
                    </Field>

                    <ErrorText>{error || ' '}</ErrorText>

                    <Button type="submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Login'}
                    </Button>

                    <LinkText>
                        New here? <Link to="/register" style={{ color: '#7dd3fc' }}>Create an account</Link>
                    </LinkText>
                </Card>
            </InnerContainer>
        </OuterContainer>
    );
};

export default LoginPage;