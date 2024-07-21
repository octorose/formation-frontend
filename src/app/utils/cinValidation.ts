import Swal from 'sweetalert2';

export const validateCINLength = (cin: string) => {
  // Expression régulière pour valider le CIN
  const regex = /^[a-zA-Z]{1,2}\d{4,6}$/;

  // Vérifiez la longueur du CIN
  if (cin.length > 8) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Le CIN doit comporter au maximum 8 caractères.',
    });
    return false;
  }

  // Vérifiez le format du CIN
  if (!regex.test(cin)) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Le CIN doit commencer par une ou deux lettres suivies de 4 à 6 chiffres.',
    });
    return false;
  }

  return true;
};
