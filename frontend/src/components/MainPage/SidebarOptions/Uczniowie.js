import React, { useState } from "react";
import Sidebar from "../Sidebar";
import "./Uczniowie.css";
import TopNavbar from "../../TopNavbar/TopNavbar";

const students = [
    { firstName: "Jan", lastName: "Kowalski", group: "Grupa 1" },
  ];

const groups = ['Grupa 1', 'Grupa 2', 'Grupa 3'];

function Uczniowie() {
  const [updatedStudents, setUpdatedStudents] = useState(students);
  const [groupList, setGroupList] = useState(groups);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newStudent, setNewStudent] = useState({ firstName: "", lastName: "" });
  const [addingStudent, setAddingStudent] = useState(false);

  const handleAssignGroup = (index) => {
    const updatedStudentList = [...updatedStudents];
    updatedStudentList[index].group = selectedGroup;
    setUpdatedStudents(updatedStudentList);
  };

  const handleAddGroup = () => {
    const newGroup = prompt("Podaj nazwę nowej grupy:");
    if (newGroup && newGroup.trim().length > 0) {
        setGroupList([...groupList, newGroup]);
    } else {
        alert("Nazwa grupy nie może być pusta");
    }
};

  const handleAddStudent = () => {
    setAddingStudent(true);
  };

  
  const handleNewStudentChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleDeleteStudent = (index) => {
    const updatedStudentList = [...updatedStudents];
    updatedStudentList.splice(index, 1);
    setUpdatedStudents(updatedStudentList);
  };

  const handleAddStudentSubmit = (e) => {
    e.preventDefault();
    if (!newStudent.firstName || !newStudent.lastName) {
        alert("Proszę wprowadzić imię i nazwisko");
        return;
      }
    setUpdatedStudents([...updatedStudents, newStudent]);
    setNewStudent({ firstName: "", lastName: "" });
    setAddingStudent(false);
  };

  return (
    <div>
      <TopNavbar />
      <Sidebar>
        <section className="students-container">
            <h1 className="students-header">Uczniowie</h1>
            <table className="students-table">
              <thead>
                  <tr>
                    <td className="students-table-headers">Imię</td>
                    <td className="students-table-headers">Nazwisko</td>
                    <td className="students-table-headers">Grupa</td>
                    <td></td>
                    <td></td>
                  </tr>
              </thead>
              <tbody>
                  {updatedStudents.map((student, index) => (
                    <tr key={student.firstName + student.lastName}>
                      <td>{student.firstName}</td>
                      <td>{student.lastName}</td>
                      <td>
                      {student.group || (
                          <div className="students-group-options" >
                            <button className="students-table-buttons" onClick={() => handleAssignGroup(index)}>
                                Przypisz grupę
                            </button>
                            <select className="students-table-select" onChange={e => setSelectedGroup(e.target.value)}>
                                <option value="">Wybierz grupę</option>
                                {groupList.map(group => (
                                <option key={group} value={group}>{group}</option>
                                ))}
                            </select>
                          </div>
                      )}
                      </td>
                      <td>
                          <button className="students-table-buttons" onClick={() => handleDeleteStudent(index)}>
                              Usuń 
                          </button>
                      </td>
                      <td>
                          {student.group && (
                              <div>
                                <button className="students-table-buttons" onClick={() => handleAssignGroup(index)}>
                                Zmień grupę
                                </button>
                                <select className="students-table-select" onChange={e => setSelectedGroup(e.target.value)}>
                                  <option value="">Wybierz grupę</option>
                                  {groupList.map(group => (
                                  <option key={group} value={group}>{group}</option>
                                  ))}
                                </select>
                              </div>
                          )}
                      </td>
                  </tr>
                  ))}
              </tbody>
            </table>
            <button onClick={handleAddGroup}>Dodaj nową grupę</button>
            <button onClick={handleAddStudent}>Dodaj ucznia</button>
            {addingStudent && (
                <form onSubmit={handleAddStudentSubmit}>
                    <label>
                    Imię:
                        <input
                            type="text"
                            name="firstName"
                            value={newStudent.firstName}
                            onChange={handleNewStudentChange}
                        />
                    </label>
                    <label>
                    Nazwisko:
                        <input
                            type="text"
                            name="lastName"
                            value={newStudent.lastName}
                            onChange={handleNewStudentChange}
                        />
                    </label>
                    <button type="submit">Zatwierdź</button>
                </form>
            )}
        </section>
      </Sidebar>
    </div>
  );
}

export default Uczniowie;
