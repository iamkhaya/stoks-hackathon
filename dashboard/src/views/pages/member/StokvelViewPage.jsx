import React from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CListGroup,
  CListGroupItem,
  CBadge,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from "@coreui/react";
import { Link } from "react-router-dom";

// Function to return color based on trust score
const getTrustScoreColor = (trustScore) => {
  if (trustScore === "High") return "success";
  if (trustScore === "Medium") return "warning";
  return "danger"; // Low trust score
};

const StokvelViewPage = () => {
  // Dummy data for demonstration

  const currentUser = {
    id: 1,
    name: "John Doe",
    role: "Admin", // Change to 'Member' for non-admin users
  };

  const stokvel = {
    name: "Savings Club",
    currentRecipient: "John Doe",
    payoutDate: "2024-11-01",
    paymentRoster: [
      { member: "Jane Smith", month: "December 2024" },
      { member: "Alice Johnson", month: "January 2025" },
    ],
    members: [
      {
        id: 1,
        name: "John Doe",
        role: "Admin",
        trustScore: "High",
        totalReceived: 1000,
        totalPaidOut: 500,
      },
      {
        id: 2,
        name: "Jane Smith",
        role: "Member",
        trustScore: "Medium",
        totalReceived: 1000,
        totalPaidOut: 500,
      },
      {
        id: 3,
        name: "Alice Johnson",
        role: "Member",
        trustScore: "Low",
        totalReceived: 1000,
        totalPaidOut: 500,
      },
    ],
    contributions: {
      upcoming: [
        { id: 1, date: "2024-12-01", amount: 100 },
        { id: 2, date: "2025-01-01", amount: 100 },
      ],
      past: [
        { id: 1, date: "2024-10-01", amount: 100 },
        { id: 2, date: "2024-09-01", amount: 100 },
      ],
    },
  };

  const handleInitiatePayment = async (e) => {
    try {
      e.preventDefault();

      const apiUrl = "http://localhost:3000/api/initiate-payment";
      const postData = {
        walletAddress: stokvel.currentRecipient,
        amount: 10,
        currency: "USD",
        description: `Payout for ${stokvel.name} Stokvel`,
      };
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      // Check if the response is ok (status code 2xx)
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Parse the JSON response
      const data = await response.json();

      // Extract walletId and quoteId from the response and store them in localStorage

      const finalizedOutgoingPaymentGrantAccessTokenValue =
        data.outgoingPaymentGrant.continue.access_token.value;
      const quoteId = data.quote.id;
      const finalizedOutgoingPaymentGrantContinueUri =
        data.outgoingPaymentGrant.continue.uri;

      if (
        !finalizedOutgoingPaymentGrantAccessTokenValue ||
        !finalizedOutgoingPaymentGrantContinueUri ||
        !quoteId
      ) {
        throw new Error(
          "Error: Missing required fields (walletId, quoteId, or redirect) in the response."
        );
      }

      localStorage.setItem(
        "finalizedOutgoingPaymentGrantAccessTokenValue",
        finalizedOutgoingPaymentGrantAccessTokenValue
      );
      localStorage.setItem(
        "finalizedOutgoingPaymentGrantContinueUri",
        finalizedOutgoingPaymentGrantContinueUri
      );
      localStorage.setItem("quoteId", quoteId);

      // Assuming the response contains a redirect URL field
      const redirectUrl = data.redirect;
      if (!redirectUrl) {
        throw new Error("Error: No redirect URL found in the response");
      }

      // Redirect the user to the payment URL
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Failed to initiate payment:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    try {
      // Retrieve the stored walletId and quoteId from localStorage
      const finalizedOutgoingPaymentGrantAccessTokenValue =
        localStorage.getItem("finalizedOutgoingPaymentGrantAccessTokenValue");
      const quoteId = localStorage.getItem("quoteId");

      const finalizedOutgoingPaymentGrantContinueUri = localStorage.getItem(
        "finalizedOutgoingPaymentGrantContinueUri"
      );

      if (
        !finalizedOutgoingPaymentGrantContinueUri ||
        !quoteId ||
        !finalizedOutgoingPaymentGrantAccessTokenValue
      ) {
        throw new Error("Error: Missing vars localStorage.");
      }

      const apiUrl = "http://localhost:3000/api/complete-payment";
      const postData = {
        continueAccessToken: finalizedOutgoingPaymentGrantAccessTokenValue,
        outgoingPaymentGrantContinueUri:finalizedOutgoingPaymentGrantContinueUri,
        quoteID: quoteId,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      // Check if the response is ok (status code 2xx)
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Payment completed successfully:", data);

      alert("Payment completed successfully!");

      // Optionally clear the stored variables after payment confirmation
      localStorage.removeItem("walletId");
      localStorage.removeItem("quoteId");
    } catch (error) {
      console.error("Failed to complete payment:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <CContainer className="mt-4">
      <h2>{stokvel.name} Stokvel</h2>

      {/* Current Recipient and Payout Info */}
      <CCard className="my-4">
        <CCardHeader>
          <h4>Current Payout Information</h4>
        </CCardHeader>
        <CCardBody>
          <p>
            <strong>Current Recipient:</strong> {stokvel.currentRecipient}
          </p>
          <p>
            <strong>Next Payout Date:</strong> {stokvel.payoutDate}
          </p>
        </CCardBody>
      </CCard>

      {/* Members Section */}
      {currentUser.role === "Admin" && (
        <div className="d-flex justify-content-between align-items-center my-4">
          <h4>Members</h4>
          <CButton color="primary">Invite Member</CButton>
        </div>
      )}
      {/* Members Section */}
      <CRow className="my-4">
        {stokvel.members.map((member) => (
          <CCol md={4} key={member.id} className="mb-4">
            <CCard>
              <CCardHeader>
                <h5>{member.name}</h5>
                <CBadge color={member.role === "Admin" ? "info" : "secondary"}>
                  {member.role}
                </CBadge>
              </CCardHeader>
              <CCardBody>
                {/* Total Received */}
                <p>
                  <strong>Total Received:</strong> ${member.totalReceived}
                </p>
                {/* Total Paid Out */}
                <p>
                  <strong>Total Paid Out:</strong> ${member.totalPaidOut}
                </p>
                {/* Trust Score with color coding */}
                <p>
                  <strong>Trust Score:</strong>
                  <CBadge color={getTrustScoreColor(member.trustScore)}>
                    {member.trustScore}
                  </CBadge>
                </p>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      {/* Payment Roster Section */}
      <CCard className="my-4">
        <CCardHeader>
          <h4>Payment Roster</h4>
        </CCardHeader>
        <CCardBody>
          <CTable hover>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Member</CTableHeaderCell>
                <CTableHeaderCell>Month</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {stokvel.paymentRoster.map((roster, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{roster.member}</CTableDataCell>
                  <CTableDataCell>{roster.month}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Contributions Section */}
      <CRow className="my-4">
        {/* Upcoming Contributions */}
        <CCol md={6}>
          <CCard>
            <CCardHeader>
              <h4>Upcoming Contributions</h4>
            </CCardHeader>
            <CCardBody>
              <CTable hover>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Recipient</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {stokvel.contributions.upcoming.map((contribution, index) => (
                    <CTableRow key={contribution.id}>
                      <CTableDataCell>{contribution.date}</CTableDataCell>
                      <CTableDataCell>${contribution.amount}</CTableDataCell>
                      {/* Display the recipient from the payment roster */}
                      <CTableDataCell>
                        {stokvel.paymentRoster[index].member}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="success"
                          size="sm"
                          onClick={(e) => handleInitiatePayment(e)}
                        >
                          Initiate Payment
                        </CButton>

                        <CButton
                          color="success"
                          size="sm"
                          onClick={(e) => handleConfirmPayment(e)}
                        >
                          Confirm Payment
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Past Contributions */}
        <CCol md={6}>
          <CCard>
            <CCardHeader>
              <h4>Past Contributions</h4>
            </CCardHeader>
            <CCardBody>
              <CTable hover>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {stokvel.contributions.past.map((contribution) => (
                    <CTableRow key={contribution.id}>
                      <CTableDataCell>{contribution.date}</CTableDataCell>
                      <CTableDataCell>${contribution.amount}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <Link to="/member-dashboard">
        <CButton color="primary" className="mt-4">
          Back to Stokvels
        </CButton>
      </Link>
    </CContainer>
  );
};

export default StokvelViewPage;
