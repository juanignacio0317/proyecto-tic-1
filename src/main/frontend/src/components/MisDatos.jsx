import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { PersonCircle, Lock, Envelope, Phone, PersonFill, ShieldCheck } from 'react-bootstrap-icons';
import NavbarComponent from './Navbar';

const MisDatos = () => {
    const [userData, setUserData] = useState(null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('User data:', data);
                setUserData(data);
            } else {
                console.error('Error response:', response.status);
                setMessage({ type: 'danger', text: 'Error al cargar los datos' });
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            setMessage({ type: 'danger', text: 'Error al cargar los datos' });
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/users/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(passwordData)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: data.message });
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setShowPasswordForm(false);
            } else {
                setMessage({ type: 'danger', text: data.error });
            }
        } catch (error) {
            setMessage({ type: 'danger', text: 'Error al cambiar la contraseña' });
        } finally {
            setLoading(false);
        }
    };

    if (!userData) {
        return (
            <>
                <NavbarComponent />
                <div style={{
                    minHeight: '100vh',
                    backgroundColor: '#1D7B74',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </>
        );
    }

    const isAdmin = userData.role === 'ADMIN';

    return (
        <>
            <NavbarComponent />
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#1D7B74',
                paddingTop: '40px',
                paddingBottom: '60px'
            }}>
                <Container style={{ maxWidth: '900px' }}>
                    {/* Header con Avatar */}
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '40px'
                    }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            backgroundColor: '#F2C94C',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                            position: 'relative'
                        }}>
                            <PersonCircle size={80} style={{ color: '#1D7B74' }} />
                            {isAdmin && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '5px',
                                    right: '5px',
                                    backgroundColor: '#1D7B74',
                                    borderRadius: '50%',
                                    width: '35px',
                                    height: '35px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '3px solid #F2C94C'
                                }}>
                                    <ShieldCheck size={20} color="white" />
                                </div>
                            )}
                        </div>
                        <h2 className="text-white mb-1" style={{ fontWeight: '600', fontSize: '2rem' }}>
                            {userData.name} {userData.surname}
                        </h2>
                        <p className="text-white" style={{ opacity: 0.9, fontSize: '1.1rem' }}>
                            {userData.email}
                        </p>
                        {isAdmin && (
                            <span style={{
                                backgroundColor: '#F2C94C',
                                color: '#1D7B74',
                                padding: '6px 16px',
                                borderRadius: '20px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                display: 'inline-block',
                                marginTop: '8px'
                            }}>
                                <ShieldCheck size={16} className="me-1" />
                                Administrador
                            </span>
                        )}
                    </div>

                    {message.text && (
                        <Alert
                            variant={message.type}
                            dismissible
                            onClose={() => setMessage({ type: '', text: '' })}
                            style={{
                                borderRadius: '12px',
                                border: 'none',
                                marginBottom: '30px'
                            }}
                        >
                            {message.text}
                        </Alert>
                    )}

                    {/* Información Personal */}
                    <Card style={{
                        border: 'none',
                        borderRadius: '16px',
                        marginBottom: '24px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #F2C94C 0%, #F2B94C 100%)',
                            padding: '20px 24px',
                            borderBottom: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            <h5 className="mb-0" style={{ fontWeight: '600', color: '#1D7B74' }}>
                                <PersonFill size={22} className="me-2" />
                                Información Personal
                            </h5>
                        </div>
                        <Card.Body style={{ padding: '32px' }}>
                            <Row className="g-4">
                                <Col md={6}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '16px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '12px',
                                        transition: 'transform 0.2s',
                                        cursor: 'default'
                                    }}
                                         onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                         onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            backgroundColor: '#1D7B74',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '16px'
                                        }}>
                                            <PersonFill size={24} color="white" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '4px' }}>
                                                Nombre
                                            </div>
                                            <div style={{ fontSize: '1rem', fontWeight: '500', color: '#212529' }}>
                                                {userData.name}
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '16px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '12px',
                                        transition: 'transform 0.2s',
                                        cursor: 'default'
                                    }}
                                         onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                         onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            backgroundColor: '#1D7B74',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '16px'
                                        }}>
                                            <PersonFill size={24} color="white" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '4px' }}>
                                                Apellido
                                            </div>
                                            <div style={{ fontSize: '1rem', fontWeight: '500', color: '#212529' }}>
                                                {userData.surname}
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                                <Col md={isAdmin ? 12 : 6}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '16px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '12px',
                                        transition: 'transform 0.2s',
                                        cursor: 'default'
                                    }}
                                         onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                         onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            backgroundColor: '#1D7B74',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '16px'
                                        }}>
                                            <Envelope size={24} color="white" />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '4px' }}>
                                                Email
                                            </div>
                                            <div style={{
                                                fontSize: '1rem',
                                                fontWeight: '500',
                                                color: '#212529',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {userData.email}
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                                {!isAdmin && userData.phone && (
                                    <Col md={6}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '16px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '12px',
                                            transition: 'transform 0.2s',
                                            cursor: 'default'
                                        }}
                                             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            <div style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '12px',
                                                backgroundColor: '#1D7B74',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '16px'
                                            }}>
                                                <Phone size={24} color="white" />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '4px' }}>
                                                    Teléfono
                                                </div>
                                                <div style={{ fontSize: '1rem', fontWeight: '500', color: '#212529' }}>
                                                    {userData.phone}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                )}
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Seguridad */}
                    <Card style={{
                        border: 'none',
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #F2C94C 0%, #F2B94C 100%)',
                            padding: '20px 24px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            <h5 className="mb-0" style={{ fontWeight: '600', color: '#1D7B74' }}>
                                <Lock size={22} className="me-2" />
                                Seguridad
                            </h5>
                            <Button
                                variant={showPasswordForm ? "outline-dark" : "dark"}
                                size="sm"
                                onClick={() => {
                                    setShowPasswordForm(!showPasswordForm);
                                    setMessage({ type: '', text: '' });
                                }}
                                style={{
                                    borderRadius: '8px',
                                    padding: '8px 20px',
                                    fontWeight: '500',
                                    border: showPasswordForm ? '2px solid #1D7B74' : 'none',
                                    backgroundColor: showPasswordForm ? 'transparent' : '#1D7B74',
                                    color: showPasswordForm ? '#1D7B74' : 'white'
                                }}
                            >
                                {showPasswordForm ? 'Cancelar' : 'Cambiar Contraseña'}
                            </Button>
                        </div>
                        <Card.Body style={{ padding: '32px' }}>
                            {!showPasswordForm ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '40px 20px',
                                    color: '#6c757d'
                                }}>
                                    <Lock size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                                    <p className="mb-0" style={{ fontSize: '1rem' }}>
                                        Tu contraseña está protegida. Haz clic en "Cambiar Contraseña" para actualizarla.
                                    </p>
                                </div>
                            ) : (
                                <Form onSubmit={handleSubmitPassword}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ fontWeight: '500', color: '#495057' }}>
                                            Contraseña Actual
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            placeholder="Ingresa tu contraseña actual"
                                            style={{
                                                borderRadius: '10px',
                                                padding: '12px 16px',
                                                border: '2px solid #e9ecef',
                                                fontSize: '1rem'
                                            }}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ fontWeight: '500', color: '#495057' }}>
                                            Nueva Contraseña
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            placeholder="Mínimo 8 caracteres"
                                            minLength={6}
                                            style={{
                                                borderRadius: '10px',
                                                padding: '12px 16px',
                                                border: '2px solid #e9ecef',
                                                fontSize: '1rem'
                                            }}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label style={{ fontWeight: '500', color: '#495057' }}>
                                            Confirmar Nueva Contraseña
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            placeholder="Repite la nueva contraseña"
                                            style={{
                                                borderRadius: '10px',
                                                padding: '12px 16px',
                                                border: '2px solid #e9ecef',
                                                fontSize: '1rem'
                                            }}
                                        />
                                    </Form.Group>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            backgroundColor: '#F2C94C',
                                            borderColor: '#F2C94C',
                                            color: '#1D7B74',
                                            fontWeight: '600',
                                            padding: '12px 32px',
                                            borderRadius: '10px',
                                            fontSize: '1rem',
                                            width: '100%',
                                            border: 'none',
                                            boxShadow: '0 4px 8px rgba(242, 201, 76, 0.3)'
                                        }}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Guardando...
                                            </>
                                        ) : (
                                            'Guardar Nueva Contraseña'
                                        )}
                                    </Button>
                                </Form>
                            )}
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        </>
    );
};

export default MisDatos;