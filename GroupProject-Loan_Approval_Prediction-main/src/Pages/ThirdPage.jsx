import React, { useState } from "react";
import { useAtom } from 'jotai';
import { useNavigate } from "react-router-dom";
import { creditTypeAtom, dateAtom, requestedCreditsAtom, ageAtom, diseaseAtom, jobAtom, otherCreditsAtom, salaryAtom, predictionAtom } from "./Atoms.jsx"; // Adjust path as needed
import fetchPrediction from '../api';
import "./FirstPage.css";

const creditTypes = [
  'ACHAT LOGEMENT FINI', 'ACHAT TERRAIN', 'ACHAT TERRAIN ', 'ACHAT TERRAIN MDN', 'ACHAT VEHICULE', 'AMENAGEMENT',
  'CBEP', 'CON', 'CONS', 'CONS ', 'CONS MDN', 'CONSOMMATION', 'CONSOMMATION MDN', 'CPEP', 'LOCATION',
  'LOGMT FINI', 'LPA', 'LPA VSP', 'LPP', 'LSP', 'LSP ', 'LSP DGSN', 'LSP MDN', 'LSP P', 'LSP VSP', 'POC', 'POC MDN',
  'POC MON', 'POC RURAL', 'RURAL', 'VSD', 'VSD ', 'VSD MDN', 'VSP', 'VSP LPA', 'VSP LSP', 'VSP MDN', 'VSP P', 'pocrural'
];

export default function ThirdPage() {
  const [requestedCredits, setRequestedCredits] = useAtom(requestedCreditsAtom);
  const [creditType, setCreditType] = useAtom(creditTypeAtom);
  const [date, setDate] = useAtom(dateAtom);
  const [age] = useAtom(ageAtom);
  const [disease] = useAtom(diseaseAtom);
  const [job] = useAtom(jobAtom);
  const [otherCredits] = useAtom(otherCreditsAtom);
  const [salary] = useAtom(salaryAtom);
  const [, setPrediction] = useAtom(predictionAtom);

  const [requestedCreditsValid, setRequestedCreditsValid] = useState(true);
  const [creditTypeValid, setCreditTypeValid] = useState(true);
  const [dateValid, setDateValid] = useState(true);

  const navigate = useNavigate();

  const validateDate = (date) => {
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    if (!regex.test(date)) {
      return false;
    }
    const [day, month, year] = date.split("-").map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj && dateObj.getDate() === day && dateObj.getMonth() === month - 1 && dateObj.getFullYear() === year;
  };

  const validateInputs = () => {
    let isValid = true;

    if (isNaN(requestedCredits) || requestedCredits <= 0) {
      setRequestedCreditsValid(false);
      isValid = false;
    } else {
      setRequestedCreditsValid(true);
    }

    if (creditType.trim() === "") {
      setCreditTypeValid(false);
      isValid = false;
    } else {
      setCreditTypeValid(true);
    }

    if (!validateDate(date)) {
      setDateValid(false);
      isValid = false;
    } else {
      setDateValid(true);
    }

    return isValid;
  };

  const handleNextClick = async () => {
    if (validateInputs()) {
      const data = {
        age,
        disease,
        job,
        otherCredits,
        salary,
        requestedCredits,
        creditType,
        date
      };
      try {
        const prediction = await fetchPrediction(data);
        setPrediction(prediction);
        navigate("/result_page");
      } catch (error) {
        console.error('Error fetching prediction:', error);
      }
    }
  };

  const handlePreviousClick = () => {
    navigate("/second_page");
  };

  return (
    <div className="min-h-screen flex items-center justify-center background">
      <div className="max-w-md w-full h-4/6 bg-white p-8 rounded-lg shadow-lg overflow-auto scrollbar-hide">
        <div className="w-full flex items-center justify-center flex-col mb-8">
          <h2 className="text-2xl font-bold mb-2 text-left">Formulaire d'éligibilité au prêt</h2>
          <p className="text-sm text-gray-400 text-left">
            Veuillez remplir ce formulaire avec les informations requises
          </p>
        </div>

        <form className="flex flex-col">
          <div className="w-full px-4">
            <div className="w-full mb-3">
              <label className="block uppercase text-slate-600 text-xs font-bold mb-2 text-left" htmlFor="requestedCredits">
                Crédit demandé
              </label>
              <input
                type="number"
                className="border-0 px-3 py-3 placeholder-gray-400 text-slate-600 bg-gray-100 rounded-lg text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 text-left"
                placeholder="55000000 (DA)"
                onChange={(event) => setRequestedCredits(event.target.value)}
                value={requestedCredits}
                id="requestedCredits"
              />
              {!requestedCreditsValid && <p className="text-red-600 text-sm font-bold text-left">Le crédit demandé doit être un nombre positif</p>}
            </div>
          </div>
          <div className="w-full px-4">
            <div className="w-full mb-3">
              <label className="block uppercase text-slate-600 text-xs font-bold mb-2 text-left" htmlFor="creditType">
                Type de crédit
              </label>
              <select
                className="border-0 px-3 py-3 placeholder-gray-400 text-slate-600 bg-gray-100 rounded-lg text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 text-left"
                onChange={(event) => setCreditType(event.target.value)}
                value={creditType}
                id="creditType"
              >
                <option value="" disabled className="placeholder-gray-400">Choisissez le type de crédit</option>
                {creditTypes.map((creditTypeOption) => (
                  <option key={creditTypeOption} value={creditTypeOption}>{creditTypeOption}</option>
                ))}
              </select>
              {!creditTypeValid && <p className="text-red-600 text-sm font-bold text-left">Le type de crédit ne peut pas être vide</p>}
            </div>
          </div>
          <div className="w-full px-4">
            <div className="w-full mb-3">
              <label className="block uppercase text-slate-600 text-xs font-bold mb-2 text-left" htmlFor="date">
                Date
              </label>
              <input
                type="text"
                className="border-0 px-3 py-3 placeholder-gray-400 text-slate-600 bg-gray-100 rounded-lg text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 text-left"
                placeholder="01-01-2024"
                onChange={(event) => setDate(event.target.value)}
                value={date}
                id="date"
              />
              {!dateValid && <p className="text-red-600 text-sm font-bold text-left">La date doit être au format jj-mm-aaaa</p>}
            </div>
          </div>
          <div className="flex justify-between px-4 items-center flex-grow my-4">
            <button type="button" className="text-gray-400 ml-2 text-left" onClick={handlePreviousClick}>Précédent</button>
            <button type="button" className="bg-purple-500 text-white px-4 py-2 rounded-lg text-left" onClick={handleNextClick}>Suivant</button>
          </div>
        </form>
      </div>
    </div>
  );
}
