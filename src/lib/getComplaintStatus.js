export async function getComplaintStatus(complaintId) {
    const API_URL = `https://api.example.com/complaints/${complaintId}`;
  
    try {
      const res = await fetch(API_URL, { cache: "no-store" });
  
      if (!res.ok) {
        console.warn("API returned non-200 response. Using dummy data.");
        return {
          id: complaintId,
          status: "New",
        };
      }
  
      const data = await res.json();
      return data;
  
    } catch (error) {
      console.error("API Error:", error);
  
       return {
        id: complaintId,
        status: "In-Progress",
      };
    }
  }
  