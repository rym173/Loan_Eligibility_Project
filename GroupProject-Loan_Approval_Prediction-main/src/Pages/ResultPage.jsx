import React from "react";
import { useAtom } from 'jotai';
import { useNavigate } from "react-router-dom";
import { predictionAtom } from "./Atoms.jsx";
import "./FirstPage.css";
import CircularProgressBar from "./CircularProgresBar.jsx";

export default function ResultPage() {
  const [prediction] = useAtom(predictionAtom);
  const navigate = useNavigate();

  const handleNextClick = () => {
    navigate("/analysis_page");
  };

  return (
    <div className="min-h-screen flex items-center justify-center background">
      <div className="max-w-md w-full h-4/6 bg-white p-8 rounded-lg shadow-lg overflow-auto scrollbar-hide">
        <div className="w-full flex items-center justify-center flex-col mb-8">
          <h2 className="text-2xl font-bold mb-2 text-left">Résultat de l'éligibilité au prêt</h2>
          <p className="text-sm text-gray-400 text-left">
            Après traitement des informations, l'éligibilité de votre prêt est:
          </p>
        </div>
        <div className="w-full flex items-center justify-center flex-col mb-8 h-48">
          {prediction !== null ? (
            <>
              <p className={`text-4xl font-bold ${prediction >= 0.5 ? 'text-green-700' : 'text-red-700'} mb-10`}>
                {prediction >= 0.5 ? 'Éligible' : 'Non éligible'}
              </p>
              <div className="mb-5">
                <CircularProgressBar percentage={prediction * 100} />
              </div>
            </>
          ) : (
            <p className="text-red-600">Pas de prévisions disponibles</p>
          )}
        </div>
        <div className="w-full flex items-center justify-center flex-col">
          <button
            className="w-4/5 bg-purple-400 hover:bg-purple-500 text-white font-semibold text-l py-2 px-4 rounded-lg flex items-center justify-center"
            onClick={handleNextClick}
          >
            Voir l'analyse de la demande
          </button>
        </div>
      </div>
    </div>
  );
}
