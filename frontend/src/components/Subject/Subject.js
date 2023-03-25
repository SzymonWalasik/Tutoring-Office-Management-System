import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../MainPage/Sidebar";
import "./Subject.css";
import TopNavbar from "../TopNavbar/TopNavbar";
import Cookies from 'js-cookie';

function Subject() {
    const [error, setError] = useState('');
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [newName2, setNewName2] = useState('');
    const [newName, setNewName] = useState('');
    const [subjectTable, setSubjectTable] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        checkTokenToRefresh();
        refreshSubjectTable();
    }, []);

    function checkTokenToRefresh() {
        if(Cookies.get("access_token") == null) {
            if(Cookies.get("refresh_token") != null) {
                //tutaj odświeżanie tokena refreshem
                fetch('http://localhost:8000/api/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refresh: Cookies.get("refresh_token")
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error, status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                Cookies.set('access_token', data.access, { expires: 5 / 24 / 60 })
            })
            .catch(error => setError('Niepoprawne hasło, lub nie posiadasz konta'));
        }
            else {
                navigate("/login")
            }
        }
    }
    
    function refreshSubjectTable() {
        checkTokenToRefresh()
        const resquestOptions2 = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('access_token')}` },
        }
        fetch('http://localhost:8000/api/subjects/', resquestOptions2)
            .then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            .then(subjects => setSubjectTable(subjects))
            .catch(error => console.error(error))
    }

    function setActiveSubject(_id) {
        const subject = subjectTable.filter((subject) => subject.id == _id)[0];
        setName(subject.name)
        setId(subject.id)
    }

    function handleEditSubjectSubmit(event) {
        event.preventDefault();

        if (!newName) {
            setError('Proszę wypełnić wszystkie pola.');
            return;
        }
        else {
            checkTokenToRefresh()
            const resquestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json',
                            Authorization: `Bearer ${Cookies.get('access_token')}` },
                body: JSON.stringify({
                    name: newName
                })
            }
            fetch('http://localhost:8000/api/subjects/' + id + '/', resquestOptions)
                .then(response => response.json())
                .then(
                    setTimeout(() => {
                        setName(newName)
                        refreshSubjectTable()
                    }, 500)
                )
            
        }
    }

    function handleDeleteSubjectSubmit(event) {
        event.preventDefault();

        checkTokenToRefresh()
        const resquestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('access_token')}` },
        }
        fetch('http://localhost:8000/api/subjects/' + id + '/', resquestOptions)
            .then(response => response.json())
            .then(
                setTimeout(() => {
                    setName('')
                    refreshSubjectTable()
                }, 500)
            )
    }

    function handleCreateSubjectSubmit(event) {
        event.preventDefault();

        if (!newName2) {
            setError('Proszę wypełnić wszystkie pola.');
            return;
        }
        else {
            checkTokenToRefresh()
            const resquestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                            Authorization: `Bearer ${Cookies.get('access_token')}` },
                body: JSON.stringify({
                    name: newName2
                })
            }
            fetch('http://localhost:8000/api/subjects/', resquestOptions)
                .then(response => response.json())
                .then(newSubject => {
                        setTimeout(() => {
                            refreshSubjectTable()
                        }, 500)
                        handleCreateSubjectVariant(newSubject.id, 'Podstawowy')
                        handleCreateSubjectVariant(newSubject.id, 'Średnio-zaawansowany')
                        handleCreateSubjectVariant(newSubject.id, 'Zaawansowany')
                    }
                )
        }
    }

    function handleCreateSubjectVariant(_subject_id, _advancement_level) {
        checkTokenToRefresh()
        const resquestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('access_token')}` 
            },
            body: JSON.stringify({
                advancement_level: _advancement_level,
                subject: _subject_id
            })
        }
        fetch('http://localhost:8000/api/subject_variants/', resquestOptions)
            .then(response => response.json())
    }

    return (
        <div>
            <TopNavbar />
            <Sidebar>
                <section class="subjects-container">
                    <h1 className="management-header">Zarządzanie przedmiotami</h1>
                    <form className="edit-subjects-form">
                        <select className="subject-list" name="Przedmioty" id="subjectList" onChange={event => setActiveSubject(event.target.value)}>
                            <option>Wybierz przedmiot</option>
                            {subjectTable.map(subject =>(
                                <option value={subject.id}>
                                    {subject.id}: {subject.name}
                                </option>
                            ))}
                        </select>
                        {error && <p>{error}</p>}
                        <label type="text" className='group-label'>Wybrany przedmiot: {name} </label>
                        <br />
                        <input type="text" value={newName} maxlength="256" name="newName" placeholder="Nowa nazwa" id="newName" required="" onChange={event => setNewName(event.target.value)}></input>
                        <br />

                        <button type='submit' name='editButton' id='editButton' onClick={handleEditSubjectSubmit}>Edytuj wszystkie dane</button>
                        <button type='submit' name='deleteButton' id='deleteButton' onClick={handleDeleteSubjectSubmit}>Usuń przedmiot</button>
                    </form>
                    <h1 className="creation-header">Dodawanie przedmiotów</h1>
                    <form className="create-subject-form" onSubmit={handleCreateSubjectSubmit}>
                        <input type="text" value={newName2} maxlength="256" name="newName2" placeholder="Nazwa przedmiotu" id="newName2" required="" onChange={event => setNewName2(event.target.value)}></input>
                        <br />
                        <button type='submit'>Utwórz nowy przedmiot</button>
                    </form>
                </section>
            </Sidebar>
        </div>
    )
}

export default Subject;