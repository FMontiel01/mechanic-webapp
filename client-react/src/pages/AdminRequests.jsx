import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import { auth } from "../utils/firebase";

import {
  getRequests,
  updateRequestStatus,
  deleteRequest,
} from "../utils/requestStorage";


function AdminRequests() {
  const [requests, setRequests] = useState(() => getRequests());
  const [statusFilter, setStatusFilter] = useState("All");

  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
  setIsLoggingOut(true);

    try {
      await signOut(auth);
      navigate("/admin-login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      window.alert("Unable to log out. Please try again.");
      setIsLoggingOut(false);
    }
  }

  const filteredRequests =
    statusFilter === "All"
      ? requests
      : requests.filter((request) => request.status === statusFilter);

  const pendingCount = requests.filter(
    (request) => request.status === "Pending"
  ).length;

  const inProgressCount = requests.filter(
    (request) => request.status === "In Progress"
  ).length;

  const completedCount = requests.filter(
    (request) => request.status === "Completed"
  ).length;

  function handleStatusChange(requestId, newStatus) {
    const updatedRequests = updateRequestStatus(
      requestId,
      newStatus
    );

    setRequests(updatedRequests);
  }

  function handleDelete(requestId, customerName) {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete the request from ${customerName}?`
    );

    if (!shouldDelete) {
      return;
    }

    const updatedRequests = deleteRequest(requestId);

    setRequests(updatedRequests);
  }

  function formatSubmittedDate(dateString) {
    if (!dateString) {
      return "Not available";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Not available";
    }

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function formatPreferredDate(dateString) {
    if (!dateString) {
      return "Not provided";
    }

    const [year, month, day] = dateString.split("-");

    if (!year || !month || !day) {
      return dateString;
    }

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    ).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatValue(value) {
    if (!value) {
      return "Not provided";
    }

    return String(value)
      .replaceAll("-", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  return (
    <main className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <p className="admin-tagline">Mechanic Dashboard</p>
            <h1>Service Requests</h1>

            <p>
              Review customer requests, update their status, and remove requests
              that are no longer needed.
            </p>
          </div>

          <div className="admin-header-actions">
            <div className="request-total">
              <span>{requests.length}</span>
              <p>Total Requests</p>
            </div>

            <button
              type="button"
              className="admin-logout-button"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging Out..." : "Log Out"}
            </button>
          </div>
        </div>

        <div className="admin-summary">
          <div className="summary-card">
            <span className="summary-number">{pendingCount}</span>
            <p>Pending</p>
          </div>

          <div className="summary-card">
            <span className="summary-number">{inProgressCount}</span>
            <p>In Progress</p>
          </div>

          <div className="summary-card">
            <span className="summary-number">{completedCount}</span>
            <p>Completed</p>
          </div>
        </div>

        <div className="request-toolbar">
          <label htmlFor="statusFilter">Filter by Status</label>

          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All Requests</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="empty-requests">
            <h2>No service requests found</h2>

            <p>
              New requests submitted through the booking form will appear here.
            </p>
          </div>
        ) : (
          <div className="request-list">
            {filteredRequests.map((request) => (
              <article className="request-card" key={request.id}>
                <div className="request-card-header">
                  <div>
                    <h2>{request.fullName || "Unknown Customer"}</h2>

                    <p>Submitted {formatSubmittedDate(request.createdAt)}</p>
                  </div>

                  <span
                    className={`status-badge status-${request.status
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    {request.status}
                  </span>
                </div>

                <div className="request-details-grid">
                  <div className="request-detail-section">
                    <h3>Contact Information</h3>

                    <dl>
                      <div>
                        <dt>Phone</dt>
                        <dd>{request.phone || "Not provided"}</dd>
                      </div>

                      <div>
                        <dt>Email</dt>
                        <dd>{request.email || "Not provided"}</dd>
                      </div>

                      <div>
                        <dt>Preferred Contact</dt>
                        <dd>{formatValue(request.preferredContact)}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="request-detail-section">
                    <h3>Vehicle Information</h3>

                    <dl>
                      <div>
                        <dt>Vehicle</dt>
                        <dd>
                          {request.vehicleYear || ""}{" "}
                          {request.vehicleMake || ""}{" "}
                          {request.vehicleModel || ""}
                        </dd>
                      </div>

                      <div>
                        <dt>Vehicle Starts</dt>
                        <dd>{formatValue(request.vehicleStarts)}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="request-detail-section">
                    <h3>Service Information</h3>

                    <dl>
                      <div>
                        <dt>Service</dt>
                        <dd>{formatValue(request.serviceType)}</dd>
                      </div>

                      <div>
                        <dt>Urgency</dt>
                        <dd>{formatValue(request.urgency)}</dd>
                      </div>

                      <div>
                        <dt>ZIP Code</dt>
                        <dd>{request.zipCode || "Not provided"}</dd>
                      </div>

                      <div>
                        <dt>Preferred Date</dt>
                        <dd>{formatPreferredDate(request.preferredDate)}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="problem-description">
                  <h3>Problem Description</h3>

                  <p>
                    {request.description ||
                      "No problem description was provided."}
                  </p>
                </div>

                <div className="request-actions">
                  <div className="status-control">
                    <label htmlFor={`status-${request.id}`}>
                      Update Status
                    </label>

                    <select
                      id={`status-${request.id}`}
                      value={request.status}
                      onChange={(event) =>
                        handleStatusChange(request.id, event.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>

                      <option value="In Progress">In Progress</option>

                      <option value="Completed">Completed</option>

                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    className="delete-request-btn"
                    onClick={() =>
                      handleDelete(
                        request.id,
                        request.fullName || "this customer",
                      )
                    }
                  >
                    Delete Request
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminRequests;