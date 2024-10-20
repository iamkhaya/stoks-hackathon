import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import velfundImage from './velfund.png'; 

const MemberLogin = () => {
  const navigate = useNavigate(); // Get the navigation function from useNavigate

  const handleLogin = () => {
    // Perform login logic here (e.g., form validation, API call, etc.)

    // If login is successful, navigate to the member landing page
    navigate("/member-dashboard");
  };
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
   <CContainer>
  <CRow className="justify-content-center">
    <CCol md={8}>
      <CCardGroup>
        {/* Login Card */}
        <CCard className="p-4" style={{ margin: '0' }}> {/* No extra margin for the login card */}
          <CCardBody>
            <CForm>
              <h1>Login</h1>
              <p className="text-body-secondary">Sign In to your account</p>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput placeholder="Username" autoComplete="username" />
              </CInputGroup>
              <CInputGroup className="mb-4">
                <CInputGroupText>
                  <CIcon icon={cilLockLocked} />
                </CInputGroupText>
                <CFormInput
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                />
              </CInputGroup>
              <CRow>
                <CCol xs={6}>
                  <CButton
                    color="black"
                    className="px-4"
                    onClick={handleLogin}
                  >
                    Login
                  </CButton>
                </CCol>
                <CCol xs={6} className="text-right">
                  <CButton color="link" className="px-0">
                    Forgot password?
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>

        {/* Image Card with 2cm extra margin */}
        <CCard
          className="text-white"
          style={{ width: "60%",}}>
            <CCardBody 
                className="text-center p-0" 
                style={{ 
                  backgroundImage: `url(${velfundImage})`, 
                  backgroundSize: '90%',  /* Resizes the image to 90% of the card size */
                  backgroundPosition: 'center', 
                  backgroundRepeat: 'no-repeat' /* Prevents repeating the background image */ 
                }}
            >
            <div className="overlay">
              <h2>Sign up</h2>
              <Link to="/register">
              </Link>
            </div>
          </CCardBody>
        </CCard>
      </CCardGroup>
    </CCol>
  </CRow>
</CContainer>

    </div>
  );
};

export default MemberLogin;
