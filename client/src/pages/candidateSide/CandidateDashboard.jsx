import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/common/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/common/ui/alert";
import {
  Timer,
  FileQuestion,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  getStoredAssessmentData,
  verifyAssessment,
  storeCandidateData,
  clearAssessmentData,
  getCandidateData,
} from "@/lib/auth-utils";
import api from "@/lib/api";

const handleStartAssessment = async (assessmentId, candidateData) => {
  try {
    if (!assessmentId || !candidateData?.candidateId) {
      throw new Error("Assessment ID and Candidate ID are required");
    }

    const response = await fetch(`${api}/websocket/room/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assessmentId,
        candidateId: candidateData.candidateId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          `Failed to create/join room: ${response.statusText}`
      );
    }

    const roomData = await response.json();

    // Update candidate status to active
    await fetch(
      `${api}/websocket/room/${roomData.roomId}/candidate/${candidateData.candidateId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "active",
          actualStartTime: new Date(),
          attemptStatus: "IN_PROGRESS",
        }),
      }
    );

    return roomData;
  } catch (error) {
    console.error("Start assessment error:", error);
    throw error;
  }
};

const CandidateDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [timeRemaining, setTimeRemaining] = useState(
    location.state?.timeRemaining || 30
  );
  const [verificationStatus, setVerificationStatus] = useState("pending");
  const [candidateData, setCandidateData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [assessmentId, setAssessmentId] = useState(null);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        let storedAssessmentId = getStoredAssessmentData();
        const verificationResult = await verifyAssessment(
          storedAssessmentId.assessmentId
        );

        if (verificationResult.success) {
          const candidateId = getCandidateData();
          const assessmentId = verificationResult.data._id;

          if (!candidateId || !assessmentId) {
            throw new Error("Missing candidateId or assessmentId");
          }

          const candidateDataToStore = {
            candidateId,
            assessmentId,
          };

          storeCandidateData({ candidateId });
          setVerificationStatus("verified");
          setCandidateData(candidateDataToStore);
          setAssessmentId(assessmentId);
        } else {
          setVerificationStatus("error");
          setErrorMessage(verificationResult.message);
        }
      } catch (error) {
        setVerificationStatus("error");
        setErrorMessage("Verification failed");
      }
    };

    initializeDashboard();
  }, []);

  useEffect(() => {
    if (assessmentId && verificationStatus === "verified" && candidateData) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            handleAssessmentExpiry();
            return 0;
          }
          return prev - 1;
        });
      }, 60000); // Every minute

      return () => clearInterval(timer);
    }
  }, [assessmentId, verificationStatus, candidateData]);

  const handleAssessmentExpiry = () => {
    clearAssessmentData();
    alert("Assessment time has expired!");
    navigate("/");
  };

  const startAssessment = async () => {
    try {
      setIsStarting(true);
      setErrorMessage("");

      const roomData = await handleStartAssessment(assessmentId, candidateData);

      navigate(`/assessment/${assessmentId}`, {
        state: {
          roomId: roomData.roomId,
          timeRemaining,
          email: location.state?.email,
          fullName: location.state?.fullName,
        },
      });
    } catch (error) {
      console.error("Failed to start assessment:", error);
      setErrorMessage(error.message || "Failed to start assessment");
      setVerificationStatus("error");
    } finally {
      setIsStarting(false);
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case "pending":
        return (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
            <p>Verifying assessment access...</p>
          </div>
        );

      case "error":
        return (
          <Alert variant="destructive" className="w-full">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Verification Issue</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
            <div className="mt-4">
              <Button variant="outline" onClick={() => navigate("/")}>
                Return to Home
              </Button>
            </div>
          </Alert>
        );

      case "verified":
        return (
          <div className="space-y-4">
            <div className="flex items-center">
              <FileQuestion className="mr-3 h-6 w-6 text-blue-500" />
              <p>Assessment ID: {assessmentId}</p>
            </div>

            <div className="flex items-center">
              <CheckCircle className="mr-3 h-6 w-6 text-green-500" />
              <p>Status: Ready to Start</p>
            </div>

            <Button
              className="w-full mt-4"
              onClick={startAssessment}
              disabled={isStarting || verificationStatus !== "verified"}
            >
              {isStarting ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting...
                </div>
              ) : (
                "Start Assessment"
              )}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Assessment Dashboard</span>
            {verificationStatus === "verified" && (
              <div className="flex items-center text-sm text-gray-600">
                <Timer className="mr-2 h-5 w-5" />
                {timeRemaining} mins left
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </div>
  );
};

export default CandidateDashboard;
