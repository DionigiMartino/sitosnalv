import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PlusCircle,
  Edit,
  Trash2,
  ChevronDown,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  query,
  getDoc,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { it } from "date-fns/locale";

const ProgressDialog = ({ isOpen, onClose, user, courses }: any) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Progressi Corsi - {user?.username}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 max-h-[60vh] overflow-y-auto">
          {courses.map((course) => {
            const courseProgress =
              user?.courseProgress?.[course.id]?.lessons || {};
            const completedLessons = Object.values(courseProgress).filter(
              // @ts-ignore
              (lesson) => lesson?.completed === true
            ).length;
            const totalLessons = course.lessons?.length || 0;

            return (
              <div key={course.id} className="space-y-4 border-b pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-lg">{course.title}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{
                          width: `${
                            totalLessons > 0
                              ? (completedLessons / totalLessons) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {completedLessons}/{totalLessons}
                    </span>
                  </div>
                </div>

                <div className="pl-4 space-y-2">
                  {course.lessons?.map((lesson) => {
                    const lessonProgress = courseProgress[lesson.id];
                    return (
                      <div key={lesson.id} className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            lessonProgress?.completed
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        />
                        <span className="text-sm">{lesson.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Chiudi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Users = () => {
  // State declarations
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedUser, setExpandedUser] = useState(null);
  const [courses, setCourses] = useState([]);

  // Form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Responsabile Sindacale");
  const [nome, setNome] = useState("");
  const [dataNascita, setDataNascita] = useState("");
  const [luogoNascita, setLuogoNascita] = useState("");
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [selectedUserProgress, setSelectedUserProgress] = useState(null);

  const roles = ["Responsabile Sindacale", "Amministratore", "Iscritto"];

  // Fetch courses from Firestore
  const fetchCourses = async () => {
    try {
      const coursesQuery = query(
        collection(db, "courses"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(coursesQuery);
      const coursesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return coursesData;
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i corsi",
        variant: "destructive",
      });
      return [];
    }
  };

  // Fetch users and their progress from Firestore
  const fetchUsers = async () => {
    try {
      const allCourses = await fetchCourses();
      setCourses(allCourses);

      const usersQuery = query(collection(db, "users"));
      const querySnapshot = await getDocs(usersQuery);

      const userData = await Promise.all(
        querySnapshot.docs.map(async (userDoc) => {
          const user = userDoc.data();
          const courseProgressData = {};

          // Fetch progress for each course
          for (const course of allCourses) {
            try {
              const progressRef = doc(
                db,
                "users",
                user.email, // Usiamo l'email dell'utente invece dell'ID del documento
                "courseProgress",
                course.id
              );
              const progressSnap = await getDoc(progressRef);

              if (progressSnap.exists()) {
                courseProgressData[course.id] = progressSnap.data();
              } else {
                courseProgressData[course.id] = { lessons: {} };
              }
            } catch (error) {
              console.error(
                `Error fetching progress for course ${course.id}:`,
                error
              );
              courseProgressData[course.id] = { lessons: {} };
            }
          }

          return {
            id: userDoc.id,
            ...user,
            courseProgress: courseProgressData,
            createdAt: user.createdAt?.toDate(),
          };
        })
      );

      setUsers(userData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare gli utenti",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = {
      username,
      password: "SN25FMR", // Default password
      email,
      role,
      nome,
      dataNascita,
      luogoNascita,
      updatedAt: serverTimestamp(),
      createdAt: selectedUser?.createdAt || serverTimestamp(),
    };

    try {
      if (selectedUser?.id) {
        const userRef = doc(db, "users", selectedUser.id);
        await updateDoc(userRef, data);
        toast({
          title: "Successo",
          description: "Utente aggiornato correttamente",
        });
      } else {
        await addDoc(collection(db, "users"), data);
        toast({
          title: "Successo",
          description: "Nuovo utente creato correttamente",
        });
      }

      await fetchUsers();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Error saving user:", error);
      toast({
        title: "Errore",
        description: "Errore durante il salvataggio dell'utente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setUsername("");
    setEmail("");
    setRole("Responsabile Sindacale");
    setNome("");
    setDataNascita("");
    setLuogoNascita("");
    setSelectedUser(null);
  };

  // Delete user handlers
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const deleteUser = async () => {
    if (!userToDelete) return;

    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "users", userToDelete.id));
      await fetchUsers();
      setShowDeleteDialog(false);
      setUserToDelete(null);
      toast({
        title: "Successo",
        description: "Utente eliminato correttamente",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Errore",
        description: "Errore durante l'eliminazione dell'utente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Export users to CSV
  const exportToCSV = () => {
    const csvData = users.map((user) => ({
      nome: user.nome,
      dataNascita: user.dataNascita,
      luogoNascita: user.luogoNascita,
      username: user.username,
      email: user.email,
      role: user.role,
    }));

    const csvString = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "utenti_piattaforma.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render course progress
  const renderCourseProgress = (user, course) => {
    const courseProgress = user.courseProgress?.[course.id]?.lessons || {};
    console.log("Course Progress for", user.email, course.id, courseProgress); // Debug log
    const completedLessons = Object.values(courseProgress).filter(
      // @ts-ignore
      (lesson) => lesson?.completed === true
    ).length;
    const totalLessons = course.lessons?.length || 0;

    return (
      <div key={course.id} className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium">{course.title}</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{
                  width: `${
                    totalLessons > 0
                      ? (completedLessons / totalLessons) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <span className="text-xs text-gray-600">
              {completedLessons}/{totalLessons}
            </span>
          </div>
        </div>

        {expandedUser === user.id && (
          <div className="pl-4 space-y-1 text-sm">
            {course.lessons?.map((lesson) => {
              const lessonProgress = courseProgress[lesson.id];
              return (
                <div key={lesson.id} className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      lessonProgress?.completed ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                  <span className="truncate">{lesson.title}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestione Utenti</CardTitle>
          <div className="flex gap-2">
            <Button onClick={exportToCSV} variant="outline">
              Scarica CSV
            </Button>
            <Button onClick={() => setShowForm(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nuovo Utente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Cerca per username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Data di nascita</TableHead>
                <TableHead>Luogo di nascita</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ruolo</TableHead>
                <TableHead>Progressi</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.nome}</TableCell>
                  <TableCell>{user.dataNascita}</TableCell>
                  <TableCell>{user.luogoNascita}</TableCell>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUserProgress(user);
                        setShowProgressDialog(true);
                      }}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Visualizza Progressi
                    </Button>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedUser(user);
                        setUsername(user.username);
                        setEmail(user.email);
                        setRole(user.role);
                        setNome(user.nome);
                        setDataNascita(user.dataNascita);
                        setLuogoNascita(user.luogoNascita);
                        setShowForm(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteClick(user)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ProgressDialog
        isOpen={showProgressDialog}
        onClose={() => {
          setShowProgressDialog(false);
          setSelectedUserProgress(null);
        }}
        user={selectedUserProgress}
        courses={courses}
      />

      {/* User Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? "Modifica Utente" : "Nuovo Utente"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2 w-full">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataNascita">Data di nascita</Label>
                <Input
                  id="dataNascita"
                  type="date"
                  value={dataNascita}
                  onChange={(e) => setDataNascita(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="luogoNascita">Luogo di nascita</Label>
                <Input
                  id="luogoNascita"
                  value={luogoNascita}
                  onChange={(e) => setLuogoNascita(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Ruolo</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona ruolo" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r} value={r} className="capitalize">
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Salvataggio..."
                  : selectedUser
                  ? "Aggiorna"
                  : "Crea"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conferma eliminazione</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Sei sicuro di voler eliminare questo utente?</p>
            <p className="font-medium mt-2">
              {userToDelete?.username} ({userToDelete?.email})
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isLoading}
            >
              Annulla
            </Button>
            <Button
              onClick={deleteUser}
              disabled={isLoading}
              variant="destructive"
            >
              {isLoading ? "Eliminazione..." : "Elimina"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Users;
