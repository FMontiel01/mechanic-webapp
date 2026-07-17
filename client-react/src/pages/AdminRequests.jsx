import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "../utils/firebase";

function normalizeStatus(status) {
  const normalizedStatus = String(status || "")
    .trim()
    .toLowerCase()
    .replaceAll("-", " ");

  if (normalizedStatus === "in progress") {
    return "In Progress";
  }

  if (normalizedStatus === "completed") {
    return "Completed";
  }

  if (normalizedStatus === "cancelled") {
    return "Cancelled";
  }

  return "Pending";
}

function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const requestsQuery = query(
      collection(db, "serviceRequests"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      requestsQuery,
      (snapshot) => {
        const loadedRequests = snapshot.docs.map((requestDocument) => {
          const requestData = requestDocument.data();

          return {
            id: requestDocument.id,
            ...requestData,
            status: normalizeStatus(requestData.status),
          };
        });

        setRequests(loadedRequests);
        setIsLoading(false);
        setLoadError("");
      },
      (error) => {
        console.error("Unable to load requests:", error);
        setLoadError("Unable to load service requests.");
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, []);

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

  async function handleStatusChange(requestId, newStatus) {
    try {
      const requestReference = doc(db, "serviceRequests", requestId);

      await updateDoc(requestReference, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Unable to update request:", error);
      window.alert("Unable to update the request status.");
    }
  }

  async function handleDelete(requestId, customerName) {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete the request from ${customerName}?`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteDoc(doc(db, "serviceRequests", requestId));
    } catch (error) {
      console.error("Unable to delete request:", error);
      window.alert("Unable to delete the service request.");
    }
  }

  function formatSubmittedDate(dateValue) {
    if (!dateValue) {
      return "Not available";
    }

    const date =
      typeof dateValue.toDate === "function"
        ? dateValue.toDate()
        : new Date(dateValue);

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

        {isLoading ? (
          <div className="empty-requests">
            <h2>Loading service requests...</h2>
          </div>
        ) : loadError ? (
          <div className="empty-requests">
            <h2>Unable to load requests</h2>
            <p>{loadError}</p>
          </div>
        ) : filteredRequests.length === 0 ? (
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