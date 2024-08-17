import React, { useState, useEffect } from "react";
import "./FirstPage.css";
import { useNavigate } from "react-router-dom";

export default function AnalysisPage() {
  const [shapImage, setShapImage] = useState("");
  const navigate = useNavigate();
  const handleNextClick = () => {
    navigate("/result_page");
  };
  const handlePreviousClick = () => {
    navigate("/first_page");
  };
  useEffect(() => {
    const queryParams = new URLSearchParams({
      age: '33',
      disease: '-',
      job: 'PB',
      otherCredits: 'no',
      salary: '60000',
      requestedCredits: '6000000',
      creditType: 'CONSOMMATION MDN',
      disabilityStatus: 'False'
    }).toString();

    fetch(`http://127.0.0.1:5000/shap_plot?${queryParams}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        setShapImage(url);
      })
      .catch(error => console.error('Error fetching SHAP plot:', error));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center background">
      <div className="max-w-2xl w-full h-5/6 bg-white p-8 rounded-lg shadow-lg overflow-auto scrollbar-hide">
        <div className="w-full flex items-center justify-center flex-col mb-8">
          <h2 className="text-2xl font-bold mb-2">Résultat de l'éligibilité au prêt</h2>
          <p className="text-sm text-gray-400 mb-4">
            L'analyse:
          </p>
          {shapImage && (
            <img src={shapImage} alt="Analyse SHAP" className="mb-4 rounded-md w-full" style={{ maxHeight: '500px' }} />
          )}
          <p className="text-xl font-bold mb-10">Comment lire le graph:</p>
          <div className="text-left">
            <ul className="list-disc pl-5 text-gray-600">
              <li>Chaque barre montre l'importance d'une information.</li>
              <li>Les barres vertes aident votre éligibilité.</li>
              <li>Les barres rouges réduisent votre éligibilité.</li>
              <li>Plus la barre est longue, plus l'information est importante.</li>
            </ul>
          </div>

        </div>
        <div className="flex justify-between items-center flex-grow my-4">
            <button
              type="button"
              className="text-gray-400 ml-2 text-left"
              onClick={handlePreviousClick}
            >
              Retourner vers l'Acceuil
            </button>
            <button
              type="button"
              className="bg-purple-500 text-white px-4 py-2 rounded-lg text-left"
              onClick={handleNextClick}
            >
              Retourner vers la page du Resultat
            </button>
          </div>
      </div>
    </div>
  );
}
