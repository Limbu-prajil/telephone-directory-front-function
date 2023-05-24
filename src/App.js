import React, { useState, useEffect } from 'react';
import Info from './Info';
import Form from './Form';
import axiosService from './axios-services/persons';

const App = () => {
  const [persons, setPersons] = useState([
    {
      name: 'Prajil Limbu',
      number: '040123456',
    }
  ]);
  const [newName, setNewName] = useState('');
  const [newNum, setNewNum] = useState('');
  const [error, setError] = useState('');

  console.log('C');

  useEffect(() => {
    console.log('M');
    axiosService
      .read()
      .then(persons => {
        console.log('cRud');
        setPersons(persons);
      })
      .catch(error => {
        setError(`Information unfortunately not found.`);
        console.log(error);
        setTimeout(() => {
          setError(null);
        }, 2000);
      });
  }, []);

  const handleNameChange = event => {
    setNewName(event.target.value);
  };

  const handleNumChange = event => {
    setNewNum(event.target.value);
  };

  const addName = event => {
    event.preventDefault();
    const nameNumber = { name: newName, number: newNum };
    let checkName = persons.find(
      e => e.name.toLowerCase() === nameNumber.name.toLowerCase()
    );
    let checkNumber = persons.find(e => e.number === nameNumber.number);
    if (
      (checkName !== undefined || checkNumber !== undefined) ||
      (checkName !== undefined && checkNumber !== undefined)
    ) {
      alert('Name or number match');
      setNewName('');
      setNewNum('');
      setError(`Info ${nameNumber.name} and ${nameNumber.number} must be unique.`);
      console.log(error);
      setTimeout(() => {
        setError(null);
      }, 3000);
    } else {
      axiosService
        .create(nameNumber)
        .then(newNameNumber => {
          console.log('Crud');
          setPersons(persons.concat(newNameNumber));
          setNewName('');
          setNewNum('');
        })
        .catch(error => {
          setError(`Info ${nameNumber.name} or ${nameNumber.number} have been already unfortunately edited from server.`);
          console.log(error);
          setTimeout(() => {
            setError(null);
          }, 2000);
        });
    }
  };

  const deleteInfo = idd => {
    return () => {
      if (window.confirm('Do you really want to delete?')) {
        axiosService
          .dilit(idd)
          .then(newpersons => {
            console.log('cruD', newpersons);
            const personsAterDel = persons.filter(e => e.id !== idd);
            setPersons([...personsAterDel]);
          })
          .catch(error => {
            setError(`Info ${persons.filter(e => e.id === idd)} can not be unfortunately removed from server.`);
            console.log(error);
            setTimeout(() => {
              setError(null);
            }, 2000);
          });
        console.log('Delete success!');
      } else {
        console.log('Delete operation canceled or dialog closed.');
      }
    };
  };

  const editInfo = idd => {
    return event => {
      event.preventDefault();
      const updatedName = prompt('Enter the updated name (Cancel to retain value):');
      const updatedNum = prompt('Enter the updated number ((Cancel to retain value)):');

      const updatedPerson = {
        name: updatedName !== null ? updatedName : persons.find(e => e.id === idd).name,
        number: updatedNum !== null ? updatedNum : persons.find(e => e.id === idd).number
      };

      axiosService
        .update(idd, updatedPerson)
        .then(updatedPerson => {
          console.log('crUd');
          const updatedPersons = persons.map(person => {
            if (person.id === idd) {
              return { ...person, name: updatedPerson.name, number: updatedPerson.number };
            }
            return person;
          });
          setPersons(updatedPersons);
        })
        .catch(error => {
          setError(`Info ${updatedName} or ${updatedNum} have been already unfortunately edited from server.`);
          console.log(error);
          setTimeout(() => {
            setError(null);
          }, 2000);
        });
    };
  };

  console.log('R');
  return (
    <div>
      <h2>Telephone Directory</h2>
      <Form
        newName={newName}
        newNum={newNum}
        addName={addName}
        handleNameChange={handleNameChange}
        handleNumChange={handleNumChange}
      />
      <h2>Name and Numbers</h2>
      <Info data={persons} handleDelete={deleteInfo} handleEdit={editInfo} />
    </div>
  );
};

export default App;
