import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SideBarContainer, Heading, SessionList, SessionItemWrapper, SessionMain, SessionText, SessionActionsButton, SessionActionMenu, SessionActionItem, EmptyState, Footer, SubFooter, ProfileContinaer, ProfileAvatar, ProfileName, LogoutButton, NewChatButton, SectionTitle } from './styledComponents'

const SideNavBar = ({ sessions = [], activeSessionId, onSelectSession, onDeleteSession, username = 'User', onLogout }) => {
    const navigate = useNavigate();
    const [openSessionMenu, setOpenSessionMenu] = useState(null);
    const handleMenuToggle = (sessionId) => {
        setOpenSessionMenu((current) => (current === sessionId ? null : sessionId));
    };

    const handleDelete = (sessionId) => {
        setOpenSessionMenu(null);
        onDeleteSession?.(sessionId);
    };

    return (
        <SideBarContainer>
            <div>
                <Heading>DOCUCHART</Heading>
                
                <SectionTitle>Recent sessions</SectionTitle>
                <SessionList>
                    {sessions.length === 0 ? (
                        <EmptyState>No saved sessions yet.</EmptyState>
                    ) : (
                        sessions.map((session) => (
                            <SessionItemWrapper key={session.session_id}>
                                <SessionMain
                                    $active={activeSessionId === session.session_id}
                                    $visible = {openSessionMenu === session.session_id }
                                    onClick={() => onSelectSession(session.session_id, session.topic)}
                                >
                                    <SessionText>
                                        {session.topic}
                                    </SessionText>
                                    
                                </SessionMain>
                                <SessionActionsButton 
                                    onClick={() => handleMenuToggle(session.session_id)} 
                                    $active={activeSessionId === session.session_id}
                                    $visible = {openSessionMenu === session.session_id }
                                >
                                        🗑 
                                </SessionActionsButton>
                                {openSessionMenu === session.session_id && (
                                    <SessionActionMenu>
                                        <SessionActionItem onClick={() => handleDelete(session.session_id)}>Delete</SessionActionItem>
                                    </SessionActionMenu>
                                )}
                            </SessionItemWrapper>
                        ))
                    )}
                </SessionList>
                
            </div>
            
            
            <Footer>
                <NewChatButton onClick={() => navigate('/')}>+ New Chat</NewChatButton>
                <SubFooter>
                    <ProfileContinaer>
                        <ProfileAvatar>{username?.charAt(0)?.toUpperCase() || 'U'}</ProfileAvatar>
                        <ProfileName>{username}</ProfileName>
                    </ProfileContinaer>
                    <LogoutButton onClick={onLogout}>Logout</LogoutButton>
                </SubFooter>
                
            </Footer>
        </SideBarContainer>
    )
}

export default SideNavBar

