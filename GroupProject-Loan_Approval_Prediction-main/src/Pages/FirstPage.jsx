import React, { useState } from "react";
import { useAtom } from 'jotai';
import { useNavigate } from "react-router-dom";
import { jobAtom, otherCreditsAtom, salaryAtom } from "./Atoms.jsx";
import "./FirstPage.css";

export default function FirstPage() {
  const [salary, setSalary] = useAtom(salaryAtom);
  const [job, setJob] = useAtom(jobAtom);
  const [otherCredits, setOtherCredits] = useAtom(otherCreditsAtom);
  const [salaryValid, setSalaryValid] = useState(true);
  const [jobValid, setJobValid] = useState(true);
  const [otherCreditsValid, setOtherCreditsValid] = useState(true);

  const navigate = useNavigate();

  // Mapping of French choices to English
  const jobMapping = {
    "Secteur privé": "PR",
    "Secteur public": "PB",
    "Retraité": "R"
  };

  const otherCreditsMapping = {
    "Oui": "yes",
    "Non": "no"
  };

  const validateInputs = () => {
    let isValid = true;

    if (isNaN(salary) || salary <= 0) {
      setSalaryValid(false);
      isValid = false;
    } else {
      setSalaryValid(true);
    }

    if (!Object.keys(jobMapping).includes(job)) {
      setJobValid(false);
      isValid = false;
    } else {
      setJobValid(true);
    }

    if (!Object.keys(otherCreditsMapping).includes(otherCredits)) {
      setOtherCreditsValid(false);
      isValid = false;
    } else {
      setOtherCreditsValid(true);
    }

    return isValid;
  };

  const handleNextClick = () => {
    if (validateInputs()) {
      // Map French choices to English before navigating
      setJob(jobMapping[job]);
      setOtherCredits(otherCreditsMapping[otherCredits]);
      navigate("/second_page");
    }
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
              <label className="block uppercase text-slate-600 text-xs font-bold mb-2 text-left" htmlFor="salary">
                Salaire
              </label>
              <input
                type="number"
                className="border-0 px-3 py-3 placeholder-gray-400 text-slate-600 bg-gray-100 rounded-lg text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 text-left"
                placeholder="10000 (DA)"
                onChange={(event) => setSalary(event.target.value)}
                value={salary}
                id="salary"
              />
              {!salaryValid && <p className="text-red-600 text-sm font-bold text-left">Le salaire doit être un nombre positif</p>}
            </div>
          </div>

          <div className="w-full px-4">
            <div className="w-full mb-3">
              <label className="block uppercase text-slate-600 text-xs font-bold mb-2 text-left" htmlFor="job">
                Emploi
              </label>
              <select
                className="border-0 px-3 py-3 placeholder-gray-400 text-slate-600 bg-gray-100 rounded-lg text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 text-left"
                onChange={(event) => setJob(event.target.value)}
                value={job}
                id="job"
              >
                <option value="" disabled>Choisissez un emploi</option>
                <option value="Secteur privé">Secteur privé</option>
                <option value="Secteur public">Secteur public</option>
                <option value="Retraité">Retraité</option>
              </select>
              {!jobValid && <p className="text-red-600 text-sm font-bold text-left">L'emploi doit être dans le secteur privé, public ou retraité</p>}
            </div>
          </div>

          <div className="w-full px-4">
            <div className="w-full mb-3">
              <label className="block uppercase text-slate-600 text-xs font-bold mb-2 text-left" htmlFor="otherCredits">
                Avez-vous d'autres crédits?
              </label>
              <select
                className="border-0 px-3 py-3 placeholder-gray-400 text-slate-600 bg-gray-100 rounded-lg text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 text-left"
                onChange={(event) => setOtherCredits(event.target.value)}
                value={otherCredits}
                id="otherCredits"
              >
                <option value="" disabled>Choisissez une option</option>
                <option value="Oui">Oui</option>
                <option value="Non">Non</option>
              </select>
              {!otherCreditsValid && <p className="text-red-600 text-sm font-bold text-left">Veuillez choisir oui ou non</p>}
            </div>
          </div>

          <div className="flex justify-between items-center flex-grow my-4">
            <button
              type="button"
              className="text-gray-400 ml-2 text-left"
            >
              Précédent
            </button>
            <button
              type="button"
              className="bg-purple-500 text-white px-4 py-2 rounded-lg text-left"
              onClick={handleNextClick}
            >
              Suivant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}