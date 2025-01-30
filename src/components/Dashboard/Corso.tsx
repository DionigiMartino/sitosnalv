import React, { useState } from "react";
import CourseList from "./ListaCorsi";
import CreateEditCourse from "./CreateCorso";

const CourseManager = () => {
  const [view, setView] = useState("list");
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Handlers gestiti internamente
  const handleNewCourse = () => {
    setView("create");
    setSelectedCourse(null);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setView("edit");
  };

  const handleBack = () => {
    setView("list");
    setSelectedCourse(null);
  };

  if (view === "list") {
    return (
      <CourseList
        onNewCourse={handleNewCourse}
        onEditCourse={handleEditCourse}
      />
    );
  }

  return (
    <CreateEditCourse existingCourse={selectedCourse} onBack={handleBack} />
  );
};

export default CourseManager;
