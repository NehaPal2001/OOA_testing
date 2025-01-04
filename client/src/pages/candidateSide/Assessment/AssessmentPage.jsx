import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/ui/card";
import ProctorWindow from "../ProctorWindow";
import AssessmentContent from "./AssessmentContent/AssessmentContent";
import { useAssessment } from "@/hooks/useAssessment";
// import Timer from "../Other/timer";
// import Instructions from "../Other/Instructions";

const AssessmentPage = () => {
  const { assessmentId } = useParams();
  // const [duration, setDuration] = useState(null);
  const {
    assessment,
    questions,
    currentIndex,
    showSubmitScreen,
    proctorStatus,
    errorMessage,
    candidateData,
    isLoading,
    responses,
    isSubmitting,
    roomDetails,
    setProctorStatus,
    setCurrentIndex,
    setShowSubmitScreen,
    handleAnswerSave,
    submitAssessment,
  } = useAssessment(assessmentId);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-6xl flex gap-4">
        {/* {duration && <Timer durationInMinutes={duration} />} */}
        {/* <Instructions assessmentId={assessmentId} /> */}
        <Card>
          <CardHeader>
            <CardTitle>
              {assessment ? assessment.title : "Assessment"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AssessmentContent
              isLoading={isLoading}
              proctorStatus={proctorStatus}
              errorMessage={errorMessage}
              assessment={assessment}
              questions={questions}
              showSubmitScreen={showSubmitScreen}
              currentIndex={currentIndex}
              responses={responses}
              isSubmitting={isSubmitting}
              onSubmit={submitAssessment}
              onAnswerSave={handleAnswerSave}
              setShowSubmitScreen={setShowSubmitScreen}
              setCurrentIndex={setCurrentIndex}
            />
          </CardContent>
        </Card>
        <Card className="w-1/3">
          <CardHeader>
            <CardTitle>Proctoring</CardTitle>
          </CardHeader>
          <CardContent>
            <ProctorWindow
              candidateId={candidateData?.candidateId}
              assessmentId={candidateData?.assessmentId}
              roomId={roomDetails?.roomId}
              onProctorStatusChange={setProctorStatus}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentPage;
