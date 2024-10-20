import React from "react";
import { Link } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CCardText,
} from "@coreui/react";
import DefaultLayout from "../../../layout/DefaultLayout";

const MemberDashboardPage = ({ stoks }) => {
  const stokvels = [
    {
      id: 1,
      name: "Community Stokvel",
      isAdmin: true,
      memberCount: 12,
      nextMeetingDate: "2024-11-01",
    },
    {
      id: 2,
      name: "Savings Club",
      isAdmin: false,
      memberCount: 8,
      nextMeetingDate: "2024-10-25",
    },
    {
      id: 3,
      name: "Investment Group",
      isAdmin: false,
      memberCount: 15,
      nextMeetingDate: null,
    },
  ];

  return (
    // <DefaultLayout>
    <CContainer>
      <h1 className="my-4">Your Stokvels</h1>
      <CRow className="g-4">
        {stokvels.map((stokvel) => (
          <CCol md={4} key={stokvel.id}>
            <CCard className="shadow-sm">
              <CCardHeader>
                <h5>{stokvel.name}</h5>
              </CCardHeader>
              <CCardBody>
                <CCardText>
                  <strong>Role: </strong>
                  {stokvel.isAdmin ? (
                    <span className="badge text-bg-dark">Admin</span>
                  ) : (
                    <span className="badge text-bg-secondary">Member</span>
                  )}
                </CCardText>
                <CCardText>
                  <strong>Total Members: </strong> {stokvel.memberCount}
                </CCardText>
                <CCardText>
                  <strong>Next Meeting: </strong>{" "}
                  {stokvel.nextMeetingDate || "Not scheduled"}
                </CCardText>
              </CCardBody>
              <CCardFooter>
                <Link to={`/stokvel/${stokvel.id}`}>
                 <CButton color="dark" size="sm" className="me-2"> View </CButton>
                </Link>
                <CButton color="danger" size="sm">
                  Leave Stokvel
                </CButton>
              </CCardFooter>
            </CCard>
          </CCol>
        ))}
      </CRow>
    </CContainer>
    // </DefaultLayout>
  );
};

export default MemberDashboardPage;
