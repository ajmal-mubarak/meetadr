export interface HealthCondition {
  letter: string;
  name: string;
  specialist: string;
  specialtyQuery: string;
  description: string;
}

export const HEALTH_CONDITIONS: HealthCondition[] = [
  // A
  {
    letter: 'A',
    name: 'Allergies & Asthma',
    specialist: 'Allergist / Immunologist',
    specialtyQuery: 'Allergy',
    description: 'Seasonal allergies, allergic rhinitis, asthma & breathing issues',
  },
  {
    letter: 'A',
    name: 'Anxiety & Depression',
    specialist: 'Psychiatrist / Psychologist',
    specialtyQuery: 'Psychiatry',
    description: 'Stress management, mood disorders, panic & generalized anxiety',
  },
  {
    letter: 'A',
    name: 'Arthritis & Joint Inflammation',
    specialist: 'Rheumatologist',
    specialtyQuery: 'Rheumatology',
    description: 'Osteoarthritis, rheumatoid arthritis, gout & chronic joint stiffness',
  },
  // B
  {
    letter: 'B',
    name: 'Back Pain & Spine',
    specialist: 'Orthopedic Surgeon / Physio',
    specialtyQuery: 'Orthopedics',
    description: 'Lower back stiffness, herniated discs, sciatica & spine strain',
  },
  {
    letter: 'B',
    name: 'Bronchitis & Cough',
    specialist: 'Pulmonologist / GP',
    specialtyQuery: 'General Practice',
    description: 'Persistent chest cough, wheezing, respiratory infections',
  },
  // C
  {
    letter: 'C',
    name: 'Chest Pain & Hypertension',
    specialist: 'Cardiologist',
    specialtyQuery: 'Cardiology',
    description: 'High blood pressure, palpitations, angina & preventive cardiology',
  },
  {
    letter: 'C',
    name: 'Chronic Migraine',
    specialist: 'Neurologist',
    specialtyQuery: 'Neurology',
    description: 'Severe headaches, aura, light sensitivity & nerve pain',
  },
  // D
  {
    letter: 'D',
    name: 'Diabetes & Thyroid',
    specialist: 'Endocrinologist',
    specialtyQuery: 'Endocrinology',
    description: 'Blood sugar regulation, HbA1c screening, thyroid nodules & fatigue',
  },
  {
    letter: 'D',
    name: 'Dermatitis & Eczema',
    specialist: 'Dermatologist',
    specialtyQuery: 'Dermatology',
    description: 'Dry itchy patches, psoriasis, acne, hives & fungal rashes',
  },
  // E
  {
    letter: 'E',
    name: 'Ear Infection & Hearing',
    specialist: 'ENT Specialist',
    specialtyQuery: 'ENT',
    description: 'Earache, tinnitus, sinus congestion & tonsillitis',
  },
  {
    letter: 'E',
    name: 'Eye Strain & Vision',
    specialist: 'Ophthalmologist',
    specialtyQuery: 'Ophthalmology',
    description: 'Blurry vision, dry eyes, glaucoma checkups & cornea health',
  },
  // G
  {
    letter: 'G',
    name: 'GERD & Acid Reflux',
    specialist: 'Gastroenterologist',
    specialtyQuery: 'Gastroenterology',
    description: 'Heartburn, digestive discomfort, IBS, gastritis & ulcer management',
  },
  // H
  {
    letter: 'H',
    name: 'Hair Loss & Alopecia',
    specialist: 'Dermatologist / Trichologist',
    specialtyQuery: 'Dermatology',
    description: 'Scalp irritation, thinning hair, alopecia areata & platelet therapy',
  },
  // N
  {
    letter: 'N',
    name: 'Neck & Shoulder Stiffness',
    specialist: 'Orthopedic / Physio',
    specialtyQuery: 'Orthopedics',
    description: 'Postural cervical strain, pinched nerve & rotator cuff issues',
  },
  // P
  {
    letter: 'P',
    name: 'Pediatric Fever & Checkups',
    specialist: 'Pediatrician',
    specialtyQuery: 'Pediatrics',
    description: 'Childhood vaccinations, high fever, developmental checks & cough',
  },
  // S
  {
    letter: 'S',
    name: 'Sleep Apnea & Insomnia',
    specialist: 'Pulmonologist / Neurologist',
    specialtyQuery: 'Neurology',
    description: 'Snoring, daytime exhaustion, sleep tracking & CPAP evaluation',
  },
  // W
  {
    letter: 'W',
    name: 'Women Health & Obstetrics',
    specialist: 'Gynecologist / Obstetrician',
    specialtyQuery: 'Obstetrics & Gynecology',
    description: 'Annual pelvic screening, pregnancy care, PCOS & hormonal health',
  },
];

export const CONDITION_LETTERS = ['All', 'A', 'B', 'C', 'D', 'E', 'G', 'H', 'N', 'P', 'S', 'W'];
