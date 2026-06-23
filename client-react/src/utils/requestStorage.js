const STORAGE_KEY = "mechanicServiceRequests";

export function getRequests() {
  try {
    const savedRequests = localStorage.getItem(STORAGE_KEY);

    if (!savedRequests) {
      return [];
    }

    const parsedRequests = JSON.parse(savedRequests);

    return Array.isArray(parsedRequests) ? parsedRequests : [];
  } catch (error) {
    console.error("Could not load service requests:", error);
    return [];
  }
}

export function getRequestById(requestId) {
  const requests = getRequests();

  return requests.find((request) => request.id === requestId);
}

export function addRequest(requestData) {
  const requests = getRequests();

  const newRequest = {
    ...requestData,
    id: crypto.randomUUID(),
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  const updatedRequests = [newRequest, ...requests];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests));

  return newRequest;
}

export function updateRequestStatus(requestId, newStatus) {
  const requests = getRequests();

  const updatedRequests = requests.map((request) =>
    request.id === requestId
      ? {
          ...request,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        }
      : request
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests));

  return updatedRequests;
}

export function deleteRequest(requestId) {
  const requests = getRequests();

  const updatedRequests = requests.filter(
    (request) => request.id !== requestId
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests));

  return updatedRequests;
}