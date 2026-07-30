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
  username: '',
  email: '',
  password: '',
};

function RegisterModal({ showRegister, handleClose }) {
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
    handleClose('register');
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
      await loginReg('register', formState);
      setFormState(initialFormState);
      setValidated(false);
      handleClose('register');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal show={showRegister} onHide={() => handleClose('register')}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username:</Form.Label>
            <Form.Control
              type="text"
              value={formState.username}
              onChange={handleChange}
              required
              minLength={2}
            />
            <Form.Control.Feedback type="invalid">
              Username must contain at least two characters.
            </Form.Control.Feedback>
            {errors?.username && (
              <Form.Text className="text-warning">
                {errors.username.message}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              value={formState.email}
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Enter a valid email address.
            </Form.Control.Feedback>
            {errors?.email && (
              <Form.Text className="text-warning">
                {errors.email.message}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              value={formState.password}
              onChange={handleChange}
              required
              minLength={8}
              pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}"
            />
            <Form.Control.Feedback type="invalid">
              Use at least 8 characters with uppercase, lowercase, and a number.
            </Form.Control.Feedback>
            {errors?.password && (
              <Form.Text className="text-warning">
                {errors.password.message}
              </Form.Text>
            )}
          </Form.Group>
          {generalError && (
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
            {isLoading ? 'Registering…' : 'Register'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default RegisterModal;
