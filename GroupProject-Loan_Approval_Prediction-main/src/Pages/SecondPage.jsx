import React, { useState } from "react";
import { useAtom } from 'jotai';
import { useNavigate } from "react-router-dom";
import { ageAtom, diseaseAtom } from "./Atoms.jsx";
import "./FirstPage.css";

const diseases = [
  '-', 'Amputation majeure', 'Arthrite', 'Asthme', 'Cancer avancé', 'Cécité', 'Diabète contrôlé', 'Dyslipidémie',
  'Démence avancée', 'Hypertension', 'Hypothyroïdie', 'Insuffisance rénale chronique', 'Maladie cardiovasculaire grave',
  'Maladie de Parkinson avancée', 'Maladie pulmonaire obstructive chronique sévère', 'Quadriplégie', 'Sclérose en plaques',
  'Surdité partielle', 'Surdité profonde', 'Troubles visuels légers'
];

const diseaseMapping = {
  '-': '-',
  'Amputation majeure': 'Amputation majeure',
  'Arthrite': 'Arthrite',
  'Asthme': 'Asthme',
  'Cancer avancé': 'Cancer avancé',
  'Cécité': 'Cécité',
  'Diabète contrôlé': 'Diabète contrôlé',
  'Dyslipidémie': 'Dyslipidémie',
  'Démence avancée': 'Démence avancée',
  'Hypertension': 'Hypertension',
  'Hypothyroïdie': 'Hypothyroïdie',
  'Insuffisance rénale chronique': 'Insuffisance rénale chronique',
  'Maladie cardiovasculaire grave': 'Maladie cardiovasculaire grave',
  'Maladie de Parkinson avancée': 'Maladie de Parkinson avancée',
  'Maladie pulmonaire obstructive chronique sévère': 'Maladie pulmonaire obstructive chronique sévère',
  'Quadriplégie': 'Quadriplégie',
  'Sclérose en plaques': 'Sclérose en plaques',
  'Surdité partielle': 'Surdité partielle',
  'Surdité profonde': 'Surdité profonde',
  'Troubles visuels légers': 'Troubles visuels légers'
};

export default function SecondPage() {
  const [age, setAge] = useAtom(ageAtom);
  const [disease, setDisease] = useAtom(diseaseAtom);
  const [ageValid, setAgeValid] = useState(true);
  const [diseaseValid, setDiseaseValid] = useState(true);

  const navigate = useNavigate();

  const validateInputs = () => {
    let isValid = true;

    if (isNaN(age) || age <= 0) {
      setAgeValid(false);
      isValid = false;
    } else {
      setAgeValid(true);
    }

    if (!Object.keys(diseaseMapping).includes(disease)) {
      setDiseaseValid(false);
      isValid = false;
    } else {
      setDiseaseValid(true);
    }

    return isValid;
  };

  const handleNextClick = () => {
    if (validateInputs()) {
      // Map French choices to English before navigating
      setDisease(diseaseMapping[disease]);
      navigate("/third_page");
    }
  };

  const handlePreviousClick = () => {
    navigate("/first_page");
  };

  return (
    <div className="min-h-screen flex items-center justify-center background">
      <div className="max-w-md w-full h-4/6 bg-white p-8 rounded-lg shadow-lg overflow-auto scrollbar-hide">
        <div className="w-full flex items-center justify-center flex-col mb-8">
          <h2 className="text-2xl font-bold mb-2">Formulaire d'éligibilité au prêt</h2>
          <p className="text-sm text-gray-400">
            Veuillez remplir ce formulaire avec les informations requises
          </p>
        </div>

        <form className="flex flex-col">
          <div className="w-full px-4">
            <div className="w-full mb-3">
              <label className="block uppercase text-slate-600 text-xs font-bold mb-2 text-left" htmlFor="age">
                Âge
              </label>
              <input
                type="number"
                className="border-0 px-3 py-3 placeholder-gray-400 text-slate-600 bg-gray-100 rounded-lg text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 text-left"
                placeholder="55"
                onChange={(event) => setAge(event.target.value)}
                value={age}
                id="age"
              />
              {!ageValid && <p className="text-red-600 text-sm font-bold text-left">L'âge doit être un nombre positif</p>}
            </div>
          </div>
          <div className="w-full px-4">
            <div className="w-full mb-3">
              <label className="block uppercase text-slate-600 text-xs font-bold mb-2 text-left" htmlFor="disease">
                Maladie/Handicap
              </label>
              <select
                className="border-0 px-3 py-3 placeholder-gray-400 text-slate-600 bg-gray-100 rounded-lg text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 text-left"
                onChange={(event) => setDisease(event.target.value)}
                value={disease}
                id="disease"
              >
                <option value="" disabled>Choisissez une maladie/un handicap</option>
                {Object.keys(diseaseMapping).map((diseaseOption) => (
                  <option key={diseaseOption} value={diseaseOption}>{diseaseOption}</option>
                ))}
              </select>
              {!diseaseValid && <p className="text-red-600 text-sm font-bold text-left">Veuillez choisir une maladie ou un handicap valide</p>}
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
