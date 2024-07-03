import Swal from 'sweetalert2';

export const validateCINLength = (cin:any) => {
    if (cin.length > 8) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Le CIN doit comporter au maximum 8 caractères.',
      });
      return false;
    }
    return true;
  };