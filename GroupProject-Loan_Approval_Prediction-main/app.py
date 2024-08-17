from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import shap
import matplotlib
matplotlib.use('Agg')  # Use the 'Agg' backend for non-GUI environments
import matplotlib.pyplot as plt
import io

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins

# Load your trained model
model = joblib.load('RF_loan_approval_model.pkl')

# Define the min and max values for normalization
min_max_values = {
    'Age': [18, 70],
    'Salary': [20000, 200000],
    'Requested_Credit': [100000, 50000000],
    'DTI_Ratio': [2.5, 250]
}

credit_types = [
    'ACHAT LOGEMENT FINI', 'ACHAT TERRAIN', 'ACHAT TERRAIN ', 'ACHAT TERRAIN MDN', 'ACHAT VEHICULE', 'AMENAGEMENT',
    'CBEP', 'CON', 'CONS', 'CONS ', 'CONS MDN', 'CONSOMMATION', 'CONSOMMATION MDN', 'CPEP', 'LOCATION',
    'LOGMT FINI', 'LPA', 'LPA VSP', 'LPP', 'LSP', 'LSP ', 'LSP DGSN', 'LSP MDN', 'LSP P', 'LSP VSP', 'POC', 'POC MDN',
    'POC MON', 'POC RURAL', 'RURAL', 'VSD', 'VSD ', 'VSD MDN', 'VSP', 'VSP LPA', 'VSP LSP', 'VSP MDN', 'VSP P', 'pocrural'
]

diseases = [
    '-', 'Amputation majeure', 'Arthrite', 'Asthme', 'Cancer avancé', 'Cécité', 'Diabète contrôlé', 'Dyslipidémie',
    'Démence avancée', 'Hypertension', 'Hypothyroïdie', 'Insuffisance rénale chronique', 'Maladie cardiovasculaire grave',
    'Maladie de Parkinson avancée', 'Maladie pulmonaire obstructive chronique sévère', 'Quadriplégie', 'Sclérose en plaques',
    'Surdité partielle', 'Surdité profonde', 'Troubles visuels légers'
]

def encode_new_instance(new_instance, min_max_values):
    encoded_instance = []

    # Normalize numerical features
    encoded_instance.append((float(new_instance['Age']) - min_max_values['Age'][0]) / (min_max_values['Age'][1] - min_max_values['Age'][0]))
    encoded_instance.append((float(new_instance['Salary'].replace(' DA', '').replace(' ', '').replace(',', '.')) - min_max_values['Salary'][0]) / (min_max_values['Salary'][1] - min_max_values['Salary'][0]))
    encoded_instance.append(1.0 if new_instance['Have_other_Credits'].lower() == 'yes' else 0.0)
    encoded_instance.append((float(new_instance['Requested_Credit'].replace(' DA', '').replace(' ', '').replace(',', '.')) - min_max_values['Requested_Credit'][0]) / (min_max_values['Requested_Credit'][1] - min_max_values['Requested_Credit'][0]))
    encoded_instance.append((float(new_instance['DTI_Ratio']) - min_max_values['DTI_Ratio'][0]) / (min_max_values['DTI_Ratio'][1] - min_max_values['DTI_Ratio'][0]))

    # One-hot encode Credit_Type
    for ct in credit_types:
        encoded_instance.append(1 if new_instance['Credit_Type'] == ct else 0)

    # One-hot encode Disease/Disability
    for disease in diseases:
        encoded_instance.append(1 if new_instance['Disease/Disability'] == disease else 0)

    # One-hot encode Job
    jobs = ['PB', 'PR', 'R']
    for job in jobs:
        encoded_instance.append(1 if new_instance['Job'] == job else 0)

    # Encode Disability Status
    encoded_instance.append(1 if new_instance['Disability_Status_With Disability'] else 0)
    encoded_instance.append(0 if new_instance['Disability_Status_With Disability'] else 1)

    return np.array(encoded_instance).reshape(1, -1)

