import api from "./api";

export const STORAGE_KEYS = {
  ASSESSMENT_ID: "currentAssessmentId",
  TIME_REMAINING: "timeRemaining",
  USER_TOKEN: "userVerificationToken",
  CANDIDATE_ID: "candidateId",
};

export const getUserInfoId = () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return userInfo?._id || null;
  } catch (error) {
    console.error("Failed to retrieve user info _id:", error);
    return null;
  }
};

export const saveAssessmentData = (data) => {
  if (data.assessment?._id) {
    localStorage.setItem(STORAGE_KEYS.ASSESSMENT_ID, data.assessment._id);
  }
  if (data.timeRemaining) {
    localStorage.setItem(STORAGE_KEYS.TIME_REMAINING, data.timeRemaining);
  }
};

export const clearAssessmentData = () => {
  localStorage.removeItem(STORAGE_KEYS.ASSESSMENT_ID);
  localStorage.removeItem(STORAGE_KEYS.TIME_REMAINING);
  localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
};

export const verifyAssessment = async (assessmentId) => {
  try {
    const response = await fetch(`${api}/assessment/${assessmentId}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    return {
      success: response.ok,
      data: data,
      message: data.message || "Assessment verification failed",
    };
  } catch (error) {
    console.error("Assessment verification error:", error);
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
};

export const getStoredAssessmentData = () => {
  return {
    assessmentId: localStorage.getItem(STORAGE_KEYS.ASSESSMENT_ID),
    timeRemaining: parseInt(
      localStorage.getItem(STORAGE_KEYS.TIME_REMAINING) || "30",
      10
    ),
  };
};

export const storeCandidateData = (data) => {
  if (data.candidateId) {
    localStorage.setItem(STORAGE_KEYS.CANDIDATE_ID, data.candidateId);
  }
};

export const getCandidateData = () => {
  return localStorage.getItem(STORAGE_KEYS.CANDIDATE_ID);
};

export const clearCandidateData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CANDIDATE_ID);
  } catch (error) {
    console.error("Failed to clear candidate data", error);
  }
};

export const validateMagicLink = async (token) => {
  try {
    const response = await fetch(`${api}/auth/verify/${token}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();
    console.log(data);

    if (response.ok && data.status === "success") {
      console.log(data);
      saveAssessmentData(data);
      storeCandidateData(data);
      return {
        success: true,
        timeRemaining: data.timeRemaining,
        assessmentId: data.assessment?._id,
        candidate: data.candidateId,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.message || "Verification failed",
      };
    }
  } catch (error) {
    console.error("Magic link validation error:", error);
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
};
