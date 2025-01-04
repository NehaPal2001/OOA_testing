import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/common/ui/card";
import api from "@/lib/api";

const Instructions = ({ assessmentId }) => {
  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const response = await fetch(
          `${api}/assessment/${assessmentId}/instructions`
        );
        const data = await response.json();

        const bulletPoints = data.instructions
          .split(".")
          .map((sentence) => sentence.trim())
          .filter((sentence) => sentence.length > 0);

        setInstructions(bulletPoints);
      } catch (error) {
        console.error("Error fetching instructions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructions();
  }, [assessmentId]);

  if (loading) {
    return <div>Loading instructions...</div>;
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Instructions</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-6 space-y-2">
          {instructions.map((instruction, index) => (
            <li key={index} className="text-gray-700">
              {instruction}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default Instructions;