def generate_shap_plot(encoded_instance, model, feature_names):
    # Create a SHAP explainer
    explainer = shap.TreeExplainer(model)

    # Calculate SHAP values
    shap_values = explainer.shap_values(encoded_instance)

    # Extract SHAP values for the positive class
    shap_values_positive = shap_values[1][0]

    # Get the feature importance values and their indices
    shap_values_importance = np.abs(shap_values_positive)
    sorted_indices = np.argsort(shap_values_importance)[-10:]

    # French translations for feature names
    feature_names_french = {
        'Age': 'Âge',
        'Salary': 'Salaire',
        'Have_other_Credits': 'Avez-vous d\'autres crédits ?',
        'Requested_Credit': 'Crédit demandé',
        'DTI_Ratio': 'Ratio de la dette au revenu',
        'ACHAT LOGEMENT FINI': 'Achat de logement fini',
        'ACHAT TERRAIN': 'Achat de terrain',
        'ACHAT TERRAIN MDN': 'Achat de terrain (MDN)',
        'ACHAT VEHICULE': 'Achat de véhicule',
        'AMENAGEMENT': 'Aménagement',
        'CBEP': 'CBEP',
        'CON': 'CON',
        'CONS': 'Crédit consommation',
        'CONSOMMATION MDN': 'Crédit consommation (MDN)',
        'CPEP': 'CPEP',
        'LOCATION': 'Location',
        'LOGMT FINI': 'Logement fini',
        'LPA': 'LPA',
        'LPA VSP': 'LPA VSP',
        'LPP': 'LPP',
        'LSP': 'LSP',
        'LSP DGSN': 'LSP DGSN',
        'LSP MDN': 'LSP MDN',
        'LSP P': 'LSP P',
        'LSP VSP': 'LSP VSP',
        'POC': 'POC',
        'POC MDN': 'POC MDN',
        'POC MON': 'POC MON',
        'POC RURAL': 'POC RURAL',
        'RURAL': 'Rural',
        'VSD': 'VSD',
        'VSD MDN': 'VSD MDN',
        'VSP': 'VSP',
        'VSP LPA': 'VSP LPA',
        'VSP LSP': 'VSP LSP',
        'VSP MDN': 'VSP MDN',
        'VSP P': 'VSP P',
        'pocrural': 'POCRURAL',
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
        'Troubles visuels légers': 'Troubles visuels légers',
        'PB': 'Secteur public',
        'PR': 'Secteur privé',
        'R': 'Retraité',
        'Disability_Status_With Disability': 'Avec handicap',
        'Disability_Status_Without Disability': 'Sans handicap'
    }

    # Get the feature names and SHAP values for the top features
    top_features = [feature_names_french[feature_names[i]] for i in sorted_indices]
    top_shap_values = shap_values_positive[sorted_indices]

    # Create the bar plot with custom colors
    plt.figure(figsize=(10, 6))
    bars = plt.barh(range(len(top_features)), top_shap_values, color=['green' if val > 0 else 'red' for val in top_shap_values])
    plt.yticks(range(len(top_features)), top_features)
    plt.xlabel('Valeur SHAP (impact sur le résultat du modèle)')
    plt.title('Analyse du résultat')

    # Save the plot to a BytesIO object
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)

    return img

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    print("Received data:", data)
    
    # Extract data from request
    age = data.get('age', '')
    disease = data.get('disease', '-')
    salary = data.get('salary', '')
    job = data.get('job', '')
    have_other_credits = data.get('otherCredits', '0')
    requested_credit = data.get('requestedCredits', '')
    credit_type = data.get('creditType', '')
    disability_status = data.get('disabilityStatus', False)
    
    # Calculate DTI Ratio
    if float(salary) > 0:
        dti_ratio = float(requested_credit) / float(salary)
    else:
        dti_ratio = 0
    
    # Create a new instance dictionary
    new_instance_dict = {
        'Age': age,
        'Disease/Disability': disease,
        'Salary': salary,
        'Job': job,
        'Have_other_Credits': have_other_credits,
        'Requested_Credit': requested_credit,
        'Credit_Type': credit_type,
        'DTI_Ratio': dti_ratio,
        'Disability_Status_With Disability': disability_status
    }

    # Encode the new instance
    encoded_instance = encode_new_instance(new_instance_dict, min_max_values)
    print("Encoded instance:", encoded_instance)
    
    # Get the probability of the positive class (class 1)
    probability = model.predict_proba(encoded_instance)[0][1]
    print("Prediction probability:", probability)

    # Define feature names
    feature_names = ['Age', 'Salary', 'Have_other_Credits', 'Requested_Credit', 'DTI_Ratio'] + credit_types + diseases + ['PB', 'PR', 'R', 'Disability_Status_With Disability', 'Disability_Status_Without Disability']

    # Generate SHAP plot
    img = generate_shap_plot(encoded_instance, model, feature_names)
    
    return jsonify({'prediction': probability})

@app.route('/shap_plot', methods=['GET'])
def shap_plot():
    data = request.args
    print("Received data for SHAP plot:", data)
    
    # Extract data from request
    age = data.get('age', '')
    disease = data.get('disease', '-')
    salary = data.get('salary', '')
    job = data.get('job', '')
    have_other_credits = data.get('otherCredits', '0')
    requested_credit = data.get('requestedCredits', '')
    credit_type = data.get('creditType', '')
    disability_status = data.get('disabilityStatus', 'False')
    
    # Calculate DTI Ratio
    if float(salary) > 0:
        dti_ratio = float(requested_credit) / float(salary)
    else:
        dti_ratio = 0
    
    # Create a new instance dictionary
    new_instance_dict = {
        'Age': age,
        'Disease/Disability': disease,
        'Salary': salary,
        'Job': job,
        'Have_other_Credits': have_other_credits,
        'Requested_Credit': requested_credit,
        'Credit_Type': credit_type,
        'DTI_Ratio': dti_ratio,
        'Disability_Status_With Disability': disability_status.lower() == 'true'
    }

    # Encode the new instance
    encoded_instance = encode_new_instance(new_instance_dict, min_max_values)
    print("Encoded instance:", encoded_instance)
    
    # Define feature names
    feature_names = ['Age', 'Salary', 'Have_other_Credits', 'Requested_Credit', 'DTI_Ratio'] + credit_types + diseases + ['PB', 'PR', 'R', 'Disability_Status_With Disability', 'Disability_Status_Without Disability']

    # Generate SHAP plot
    img = generate_shap_plot(encoded_instance, model, feature_names)
    
    return send_file(img, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)
