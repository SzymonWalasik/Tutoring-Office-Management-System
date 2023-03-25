import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../MainPage/Sidebar";
import "./SubjectVariantTutoringOffice.css";
import TopNavbar from "../TopNavbar/TopNavbar";
import Cookies from 'js-cookie';

function SubjectVariantTutoringOffice() {
    const [error, setError] = useState('');
    const [conductingClassesMode, setConductingClassesMode] = useState('');
    const [price, setPrice] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [subjectVariant, setSubjectVariant] = useState('');
    const [subjectVariantTutoringOffice, setSubjectVariantTutoringOffice] = useState('');
    const [subjectVariantTable, setSubjectVariantTable] = useState([]);
    const [subjectVariantTutoringOfficeTable, setSubjectVariantTutoringOfficeTable] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        checkTokenToRefresh();
        refreshSubjectVariantTable();
        refreshSubjectVariantTutoringOfficeTable();
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
    
    function refreshSubjectVariantTable() {
        checkTokenToRefresh()
        const resquestOptions2 = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('access_token')}` },
        }
        fetch('http://localhost:8000/api/subject_variants/', resquestOptions2)
            .then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            .then(subject_variants => setSubjectVariantTable(subject_variants))
            .catch(error => console.error(error))
    }

    function refreshSubjectVariantTutoringOfficeTable() {
        checkTokenToRefresh()
        const resquestOptions2 = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('access_token')}` },
        }
        fetch('http://localhost:8000/api/tutoring_office_subject_variants/', resquestOptions2)
            .then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            .then(tutoring_office_subject_variants => setSubjectVariantTutoringOfficeTable(tutoring_office_subject_variants))
            .catch(error => console.error(error))
    }

    function setActiveSubjectVariantTutoringOffice(_id) {
        const subjectVariantTutoringOfficeTemp = subjectVariantTutoringOfficeTable.filter((subjectVariantTutoringOffice) => subjectVariantTutoringOffice.id == _id)[0];
        setSubjectVariantTutoringOffice(subjectVariantTutoringOfficeTemp)
        setPrice(subjectVariantTutoringOfficeTemp.price)
    }

    function setActiveSubjectVariant(_id) {
        const subjectVariantTemp = subjectVariantTable.filter((subjectVariant) => subjectVariant.id == _id)[0];
        setSubjectVariant(subjectVariantTemp)
    }

    function handleEditSubjectVariantTutoringOfficeSubmit(event) {
        event.preventDefault();

        if (!price) {
            setError('Proszę wypełnić wszystkie pola.');
            return;
        }
        else {
            checkTokenToRefresh()
            const resquestOptions = {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json',
                            Authorization: `Bearer ${Cookies.get('access_token')}` },
                body: JSON.stringify({
                    price: price
                })
            }
            fetch('http://localhost:8000/api/tutoring_office_subject_variants/' + subjectVariantTutoringOffice.id + '/', resquestOptions)
                .then(response => response.json())
                .then(
                    setTimeout(() => {
                        refreshSubjectVariantTutoringOfficeTable()
                    }, 500)
                )
            
        }
    }

    function handleDeleteSubjectVariantTutoringOfficeSubmit(event) {
        event.preventDefault();
        
        checkTokenToRefresh()
        const resquestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('access_token')}` },
        }
        fetch('http://localhost:8000/api/tutoring_office_subject_variants/' + subjectVariantTutoringOffice.id + '/', resquestOptions)
            .then(response => response.json())
            .then(
                setTimeout(() => {
                    refreshSubjectVariantTutoringOfficeTable()
                }, 500)
            )
    }

    function handleCreateSubjectVariantTutoringOfficeSubmit(event) {
        event.preventDefault();

        if (!newPrice || !subjectVariant || !conductingClassesMode) {
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
                    price: newPrice,
                    subject_variant: subjectVariant.id,
                    conducting_classes_mode: conductingClassesMode
                })
            }
            fetch('http://localhost:8000/api/tutoring_office_subject_variants/', resquestOptions)
                .then(response => response.json())
                .then(newSubject => {
                        setNewPrice('')
                        setSubjectVariant('')
                        setConductingClassesMode('')
                        setTimeout(() => {
                            refreshSubjectVariantTutoringOfficeTable()
                        }, 500)
                    }
                )
        }
    }

    return (
        <div>
            <TopNavbar />
            <Sidebar>
                <section class="subjects-container">
                    <h1 className="management-header">Zarządzanie przedmiotami w placówce</h1>
                    <form className="edit-subjects-form">
                        <select className="subject-list" name="Przedmioty" id="subjectList" onChange={event => setActiveSubjectVariantTutoringOffice(event.target.value)}>
                            <option>Wybierz przedmiot</option>
                            {subjectVariantTutoringOfficeTable.map(subjectVariantTutoringOffice =>(
                                <option value={subjectVariantTutoringOffice.id}>
                                    {subjectVariantTutoringOffice.id}: {subjectVariantTutoringOffice.subject_variant.subject.name} - poziom {subjectVariantTutoringOffice.subject_variant.advancement_level}, zajęcia {subjectVariantTutoringOffice.conducting_classes_mode}
                                </option>
                            ))}
                        </select>
                        {error && <p>{error}</p>}
                        <label type="text" className='group-label'>Wybrany przedmiot: {subjectVariantTutoringOffice?.subject_variant?.subject?.name} - poziom {subjectVariantTutoringOffice?.subject_variant?.advancement_level}, zajęcia {subjectVariantTutoringOffice?.conducting_classes_mode}</label>
                        <br />
                        <label type="text" for="price">Cena:</label>
                        <input type="number" value={price} name="price" id="price" required="" onChange={event => setPrice(event.target.value)}></input>
                        <br />

                        <button type='submit' name='editButton' id='editButton' onClick={handleEditSubjectVariantTutoringOfficeSubmit}>Edytuj wszystkie dane</button>
                        <button type='submit' name='deleteButton' id='deleteButton' onClick={handleDeleteSubjectVariantTutoringOfficeSubmit}>Usuń przedmiot</button>
                    </form>
                    <h1 className="creation-header">Dodawanie wariantu przedmiotu w placówce</h1>
                    <form className="create-subject-form" onSubmit={handleCreateSubjectVariantTutoringOfficeSubmit}>
                        <select className="subject-list" name="Wariancje przedmiotu" id="subjectVariantList" onChange={event => setActiveSubjectVariant(event.target.value)}>
                            <option>Wybierz wariancję przedmiotu</option>
                            {subjectVariantTable.map(subjectVariant =>(
                                <option value={subjectVariant.id}>
                                    {subjectVariant.id}: {subjectVariant.subject.name} - {subjectVariant.advancement_level}
                                </option>
                            ))}
                        </select>
                        <select className="conducting-classes-mode-list" name="Wariancje prowadzenia zajęć" id="ConductingClassesModeList" onChange={event => setConductingClassesMode(event.target.value)}>
                            <option>Wybierz sposób prowadzenia zajęć</option>
                            <option value="Indywidualne">
                                Indywidualne
                            </option>
                            <option value="Para">
                                Para
                            </option>
                            <option value="Grupa">
                                Grupa
                            </option>
                        </select>
                        <br />
                        <label type="text" for="newPrice">Cena:</label>
                        <input type="number" value={newPrice} name="newPrice" id="newPrice" required="" onChange={event => setNewPrice(event.target.value)}></input>
                        <br />
                        <button type='submit'>Utwórz nowy przedmiot</button>
                    </form>
                </section>
            </Sidebar>
        </div>
    )
}

export default SubjectVariantTutoringOffice;