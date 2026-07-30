/* react */
import { useState } from 'react';

/* react bootstrap */
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

/* local */
import useLoginReg from './hooks/useLoginReg';

/* variables */
const initialFormState = {
  email: '',
  password: '',
};

function LoginModal({ showLogin, handleClose }) {
  const [formState, setFormState] = useState(initialFormState);
  const [validated, setValidated] = useState(false);
  const { loginReg, errors, generalError, isLoading } = useLoginReg();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormState((prev) => ({ ...prev, [id]: value }));
  };

  const handleCancel = () => {
    setFormState(initialFormState);
    setValidated(false);
    handleClose('login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    try {
      await loginReg('login', formState);
      setFormState(initialFormState);
      setValidated(false);
      handleClose('login');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal show={showLogin} onHide={() => handleClose('login')}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errors?.credentials && (
            <div className="bg-dark p-2 mb-2 text-warning">
              <small className="">{errors.credentials.message}</small>
            </div>
          )}
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email or username:</Form.Label>
            <Form.Control
              type="text"
              value={formState.email}
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Enter your email address or username.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              value={formState.password}
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Enter your password.
            </Form.Control.Feedback>
          </Form.Group>
          {generalError && !errors?.credentials && (
            <div className="alert alert-danger py-2" role="alert">
              {generalError}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={isLoading}>
            {isLoading ? 'Logging in…' : 'Login'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default LoginModal;
