import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, FileVideo, Trash2 } from "lucide-react";

const LessonForm = React.memo(({ lesson, index, onLessonChange, onDelete }: any) => {
  // Stato locale per la lezione
  const [localLesson, setLocalLesson] = useState(lesson);

  // Aggiorna il componente padre quando lo stato locale cambia
  useEffect(() => {
    const timer = setTimeout(() => {
      if (JSON.stringify(lesson) !== JSON.stringify(localLesson)) {
        if (lesson.title !== localLesson.title) {
          onLessonChange(lesson.id, "title", localLesson.title);
        }
        if (lesson.description !== localLesson.description) {
          onLessonChange(lesson.id, "description", localLesson.description);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [localLesson, lesson, onLessonChange]);

  // Update local state when parent props change
  useEffect(() => {
    setLocalLesson(lesson);
  }, [lesson]);

  const handleLocalChange = (field, value) => {
    setLocalLesson((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (field, files) => {
    if (field === "video") {
      const file = files[0];
      if (file?.type.startsWith("video/")) {
        onLessonChange(lesson.id, "video", {
          file,
          title: "",
          filename: file.name,
        });
      } else {
        alert("Per favore, carica solo file video");
      }
    } else {
      const newFiles = Array.from(files).map((file) => ({
        file,
          title: "",
        // @ts-ignore
        filename: file.name,
      }));
      onLessonChange(lesson.id, "files", [
        ...(lesson.files || []),
        ...newFiles,
      ]);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-sm">
            {index + 1}
          </span>
          Lezione {index + 1}
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onDelete(lesson.id)}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor={`lesson-title-${lesson.id}`}>
            Titolo della lezione
          </Label>
          <Input
            id={`lesson-title-${lesson.id}`}
            value={localLesson.title}
            onChange={(e) => handleLocalChange("title", e.target.value)}
            placeholder="Inserisci il titolo della lezione"
          />
        </div>

        <div>
          <Label htmlFor={`lesson-description-${lesson.id}`}>
            Descrizione della lezione
          </Label>
          <Textarea
            id={`lesson-description-${lesson.id}`}
            value={localLesson.description}
            onChange={(e) => handleLocalChange("description", e.target.value)}
            placeholder="Inserisci una descrizione della lezione"
            rows={3}
          />
        </div>

        {/* Video upload section */}
        <div>
          <Label>Video della lezione</Label>
          <div
            className={`
              border-2 border-dashed rounded-lg p-6 
              ${
                lesson.video
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300"
              }
              transition-colors duration-200 text-center
            `}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileUpload("video", e.dataTransfer.files);
            }}
          >
            {lesson.video ? (
              <div className="flex items-center justify-center gap-4">
                <FileVideo className="h-8 w-8 text-purple-500" />
                <div className="flex-1">
                  <Input
                    placeholder="Titolo del video"
                    value={lesson.video.title || ""}
                    onChange={(e) =>
                      onLessonChange(lesson.id, "video", {
                        ...lesson.video,
                        title: e.target.value,
                      })
                    }
                    className="mb-2"
                  />
                  <p className="text-sm text-gray-500">
                    {lesson.video.filename}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onLessonChange(lesson.id, "video", null)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <FileVideo className="h-8 w-8 text-gray-400 mx-auto" />
                <div className="text-center">
                  <label className="text-purple-500 hover:text-purple-700 cursor-pointer">
                    Carica video
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload("video", e.target.files)
                      }
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    MP4, WebM, MOV (max 500MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Files upload section */}
        <div>
          <Label>Materiali della lezione</Label>
          <div
            className={`
              border-2 border-dashed rounded-lg p-6 
              ${
                lesson.files?.length > 0
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300"
              }
              transition-colors duration-200
            `}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileUpload("files", e.dataTransfer.files);
            }}
          >
            <div className="space-y-4">
              {lesson.files?.length > 0 && (
                <div className="space-y-2">
                  {lesson.files.map((file, fileIndex) => (
                    <div
                      key={fileIndex}
                      className="flex items-center gap-2 bg-white p-2 rounded-lg"
                    >
                      <FileText className="h-4 w-4 text-red-500" />
                      <Input
                        placeholder="Titolo del file"
                        value={file.title}
                        onChange={(e) => {
                          const newFiles = [...lesson.files];
                          newFiles[fileIndex] = {
                            ...file,
                            title: e.target.value,
                          };
                          onLessonChange(lesson.id, "files", newFiles);
                        }}
                      />
                      <p className="text-xs text-gray-500 truncate">
                        {file.filename}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newFiles = lesson.files.filter(
                            (_, i) => i !== fileIndex
                          );
                          onLessonChange(lesson.id, "files", newFiles);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-center">
                <label className="text-purple-500 hover:text-purple-700 cursor-pointer">
                  {lesson.files?.length > 0
                    ? "Carica altri materiali"
                    : "Carica materiali"}
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload("files", e.target.files)}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOCX, XLSX (max 10MB per file)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
});

LessonForm.displayName = "LessonForm";

export default LessonForm;
